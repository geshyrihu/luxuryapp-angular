import {
  Injectable,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { cobranzaOnlineFilterState } from "./cobranza-online-filter.state";
import type { CobranzaOnlineDashboardResponse } from "../interfaces/cobranza-online-dashboard.model";
import type { CobranzaOnlineAnalysisResponse } from "../interfaces/cobranza-online-analysis.model";
import type { CobranzaOnlineSyncMetadata, CobranzaOnlineSyncResponse } from "../interfaces/cobranza-online-sync.model";

@Injectable()
export class CobranzaOnlineStoreService {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  // Filtros globales
  private year = cobranzaOnlineFilterState.year;
  private month = cobranzaOnlineFilterState.month;
  private day = cobranzaOnlineFilterState.day;

  // Estado del Caché
  readonly dashboardData = signal<CobranzaOnlineDashboardResponse | null>(null);
  readonly analysisData = signal<CobranzaOnlineAnalysisResponse | null>(null);
  readonly syncStatus = signal<CobranzaOnlineSyncMetadata | null>(null);
  readonly lastSyncDiagnostics = signal<any | null>(null);

  // Estados de carga
  readonly isLoading = signal(false); // Para carga inicial bloqueante
  readonly isSyncing = signal(false); // Para carga manual de boton
  readonly isSilentSyncing = signal(false); // Para carga verdaderamente de fondo

  private pollingIntervalId: any = null;

  constructor() {
    // Escuchar cambios en los filtros para recargar los datos
    effect(() => {
      const cId = this.customerIdS.customerId();
      const y = this.year();
      const m = this.month();
      const d = this.day();

      if (!cId) {
        this.clearStore();
        return;
      }

      // Al cambiar un filtro (cliente o fecha), limpiamos los datos anteriores 
      // y mostramos el loader bloqueante para dar feedback visual correcto.
      this.clearStore();
      void this.loadLocalData(cId, y, m, d, true);
    }, { allowSignalWrites: true });
  }

  /**
   * Carga los datos desde nuestra API (base de datos local) sin tocar Aspel directo
   * @param showLoader Si es true, pone `isLoading = true` (bloquea pantalla). 
   *                   Si es false, lo hace silenciosamente.
   */
  async loadLocalData(customerId: string, year: number, month: number, day: number, showLoader = false) {
    if (showLoader) {
      this.isLoading.set(true);
    }

    try {
      // Lanzamos las 3 peticiones en paralelo para rehidratar todo el store
      const [dashboard, analysis, status] = await Promise.all([
        this.apiResponseS.onGetItem<CobranzaOnlineDashboardResponse>(
          Endpoints.CobranzaOnline.Dashboard.get(customerId, year, month, day),
        ),
        this.apiResponseS.onGetItem<CobranzaOnlineAnalysisResponse>(
          Endpoints.CobranzaOnline.Dashboard.analysis(customerId, year, month, day),
        ),
        this.apiResponseS.onGetItem<CobranzaOnlineSyncMetadata>(
          Endpoints.CobranzaOnline.Dashboard.syncStatus(customerId, year),
        )
      ]);

      this.dashboardData.set(dashboard ?? null);
      this.analysisData.set(analysis ?? null);
      this.syncStatus.set(status ?? null);
    } catch (error) {
      console.error("Error cargando store de cobranza:", error);
    } finally {
      if (showLoader) {
        this.isLoading.set(false);
      }
    }
  }

  /**
   * Fuerza la petición directa al backend que a su vez se conecta a Aspel para 
   * sincronizar la base de datos (Sync.cobranza), y luego refresca silenciosamente 
   * nuestras señales.
   */
  async forceSyncWithAspel() {
    const customerId = this.customerIdS.customerId();
    if (!customerId || this.isSyncing() || this.isSilentSyncing()) return;

    this.isSyncing.set(true);
    
    try {
      const response = await this.apiResponseS.onPost<CobranzaOnlineSyncResponse>(
        Endpoints.CobranzaOnline.Sync.cobranza(customerId, this.year()),
        null,
        undefined,
        true // Manual sync shows loader
      );

      if (response) {
        this.lastSyncDiagnostics.set(response.diagnostics ?? null);
        // Despues de que Aspel actualizó nuestra base, recargamos el frontend de manera silenciosa
        await this.loadLocalData(customerId, this.year(), this.month(), this.day(), false);
      }
    } finally {
      this.isSyncing.set(false);
    }
  }

  async silentSyncWithAspel() {
    const customerId = this.customerIdS.customerId();
    if (!customerId || this.isSyncing() || this.isSilentSyncing()) return;

    this.isSilentSyncing.set(true);
    
    try {
      const response = await this.apiResponseS.onPost<CobranzaOnlineSyncResponse>(
        Endpoints.CobranzaOnline.Sync.cobranza(customerId, this.year()),
        null,
        undefined,
        false // Silent sync does not show loader
      );

      if (response) {
        this.lastSyncDiagnostics.set(response.diagnostics ?? null);
        await this.loadLocalData(customerId, this.year(), this.month(), this.day(), false);
      }
    } finally {
      this.isSilentSyncing.set(false);
    }
  }

  /**
   * Inicia el polling silencioso cada N milisegundos.
   * Llama a la sincronización profunda con Aspel.
   */
  startSilentPolling(intervalMs: number = 1200000) { // Default 20 min
    this.stopSilentPolling();
    this.pollingIntervalId = setInterval(() => {
      const cId = this.customerIdS.customerId();
      if (cId && !this.isSyncing() && !this.isSilentSyncing()) {
        void this.silentSyncWithAspel(); 
      }
    }, intervalMs);
  }

  /**
   * Detiene el polling silencioso.
   */
  stopSilentPolling() {
    if (this.pollingIntervalId) {
      clearInterval(this.pollingIntervalId);
      this.pollingIntervalId = null;
    }
  }

  /**
   * Limpia toda la data en memoria (ej. al desloguearse o perder el cliente).
   */
  clearStore() {
    this.dashboardData.set(null);
    this.analysisData.set(null);
    this.syncStatus.set(null);
    this.lastSyncDiagnostics.set(null);
  }
}
