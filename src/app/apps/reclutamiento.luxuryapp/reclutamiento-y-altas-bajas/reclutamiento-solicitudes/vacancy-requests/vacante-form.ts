import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { RequestEmployeeRegisterAddOrEditDTO } from "../recruitment-requests/dtos/request-employee-register-add-or-edit.dto";
import { RequestEmployeeRegisterGetByIdDTO } from "../recruitment-requests/dtos/request-employee-register-get-by-id.dto";

interface RequestEmployeeRegisterCreateDTO {
  additionalInformation: string;
  boss: string;
  candidateName: string;
  customerAddress: string;
  employeeId: string;
  positionRequestId: string;
  typeContractRegister: number;
}

interface RequestEmployeeRegisterDefaultsDTO {
  additionalInformation?: string | null;
  boss: string;
  candidateName: string;
  customerAddress: string;
  employeeId: string;
  positionRequestId?: string | null;
  typeContractRegister: number;
}

@Component({
  selector: "app-vacante-form",
  templateUrl: "./vacante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    LxCard,
  ],
})
export class VacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  private authS = inject(AuthService);
  private customerIdS = inject(CustomerIdService);
  submitting = signal(false);

  cb_status = signal<SelectItemDto[]>([]);
  cb_fuente = signal<SelectItemDto[]>([]);
  cb_candidate = signal<SelectItemDto[]>([]);
  id: string = "";
  requestEmployeeRegisterId = signal<string | null>(null);
  requestEmployeeRegisterData =
    signal<RequestEmployeeRegisterGetByIdDTO | null>(null);

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    folio: ["", Validators.required],
    status: [null as number | null, Validators.required],
    requestDate: [null as string | null, Validators.required],
    selectionDate: [null as string | null],
    entryDate: [null as string | null],
    observations: [""],
    workPositionId: [this.config.data.workPositionId],
    fuente: [this.config.data.workPositionId], // Keeping original logic despite looking odd
    candidateEmployeeId: [null as string | null],
  });

  async ngOnInit() {
    this.id = this.config.data.id;
    await Promise.all([
      this.loadSelectItems(),
      this.loadCandidateOptions(),
    ]);

    if (this.id) {
      this.form.controls.id.setValue(this.id);
      await this.onLoadData();
    }
  }

  private async loadSelectItems(): Promise<void> {
    this.cb_status.set(await firstValueFrom(this.enumSelectS.status()));
    this.cb_fuente.set(
      await firstValueFrom(this.enumSelectS.fuenteReclutamiento()),
    );
  }

  private async loadCandidateOptions(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;

    const employees = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.cb_candidate.set(employees ?? []);
  }

  async onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestPosition.getById(this.id);
    const result = await this.apiResponseS.onGetItem<any>(urlApi);
    if (!result) return;

    this.form.patchValue(result);
    await this.loadExistingCandidate(result.folio);
  }

  private async loadExistingCandidate(folio: number): Promise<void> {
    const requests = await this.apiResponseS.onGetList<any[]>(
      EndpointsReclutamiento.RequestEmployeeRegister.list,
    );
    if (!requests) return;

    const vacancyFolio = this.formatVacancyFolio(folio);
    const currentRequest = requests.find(
      (item) => item?.folioVacante === vacancyFolio,
    );

    if (!currentRequest?.id) return;

    this.requestEmployeeRegisterId.set(currentRequest.id);

    const detail =
      await this.apiResponseS.onGetItem<RequestEmployeeRegisterGetByIdDTO>(
        `${EndpointsReclutamiento.RequestEmployeeRegister.base}/${currentRequest.id}`,
      );
    if (!detail) return;

    this.requestEmployeeRegisterData.set(detail);
    this.form.patchValue({
      candidateEmployeeId: detail.employeeId ?? null,
    });
  }

  private formatVacancyFolio(folio: number): string {
    return `VAC${folio.toString().padStart(5, "0")}`;
  }

  private async syncCandidateRequest(): Promise<boolean> {
    const candidateEmployeeId = this.form.controls.candidateEmployeeId.value;
    if (!candidateEmployeeId || !this.id) return true;

    const requestEmployeeRegisterId = this.requestEmployeeRegisterId();
    if (requestEmployeeRegisterId) {
      return this.updateCandidateRequest(
        requestEmployeeRegisterId,
        candidateEmployeeId,
      );
    }

    return this.createCandidateRequest(candidateEmployeeId);
  }

  private async createCandidateRequest(
    candidateEmployeeId: string,
  ): Promise<boolean> {
    const customerId = this.customerIdS.customerId();
    if (!customerId || !this.id) return false;

    const defaults =
      await this.apiResponseS.onGetItem<RequestEmployeeRegisterDefaultsDTO>(
        EndpointsReclutamiento.RequestEmployeeRegister.getEmployeeRegister(
          candidateEmployeeId,
          customerId,
        ),
      );

    if (!defaults) return false;

    const payload: RequestEmployeeRegisterCreateDTO = {
      additionalInformation: defaults.additionalInformation ?? "",
      boss: defaults.boss,
      candidateName: defaults.candidateName,
      customerAddress: defaults.customerAddress,
      employeeId: candidateEmployeeId,
      positionRequestId: this.id,
      typeContractRegister: defaults.typeContractRegister,
    };

    const result = await this.apiResponseS.onPost(
      EndpointsReclutamiento.RecruitmentRequests.solicitudAlta(
        this.authS.applicationUserId,
      ),
      payload,
    );

    return result !== false;
  }

  private async updateCandidateRequest(
    requestEmployeeRegisterId: string,
    candidateEmployeeId: string,
  ): Promise<boolean> {
    const currentRequest = this.requestEmployeeRegisterData();
    if (!currentRequest) return false;

    const payload: RequestEmployeeRegisterAddOrEditDTO = {
      id: currentRequest.id,
      folio: currentRequest.folio,
      positionRequestId: currentRequest.positionRequestId,
      requestDate: currentRequest.requestDate,
      executionDate: currentRequest.executionDate,
      typeContractRegister: currentRequest.typeContractRegister,
      status: currentRequest.status,
      applicationUserId: currentRequest.applicationUserId,
      confirmationFinish: currentRequest.confirmationFinish,
      employeeId: candidateEmployeeId,
    };

    const result = await this.apiResponseS.onPut(
      `${EndpointsReclutamiento.RequestEmployeeRegister.base}/${requestEmployeeRegisterId}`,
      payload,
    );

    return result !== false;
  }

  async onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const { candidateEmployeeId, ...vacancyPayload } = this.form.getRawValue();

    try {
      const vacancyResult = await FormHelper.submitCrud({
        form: this.form,
        api: this.apiResponseS,
        endpoint: EndpointsReclutamiento.RequestPosition.base,
        id: this.id,
        submitting: this.submitting,
        closeOnSuccess: false,
        transformPayload: () => vacancyPayload,
      });

      if (vacancyResult === false) return;

      const candidateResult = await this.syncCandidateRequest();
      if (!candidateResult) return;

      this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
