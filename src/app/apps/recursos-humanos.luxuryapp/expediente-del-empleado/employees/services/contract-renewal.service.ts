import { Injectable, computed, effect, inject, signal } from "@angular/core";
import { EndpointsRecursosHumanos } from "src/app/core/constants/endpoints/recursos-humanos.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ContractRenewalEvaluationDTO } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employees/interfaces/contract-renewal.dto";

@Injectable({
  providedIn: "root",
})
export class ContractRenewalService {
  private _apiResponseS = inject(ApiResponseService);

  // ==========================================================================
  // STATE SIGNALS (WritableSignal)
  // ==========================================================================
  renewals = signal<ContractRenewalEvaluationDTO[]>([]);
  selectedRenewal = signal<ContractRenewalEvaluationDTO | null>(null);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);
  errorMessage = signal<string>("");

  // ==========================================================================
  // COMPUTED SIGNALS (Read-only derived state)
  // ==========================================================================
  pendingRenewals = computed(() =>
    this.renewals().filter((r) => r.status === "EnAnalisis")
  );

  decidedRenewals = computed(() =>
    this.renewals().filter((r) => r.status === "Decidido")
  );

  isDataReady = computed(() => !this.isLoading() && this.renewals().length >= 0);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================
  constructor() {
    effect(() => {
      const renewals = this.renewals();
      if (renewals.length > 0) {
        console.log(`[ContractRenewalService] ${renewals.length} renewals loaded`);
      }
    });
  }

  // ==========================================================================
  // PUBLIC METHODS - READ OPERATIONS (Return Promises)
  // ==========================================================================

  async loadAll(customerId: string, forceRefresh = false): Promise<void> {
    if (this.renewals().length > 0 && !forceRefresh) {
      return; // Use cache
    }

    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set("");

    try {
      const data = await this._apiResponseS.onGetList<ContractRenewalEvaluationDTO[]>(
        EndpointsRecursosHumanos.HR.ContractRenewal.getAll
      );
      this.renewals.set(data ?? []);
    } catch (error) {
      this.hasError.set(true);
      this.errorMessage.set("Error al cargar renovaciones");
      console.error("[ContractRenewalService] Error loading renewals:", error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async loadByContract(
    employeeWorkContractId: string
  ): Promise<ContractRenewalEvaluationDTO[]> {
    try {
      const data = await this._apiResponseS.onGetList<ContractRenewalEvaluationDTO[]>(
        EndpointsRecursosHumanos.HR.ContractRenewal.getByContract(employeeWorkContractId)
      );
      return data ?? [];
    } catch (error) {
      console.error(
        "[ContractRenewalService] Error loading renewals by contract:",
        error
      );
      return [];
    }
  }

  async getById(id: string): Promise<ContractRenewalEvaluationDTO | null> {
    // Check cache first
    const cached = this.renewals().find((r) => r.id === id);
    if (cached) return cached;

    try {
      const data = await this._apiResponseS.onGetItem<ContractRenewalEvaluationDTO>(
        EndpointsRecursosHumanos.HR.ContractRenewal.getById(id)
      );
      return data ?? null;
    } catch (error) {
      console.error("[ContractRenewalService] Error getting renewal by ID:", error);
      return null;
    }
  }

  // ==========================================================================
  // PUBLIC METHODS - WRITE OPERATIONS (Return Promises)
  // ==========================================================================

  async registerDecision(
    id: string,
    decision: "Renovar" | "NoRenovar" | "RenovarConCambios",
    decisionDate: string,
    comments?: string,
    justification?: string
  ): Promise<ContractRenewalEvaluationDTO | null> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const response = await this._apiResponseS.onPost<ContractRenewalEvaluationDTO>(
        EndpointsRecursosHumanos.HR.ContractRenewal.registerDecision(id),
        {
          decision,
          decisionDate,
          comments,
          justification,
        }
      );

      // Handle false return (error case)
      if (response === false) {
        return null;
      }

      // Update local state
      if (response) {
        this.renewals.update((list) =>
          list.map((r) => (r.id === id ? response : r))
        );
      }

      return response ?? null;
    } catch (error) {
      this.hasError.set(true);
      console.error("[ContractRenewalService] Error registering decision:", error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  async linkPerformanceEvaluation(
    evaluationId: string,
    performanceEvaluationId: string
  ): Promise<ContractRenewalEvaluationDTO | null> {
    this.isLoading.set(true);
    this.hasError.set(false);

    try {
      const response = await this._apiResponseS.onPost<ContractRenewalEvaluationDTO>(
        EndpointsRecursosHumanos.HR.ContractRenewal.linkPerformanceEvaluation(evaluationId),
        { performanceEvaluationId }
      );

      // Handle false return (error case)
      if (response === false) {
        return null;
      }

      // Update local state
      if (response) {
        this.renewals.update((list) =>
          list.map((r) => (r.id === evaluationId ? response : r))
        );
      }

      return response ?? null;
    } catch (error) {
      this.hasError.set(true);
      console.error(
        "[ContractRenewalService] Error linking performance evaluation:",
        error
      );
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  // ==========================================================================
  // CACHE MANAGEMENT
  // ==========================================================================

  clearStore(): void {
    this.renewals.set([]);
    this.selectedRenewal.set(null);
    this.isLoading.set(false);
    this.hasError.set(false);
    this.errorMessage.set("");
  }

  setSelectedRenewal(renewal: ContractRenewalEvaluationDTO | null): void {
    this.selectedRenewal.set(renewal);
  }

  setRenewals(renewals: ContractRenewalEvaluationDTO[]): void {
    this.renewals.set(renewals);
  }
}