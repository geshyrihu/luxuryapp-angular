import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputDateTimeSignal } from "@ui/inputs/web/custom-input-date-time-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateForm } from "../candidate/candidate-form";
import { CandidateCvUpload } from "../recruitment-shared/candidate-cv-upload";
import { CandidateApplicationDetail } from "./interfaces/candidate-application";

@Component({
  selector: "app-candidate-application-form",
  standalone: true,
  templateUrl: "./candidate-application-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputDateTimeSignal,
    CustomInputTextAreaSignal,
    CandidateCvUpload,
    WebButtonLabelSave,
    WebButtonLabel,
  ],
})
export class CandidateApplicationForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  dialogHandlerS = inject(DialogHandlerService);

  id: string = "";
  readonly lockRequestPosition = Boolean(this.config.data?.lockRequestPosition);
  readonly allowCreateCandidate =
    this.config.data?.allowCreateCandidate !== false;
  submitting = signal(false);
  selectedFile: File | null = null;
  currentCvUrl = signal<string>("");
  cb_candidates = signal<SelectItemDto[]>([]);
  cb_vacancies = signal<SelectItemDto[]>([]);

  form: FormGroup = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    candidateId: new FormControl<string | null>(null, Validators.required),
    requestPositionId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    cvFileName: new FormControl<string | null>(null, Validators.required),
    applicationDate: new FormControl<string | null>(null),
    recruitmentInterviewAt: new FormControl<string | null>(null),
    initialComment: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    await this.onLoadSelectItems();
    this.applyDialogDefaults();
    if (!this.id) {
      this.form.controls["applicationDate"].setValue(this.todayDateOnly());
    }
    this.form.controls["applicationDate"].disable({ emitEvent: false });
    if (this.id) this.onLoadData();
  }

  async onLoadSelectItems(): Promise<void> {
    const candidates = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.candidates,
    );
    if (candidates) {
      this.cb_candidates.set(candidates);
    }

    const vacancies = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.requestPositionsPending,
    );
    if (vacancies) {
      this.cb_vacancies.set(vacancies);
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CandidateApplicationDetail>(
        EndpointsReclutamiento.CandidateApplications.getById(this.id),
      )
      .then((result) => {
        if (result) {
          this.ensureCurrentVacancyOption(result);
          this.ensureCurrentCandidateOption(result);
          this.form.patchValue({
            candidateId: result.candidateId,
            requestPositionId: result.requestPositionId,
            cvFileName: result.cvFileName,
            applicationDate: result.applicationDate,
            recruitmentInterviewAt: result.recruitmentInterviewAt ?? null,
            initialComment: null,
          });
          this.currentCvUrl.set(result.cvFileUrl ?? "");
        }
      });
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    try {
      const formData = new FormData();
      formData.append("CandidateId", this.form.controls["candidateId"].value);
      formData.append(
        "RequestPositionId",
        this.form.controls["requestPositionId"].value,
      );
      const applicationDate = this.toDateOnly(
        this.form.controls["applicationDate"].value,
      );
      if (applicationDate) {
        formData.append("ApplicationDate", applicationDate);
      }
      const recruitmentInterviewAt =
        this.form.controls["recruitmentInterviewAt"].value;
      if (recruitmentInterviewAt) {
        formData.append(
          "RecruitmentInterviewAt",
          new Date(recruitmentInterviewAt).toISOString(),
        );
      }
      const initialComment = this.form.controls["initialComment"].value?.trim();
      if (initialComment) {
        formData.append("InitialComment", initialComment);
      }
      if (this.selectedFile) {
        formData.append("CvFile", this.selectedFile, this.selectedFile.name);
      }

      let result: CandidateApplicationDetail | boolean = false;
      if (this.id) {
        result = await this.apiResponseS.onPut<CandidateApplicationDetail>(
          `${EndpointsReclutamiento.CandidateApplications.base}/${this.id}`,
          formData,
        );
      } else {
        result = await this.apiResponseS.onPostFile<CandidateApplicationDetail>(
          EndpointsReclutamiento.CandidateApplications.base,
          formData,
        );
      }

      if (result) {
        this.ref.close(true);
      }
    } catch {
      // Error ya notificado por ApiResponseService
    } finally {
      this.submitting.set(false);
    }
  }

  onCvSelected(fileName: string | null) {
    this.form.controls["cvFileName"].setValue(fileName);
    this.form.controls["cvFileName"].updateValueAndValidity();
  }

  onCvFile(file: File | null) {
    this.selectedFile = file;
  }

  async onCreateCandidate() {
    const result = await this.dialogHandlerS.openDialog<any>(
      CandidateForm,
      { id: "", title: "Nuevo Candidato", allowContinueToInterview: false },
      "Nuevo Candidato",
      this.dialogHandlerS.sizeLg,
    );

    if (!result?.id) return;

    await this.onLoadSelectItems();
    this.cb_candidates.update((current) => {
      const exists = current.some((item) => item.value === result.id);
      if (exists) return current;
      return [
        {
          value: result.id,
          label:
            result.fullName ??
            `${result.firstName ?? ""} ${result.lastName ?? ""}`.trim(),
        },
        ...current,
      ];
    });
    this.form.controls["candidateId"].setValue(result.id);
  }

  private applyDialogDefaults() {
    if (this.config.data?.candidateId) {
      this.form.controls["candidateId"].setValue(this.config.data.candidateId);
    }

    const requestPositionId = this.config.data?.requestPositionId as
      string | undefined;
    if (!requestPositionId) return;

    this.ensureDialogVacancyOption(
      requestPositionId,
      this.config.data?.requestPositionLabel as string | undefined,
    );
    this.form.controls["requestPositionId"].setValue(requestPositionId);

    if (this.lockRequestPosition) {
      this.form.controls["requestPositionId"].disable({ emitEvent: false });
    }
  }

  private ensureCurrentVacancyOption(result: CandidateApplicationDetail) {
    const currentOptions = this.cb_vacancies();
    const exists = currentOptions.some(
      (item) => item.value === result.requestPositionId,
    );

    if (exists) return;

    const label = [
      result.vacancyFolio,
      result.positionName,
      result.customerName,
    ]
      .filter(Boolean)
      .join(" - ");

    this.cb_vacancies.set([
      {
        value: result.requestPositionId,
        label,
      },
      ...currentOptions,
    ]);
  }

  private ensureCurrentCandidateOption(result: CandidateApplicationDetail) {
    const currentOptions = this.cb_candidates();
    const exists = currentOptions.some(
      (item) => item.value === result.candidateId,
    );

    if (exists) return;

    this.cb_candidates.set([
      {
        value: result.candidateId,
        label: result.candidateName,
      },
      ...currentOptions,
    ]);
  }

  private ensureDialogVacancyOption(
    requestPositionId: string,
    requestPositionLabel?: string,
  ) {
    const currentOptions = this.cb_vacancies();
    const exists = currentOptions.some(
      (item) => item.value === requestPositionId,
    );

    if (exists || !requestPositionLabel) return;

    this.cb_vacancies.set([
      {
        value: requestPositionId,
        label: requestPositionLabel,
      },
      ...currentOptions,
    ]);
  }

  private toDateOnly(value: string | null): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private todayDateOnly(): string {
    return this.toDateOnly(new Date().toISOString()) ?? "";
  }
}
