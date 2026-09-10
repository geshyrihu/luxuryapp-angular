import { inject, Injectable, signal } from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  EquipmentInspectionDefinitionAddOrEditDTO,
  EquipmentInspectionDefinitionDTO,
  EquipmentInspectionDefinitionListDTO,
  EquipmentInspectionExecutionAdministrativeUpdateDTO,
  EquipmentInspectionExecutionCompleteDTO,
  EquipmentInspectionExecutionDetailDTO,
  EquipmentInspectionExecutionListDTO,
  EquipmentQrBatchDownloadDTO,
  EquipmentQrDownloadItemDTO,
  EquipmentQrLabelAddOrEditDTO,
  EquipmentQrLabelDTO,
  EquipmentQrLabelListDTO,
  EquipmentQrResolveDTO,
} from "./equipment-inspection.models";

@Injectable({
  providedIn: "root",
})
export class EquipmentInspectionService {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  executionRefreshVersion = signal(0);

  recurrenceOptions: SelectItemDto[] = [
    { label: "Diaria", value: 1 },
    { label: "Semanal", value: 2 },
    { label: "Mensual", value: 3 },
  ];

  severityOptions: SelectItemDto[] = [
    { label: "Normal", value: 1 },
    { label: "No Grave", value: 2 },
    { label: "Urgente", value: 3 },
  ];

  qrTypeOptions: SelectItemDto[] = [
    { label: "Inspeccion", value: 1 },
    { label: "Ficha Tecnica", value: 2 },
    { label: "Interno", value: 3 },
  ];

  weekDayOptions: SelectItemDto[] = [
    { label: "Domingo", value: 0 },
    { label: "Lunes", value: 1 },
    { label: "Martes", value: 2 },
    { label: "Miercoles", value: 3 },
    { label: "Jueves", value: 4 },
    { label: "Viernes", value: 5 },
    { label: "Sabado", value: 6 },
  ];

  async getDefinitionsByMachinery(machineryId: string) {
    return await this.apiResponseS.onGetList<
      EquipmentInspectionDefinitionListDTO[]
    >(Endpoints.EquipmentInspectionDefinitions.byMachinery(machineryId));
  }

  async getDefinitionById(id: string) {
    return await this.apiResponseS.onGetItem<EquipmentInspectionDefinitionDTO>(
      Endpoints.EquipmentInspectionDefinitions.getById(id),
    );
  }

  async createDefinition(dto: EquipmentInspectionDefinitionAddOrEditDTO) {
    return await this.apiResponseS.onPost<EquipmentInspectionDefinitionDTO>(
      Endpoints.EquipmentInspectionDefinitions.create,
      dto,
    );
  }

  async updateDefinition(
    id: string,
    dto: EquipmentInspectionDefinitionAddOrEditDTO,
  ) {
    return await this.apiResponseS.onPut<EquipmentInspectionDefinitionDTO>(
      Endpoints.EquipmentInspectionDefinitions.update(id),
      dto,
    );
  }

  async toggleDefinition(id: string, isActive: boolean) {
    return await this.apiResponseS.onPut<boolean>(
      Endpoints.EquipmentInspectionDefinitions.toggleActive(id, isActive),
      {},
    );
  }

  async deleteDefinition(id: string) {
    return await this.apiResponseS.onDelete(
      Endpoints.EquipmentInspectionDefinitions.delete(id),
    );
  }

