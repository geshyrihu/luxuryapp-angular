import { Injectable, computed, inject, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EndpointsLegalEmployees } from "src/app/core/constants/endpoints/legal.endpoints";

export interface LegalEmployeeDTO {
  workPositionId: string;
  employeeId: string;
  fullName: string;
  photoUrl: string | null;
  department: string;
  hasActiveContract: boolean;
  activeContractId: string | null;
  workPositionFolio: string | null;
  workPositionName: string | null;
  photoPath: string | null;
}

@Injectable({ providedIn: "root" })
export class LegalEmployeeService {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  readonly employees = signal<LegalEmployeeDTO[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly employeesByDepartment = computed(() =>
    [...this.employees()].sort((a, b) =>
      a.department.localeCompare(b.department) || a.fullName.localeCompare(b.fullName),
    ),
  );

  async loadActiveEmployees(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      this.employees.set([]);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    try {
      const result = await this.apiS.onGetList<LegalEmployeeDTO[]>(
        EndpointsLegalEmployees.Employees.getActiveByCustomer(customerId),
      );
      this.employees.set(result ?? []);
    } catch {
      this.error.set("No se pudieron cargar los empleados activos.");
      this.employees.set([]);
    } finally {
      this.loading.set(false);
    }
  }
}
