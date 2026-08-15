import { inject, Injectable } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import {
  InterviewerMatrixBoardDto,
} from "./interfaces/interviewer-matrix-board.dto";
import {
  InterviewerMatrixCreateOrUpdateDto,
} from "./interfaces/interviewer-matrix-create-or-update.dto";
import {
  InterviewerMatrixItemDto,
} from "./interfaces/interviewer-matrix-item.dto";

@Injectable({ providedIn: "root" })
export class InterviewerMatrixService {
  private api = inject(ApiResponseService);

  getByCustomer(customerId: string) {
    return this.api.onGetItem<InterviewerMatrixItemDto[]>(
      EndpointsReclutamiento.InterviewerMatrix.byCustomer(customerId),
    );
  }

  getBoard(customerId: string) {
    return this.api.onGetItem<InterviewerMatrixBoardDto>(
      EndpointsReclutamiento.InterviewerMatrix.board(customerId),
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
}