  async getUserOptionsByCustomer() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return [];
    }

    const result = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.usersByCustomer(customerId),
    );

    return result || [];
  }

  async getExecutionsByMachinery(machineryId: string) {
    return await this.apiResponseS.onGetList<
      EquipmentInspectionExecutionListDTO[]
    >(Endpoints.EquipmentInspectionExecutions.byMachinery(machineryId));
  }

  async getPendingExecutionsByCustomer() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return [];
    }

    const result = await this.apiResponseS.onGetList<
      EquipmentInspectionExecutionListDTO[]
    >(Endpoints.EquipmentInspectionExecutions.pending(customerId));

    return result || [];
  }

  async getExecutionById(id: string) {
    return await this.apiResponseS.onGetItem<EquipmentInspectionExecutionDetailDTO>(
      Endpoints.EquipmentInspectionExecutions.getById(id),
    );
  }

  async startManualExecution(definitionId: string) {
    return await this.apiResponseS.onPost<EquipmentInspectionExecutionDetailDTO>(
      Endpoints.EquipmentInspectionExecutions.startManual(definitionId),
      {},
    );
  }

  async completeExecution(
    id: string,
    dto: EquipmentInspectionExecutionCompleteDTO,
  ) {
    return await this.apiResponseS.onPut<EquipmentInspectionExecutionDetailDTO>(
      Endpoints.EquipmentInspectionExecutions.complete(id),
      dto,
    );
  }

  async administrativeUpdateExecution(
    id: string,
    dto: EquipmentInspectionExecutionAdministrativeUpdateDTO,
  ) {
    return await this.apiResponseS.onPut<EquipmentInspectionExecutionDetailDTO>(
      Endpoints.EquipmentInspectionExecutions.administrativeUpdate(id),
      dto,
    );
  }

  notifyExecutionChanged() {
    this.executionRefreshVersion.update((value) => value + 1);
  }

  async startFromQrExecution(code: string, definitionId: string | null) {
    const customerId = this.customerIdS.customerId();
    if (!customerId) {
      return false;
    }

    return await this.apiResponseS.onPost<EquipmentInspectionExecutionDetailDTO>(
      Endpoints.EquipmentInspectionExecutions.startFromQr,
      {
        customerId,
        code,
        definitionId,
      },
    );
  }

  async getQrLabelsByMachinery(machineryId: string) {
    return await this.apiResponseS.onGetList<EquipmentQrLabelListDTO[]>(
      Endpoints.EquipmentQrLabels.byMachinery(machineryId),
    );
  }

  async getQrLabelById(id: string) {
    return await this.apiResponseS.onGetItem<EquipmentQrLabelDTO>(
      Endpoints.EquipmentQrLabels.getById(id),
    );
  }

  async createQrLabel(dto: EquipmentQrLabelAddOrEditDTO) {
    return await this.apiResponseS.onPost<EquipmentQrLabelDTO>(
      Endpoints.EquipmentQrLabels.create,
      dto,
    );
  }

  async regenerateQrLabel(id: string) {
    return await this.apiResponseS.onPost<EquipmentQrLabelDTO>(
      Endpoints.EquipmentQrLabels.regenerate(id),
      {},
    );
  }

  async downloadQrLabel(id: string) {
    return await this.apiResponseS.onGetItem<EquipmentQrDownloadItemDTO>(
      Endpoints.EquipmentQrLabels.download(id),
    );
  }

  async downloadQrBatch(dto: EquipmentQrBatchDownloadDTO) {
    return await this.apiResponseS.onPost<EquipmentQrDownloadItemDTO[]>(
      Endpoints.EquipmentQrLabels.downloadBatch,
      dto,
    );
  }

  async resolveQrLabel(code: string) {
    return await this.apiResponseS.onGetItem<EquipmentQrResolveDTO>(
      Endpoints.EquipmentQrLabels.resolve(code),
    );
  }

  getRecurrenceLabel(
    recurrenceUnit: number,
    recurrenceInterval: number,
    dayOfMonth: number | null,
  ) {
    if (recurrenceUnit === 1) {
      return `Cada ${recurrenceInterval} dia(s)`;
    }

    if (recurrenceUnit === 2) {
      return `Cada ${recurrenceInterval} semana(s)`;
    }

    if (dayOfMonth) {
      return `Cada ${recurrenceInterval} mes(es), dia ${dayOfMonth}`;
    }

    return `Cada ${recurrenceInterval} mes(es)`;
  }

  getSeverityLabel(severity: number | null) {
    if (severity === 1) return "Normal";
    if (severity === 2) return "No Grave";
    if (severity === 3) return "Urgente";
    return "Sin cierre";
  }

  getSeverityTag(
    severity: number | null,
  ): "success" | "warn" | "danger" | "info" {
    if (severity === 1) return "success";
    if (severity === 2) return "warn";
    if (severity === 3) return "danger";
    return "info";
  }

  getStatusLabel(status: number) {
    if (status === 0) return "Pendiente";
    if (status === 1) return "Concluido";
    if (status === 3) return "Proceso";
    if (status === 4) return "Cancelado";
    return "No autorizado";
  }

  getStatusTag(
    status: number,
  ): "success" | "warn" | "danger" | "info" | "secondary" {
    if (status === 0) return "warn";
    if (status === 1) return "success";
    if (status === 3) return "info";
    if (status === 4) return "secondary";
    return "danger";
  }
}
