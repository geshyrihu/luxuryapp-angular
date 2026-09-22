import { Injectable, inject } from "@angular/core";
import { EndpointsOperations } from "@core/constants/endpoints/operations.endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { OperationalMetricsDTO } from "../interfaces/operational-metrics.dto";
import { MaintenanceOrdersByCategoryDto } from "../interfaces/maintenance-orders.dto";
import { TicketsByGroupDTO } from "../interfaces/tickets-by-group.dto";
import { ContractsExpiringDTO } from "../interfaces/contracts-expiring.dto";

@Injectable({
  providedIn: "root",
})
export class DashboardMetricsService {
  private apiResponseS = inject(ApiResponseService);

  async getOperationalMetrics(
    fechaInicio: string,
    fechaFin: string,
    customerId: string,
    tipoOperacion: string,
  ): Promise<OperationalMetricsDTO | null> {
    const params = new URLSearchParams();
    if (fechaInicio) params.append("fechaInicio", fechaInicio);
    if (fechaFin) params.append("fechaFin", fechaFin);
    if (customerId) params.append("customerId", customerId);
    if (tipoOperacion) params.append("tipoOperacion", tipoOperacion);

    const url = EndpointsOperations.Dashboard.operationalMetrics(
      params.toString(),
    );
    const res = await this.apiResponseS.onGetItem<OperationalMetricsDTO>(url);
    return res ?? null;
  }

  async getMaintenanceOrdersByCategory(
    customerId?: string,
    month: number = 0,
    year: number = 0,
  ): Promise<MaintenanceOrdersByCategoryDto | null> {
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId);
    params.append("month", month.toString());
    params.append("year", year.toString());

    const url = EndpointsOperations.Dashboard.maintenanceOrders(
      params.toString(),
    );
    const res = await this.apiResponseS.onGetItem<MaintenanceOrdersByCategoryDto>(url);
    return res ?? null;
  }

  async getTicketsByGroup(
    customerId?: string,
    month: number = 0,
    year: number = 0,
  ): Promise<TicketsByGroupDTO | null> {
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId);
    params.append("month", month.toString());
    params.append("year", year.toString());

    const url = EndpointsOperations.Dashboard.ticketsByGroup(
      params.toString(),
    );
    const res = await this.apiResponseS.onGetItem<TicketsByGroupDTO>(url);
    return res ?? null;
  }

  async getContractsExpiring(
    customerId?: string,
  ): Promise<ContractsExpiringDTO | null> {
    const params = new URLSearchParams();
    if (customerId) params.append("customerId", customerId);

    const url = EndpointsOperations.Dashboard.contractsExpiring(
      params.toString(),
    );
    const res = await this.apiResponseS.onGetItem<ContractsExpiringDTO>(url);
    return res ?? null;
  }
}
