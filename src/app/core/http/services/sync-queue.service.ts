import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpHeaders,
} from "@angular/common/http";
import { inject, Injectable, Injector } from "@angular/core";
import * as localforage from "localforage";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { ConnectivityService } from "../../services/connectivity.service";
import { ConsoleLoggerService } from "../../services/console-logger.service";

export const BYPASS_OFFLINE_INTERCEPTOR = new HttpContextToken<boolean>(
  () => false,
);

export interface SyncRequest {
  id: string;
  url: string;
  method: string;
  body: any;
  headers?: { [name: string]: string | string[] };
  params?: { [name: string]: string | string[] };
  timestamp: number;
}

@Injectable({
  providedIn: "root",
})
export class SyncQueueService {
  private injector = inject(Injector);
  private connectivityService = inject(ConnectivityService);
  private consoleLogger = inject(ConsoleLoggerService);

  // Inyección perezosa para evitar dependencia circular con offlineInterceptorFn -> HttpClient
  private get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  private queueSubject = new BehaviorSubject<number>(0);
  public queueLength$ = this.queueSubject.asObservable();

  private storeName = "sync-queue";

  constructor() {
    localforage.config({
      name: "LuxuryApp",
      storeName: this.storeName,
    });

    this.updateQueueLength();

    // Escuchar la reconexión para procesar la cola
    this.connectivityService.isOnline$.subscribe((isOnline) => {
      if (isOnline) {
        this.processQueue();
      }
    });
  }

  async enqueueRequest(request: SyncRequest): Promise<void> {
    try {
      const queue = await this.getQueue();
      queue.push(request);
      await localforage.setItem(this.storeName, queue);
      this.updateQueueLength();
      this.consoleLogger.custom(
        "📥",
        "#FFA500",
        "[SyncQueue] Petición encolada:",
        request.url,
      );
    } catch (error) {
      console.error("Error al encolar la petición", error);
    }
  }

  async getQueue(): Promise<SyncRequest[]> {
    const queue = await localforage.getItem<SyncRequest[]>(this.storeName);
    return queue || [];
  }

  private async updateQueueLength(): Promise<void> {
    const queue = await this.getQueue();
    this.queueSubject.next(queue.length);
  }

  async processQueue(): Promise<void> {
    let queue = await this.getQueue();
    if (queue.length === 0) return;

    this.consoleLogger.custom(
      "🔄",
      "#00BFFF",
      `[SyncQueue] Procesando ${queue.length} peticiones...`,
    );

    // Procesamos de forma secuencial
    for (let i = 0; i < queue.length; i++) {
      const req = queue[i];
      try {
        let headers = new HttpHeaders();
        if (req.headers) {
          Object.keys(req.headers).forEach((key) => {
            // Omitir header de Autorización ya que el jwtInterceptor lo agregará actualizado
            if (key.toLowerCase() !== "authorization") {
              headers = headers.set(key, req.headers![key]);
            }
          });
        }

        // Enviamos la petición ignorando el offlineInterceptor para no crear ciclos
        await firstValueFrom(
          this.http.request(req.method, req.url, {
            body: req.body,
            headers: headers,
            context: new HttpContext().set(BYPASS_OFFLINE_INTERCEPTOR, true),
          }),
        );

        this.consoleLogger.custom(
          "✅",
          "#32CD32",
          "[SyncQueue] Sincronizado:",
          req.url,
        );
      } catch (error) {
        this.consoleLogger.error(
          `[SyncQueue] Fallo al sincronizar: ${req.url}`,
          error,
        );

        // Si perdemos red en medio del procesamiento, detenemos el proceso
        if (!navigator.onLine) {
          this.consoleLogger.custom(
            "⏸️",
            "#FFA500",
            "[SyncQueue] Red perdida. Pausando sincronización.",
          );
          queue = queue.slice(i);
          await localforage.setItem(this.storeName, queue);
          this.updateQueueLength();
          return;
        }
        // Si hay red y falló, asumimos que el servidor la rechazó (ej. 400, 500) y la descartamos
        // para no bloquear la cola infinitamente. (Se podría enviar a una cola de errores en el futuro).
      }
    }

    // Vaciar la cola al terminar exitosamente o si se descartaron las fallidas
    await localforage.setItem(this.storeName, []);
    this.updateQueueLength();
    this.consoleLogger.custom("🎉", "#32CD32", "[SyncQueue] Cola vacía!");
  }
}
