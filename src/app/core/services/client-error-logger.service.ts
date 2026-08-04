import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

interface ClientErrorLog {
  level: "error" | "warn" | "info" | "debug";
  message: string;
  details?: string;
  userAgent: string;
  url?: string;
  timestamp: string;
}

/**
 * Servicio para capturar y enviar errores del frontend al servidor.
 * Útil para diagnosticar issues en producción (especialmente mobile/iPhone).
 *
 * Uso automático:
 * - En app.component.ts: inyectar el servicio en el constructor
 * - Automáticamente intercepta errores y los envía
 *
 * Uso manual:
 * ```typescript
 * this.clientErrorLogger.logError("Mi error", "Detalles adicionales");
 * ```
 */
@Injectable({
  providedIn: "root",
})
export class ClientErrorLoggerService {
  private http = inject(HttpClient);
  private endpoint = "api/logs/client-error";

  constructor() {
    this.interceptErrors();
  }

  /**
   * Intercepta errores globales no capturados.
   */
  private interceptErrors(): void {
    // Capturar errores no manejados
    window.addEventListener("error", (event) => {
      this.logError(
        `[UNCAUGHT_ERROR] ${event.message}`,
        `${event.filename}:${event.lineno}:${event.colno}`,
        "error",
      );
    });

    // Capturar promesas rechazadas no manejadas
    window.addEventListener("unhandledrejection", (event) => {
      const reason = event.reason || "Unknown error";
      this.logError(
        `[UNHANDLED_PROMISE] ${String(reason)}`,
        undefined,
        "error",
      );
    });
  }

  /**
   * Registra un error en el servidor.
   * Reintenta automáticamente si falla.
   */
  logError(
    message: string,
    details?: string,
    level: "error" | "warn" | "info" | "debug" = "error",
  ): void {
    const log: ClientErrorLog = {
      level,
      message: message.substring(0, 300),
      details: details?.substring(0, 500),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `[ClientErrorLogger] Enviando ${level}: ${message.substring(0, 100)}...`,
    );

    // Enviar al servidor sin bloquear
    this.http.post(this.endpoint, log).subscribe({
      next: (response: any) => {
        console.log("[ClientErrorLogger] ✓ Log enviado al servidor", response);
      },
      error: (err) => {
        console.warn("[ClientErrorLogger] ✗ No se pudo enviar log:", err);
        // Reintentar una vez después de 2 segundos
        setTimeout(() => {
          this.http.post(this.endpoint, log).subscribe({
            next: () => {
              console.log("[ClientErrorLogger] ✓ Log enviado en reintento");
            },
            error: () => {
              console.warn("[ClientErrorLogger] ✗ Reintento fallido");
            },
          });
        }, 2000);
      },
    });
  }

  /**
   * Registra una advertencia.
   */
  logWarn(message: string, details?: string): void {
    this.logError(message, details, "warn");
  }

  /**
   * Registra información (debug).
   */
  logInfo(message: string, details?: string): void {
    this.logError(message, details, "info");
  }
}
