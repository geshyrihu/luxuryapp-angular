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
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Router } from "@angular/router";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateApplicationForm } from "src/app/apps/reclutamiento.luxuryapp/candidates/candidate-application/candidate-application-form";

interface RequestPositionDetailDTO {
  id?: string;
  folio: number;
  status?: number | null;
  requestDate?: string | null;
  selectionDate?: string | null;
  entryDate?: string | null;
  observations?: string;
  workPositionId?: string;
}

interface RequestEmployeeRegisterListItem {
  folioVacante: string;
  nameEmployee?: string | null;
}

interface VacancyCandidateProcessListItem {
  id: string;
  candidateProcessId?: string | null;
  candidateName: string;
  requestPositionId: string;
}

interface VacancyCandidateProcessDetail {
  requestPositionId: string;
  activeProcesses: VacancyCandidateProcessListItem[];
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
  private dialogHandlerS = inject(DialogHandlerService);
  private router = inject(Router);
  submitting = signal(false);

  cb_status = signal<SelectItemDto[]>([]);
  id: string = "";
  currentCandidateName = signal<string>("");
  currentApplicationId = signal<string>("");

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    folio: ["", Validators.required],
    status: [null as number | null, Validators.required],
    requestDate: [null as string | null, Validators.required],
    selectionDate: [null as string | null],
    entryDate: [null as string | null],
    observations: [""],
    workPositionId: [this.config.data.workPositionId],
  });

  async ngOnInit() {
    this.id = this.config.data?.id ?? "";
    await this.loadSelectItems();

    if (this.id) {
      this.form.controls.id.setValue(this.id);
      await this.onLoadData();
    }
  }

  private async loadSelectItems(): Promise<void> {
    this.cb_status.set(await firstValueFrom(this.enumSelectS.status()));
  }

  async onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestPosition.getById(this.id);
    const result = await this.apiResponseS.onGetItem<RequestPositionDetailDTO>(
      urlApi,
    );
    if (!result) return;

    this.form.patchValue({
      ...result,
      folio: String(result.folio),
    });
    await this.loadExistingCandidate(result.folio, result.id ?? this.id);
  }

  private async loadExistingCandidate(
    folio: number,
    requestPositionId?: string,
  ): Promise<void> {
    if (requestPositionId) {
      const vacancyDetail =
        await this.apiResponseS.onGetItem<VacancyCandidateProcessDetail>(
          `${EndpointsReclutamiento.CandidateProcesses.base}/request-position/${requestPositionId}`,
          false,
        );

      const currentProcess = vacancyDetail?.activeProcesses?.[0];
      if (currentProcess) {
        this.currentApplicationId.set(
          currentProcess.candidateProcessId ?? currentProcess.id,
        );
        this.currentCandidateName.set(currentProcess.candidateName ?? "");
        return;
      }
    }

    const requests =
      await this.apiResponseS.onGetList<RequestEmployeeRegisterListItem[]>(
        EndpointsReclutamiento.RequestEmployeeRegister.list,
      );
    if (!requests) return;

    const vacancyFolio = this.formatVacancyFolio(folio);
    const currentRequest = requests.find(
      (item) => item?.folioVacante === vacancyFolio,
    );

    this.currentApplicationId.set("");
    this.currentCandidateName.set(currentRequest?.nameEmployee ?? "");
  }

  private formatVacancyFolio(folio: number): string {
    return `VAC${folio.toString().padStart(5, "0")}`;
  }

  goToCandidates() {
    this.ref.close();
    this.router.navigate(["/recruitment/candidates/candidates"]);
  }

  async manageCandidateApplication() {
    if (!this.id) return;

    const folio = this.form.controls.folio.getRawValue();
    const requestPositionLabel = folio ? this.formatVacancyFolio(Number(folio)) : "";
    const applicationId = this.currentApplicationId();

    const result = await this.dialogHandlerS.openDialog(
      CandidateApplicationForm,
      {
        id: applicationId,
        requestPositionId: this.id,
        requestPositionLabel,
        lockRequestPosition: true,
        allowCreateCandidate: true,
      },
      applicationId
        ? "Editar candidato y entrevista"
        : "Agregar candidato y entrevista",
      this.dialogHandlerS.sizeLg,
    );

    if (!result) return;

    await this.loadExistingCandidate(Number(folio), this.id);
  }

  async onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    try {
      const vacancyResult = await FormHelper.submitCrud({
        form: this.form,
        api: this.apiResponseS,
        endpoint: EndpointsReclutamiento.RequestPosition.base,
        id: this.id,
        submitting: this.submitting,
        closeOnSuccess: false,
        transformPayload: () => this.form.getRawValue(),
      });

      if (vacancyResult === false) return;

      this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }
}
