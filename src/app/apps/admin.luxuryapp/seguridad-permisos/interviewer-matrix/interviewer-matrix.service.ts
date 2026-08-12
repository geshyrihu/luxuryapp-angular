import { inject, Injectable } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { EndpointsSelectItem } from "src/app/core/constants/endpoints/select-item.endpoints";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  InterviewerMatrixCreateOrUpdateDto,
  InterviewerMatrixItemDto,
} from "./interfaces/interviewer-matrix.dto";

@Injectable({ providedIn: "root" })
export class InterviewerMatrixService {
  private api = inject(ApiResponseService);

  getByCustomer(customerId: string) {
    return this.api.onGetItem<InterviewerMatrixItemDto[]>(
      EndpointsReclutamiento.InterviewerMatrix.byCustomer(customerId),
    );
  }

  create(dto: InterviewerMatrixCreateOrUpdateDto) {
    return this.api.onPost<InterviewerMatrixItemDto>(
      EndpointsReclutamiento.InterviewerMatrix.base,
      dto,
    );
  }

  update(id: string, dto: InterviewerMatrixCreateOrUpdateDto) {
    return this.api.onPut<InterviewerMatrixItemDto>(
      `${EndpointsReclutamiento.InterviewerMatrix.base}/${id}`,
      dto,
    );
  }

  remove(id: string) {
    return this.api.onDelete(
      `${EndpointsReclutamiento.InterviewerMatrix.base}/${id}`,
    );
  }

  getCustomers() {
    return this.api.onGetSelectItem<SelectItemDto[]>(
      EndpointsSelectItem.SelectItems.customersActive,
    );
  }

  getRoles() {
    return this.api.onGetEnumSelectItem<SelectItemDto[]>(
      EndpointsSelectItem.SelectItems.applicationRoles,
    );
  }
}
