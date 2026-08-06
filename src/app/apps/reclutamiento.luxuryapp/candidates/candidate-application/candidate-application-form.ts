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
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CandidateCvUpload } from "../recruitment-shared/candidate-cv-upload";
import { lastValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import {
  CandidateApplicationDetail,
} from "./interfaces/candidate-application";

@Component({
  selector: "app-candidate-application-form",
  standalone: true,
  templateUrl: "./candidate-application-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CandidateCvUpload,
    WebButtonLabelSave,
  ],
})
export class CandidateApplicationForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);
  selectedFile: File | null = null;
  currentCvUrl = signal<string>("");
  cb_candidates = signal<SelectItemDto[]>([]);
  cb_vacancies = signal<SelectItemDto[]>([]);

  form: FormGroup = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    candidateId: new FormControl<string | null>(null, Validators.required),
    requestPositionId: new FormControl<string | null>(null, Validators.required),
    cvFileName: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    applicationDate: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;
    await this.onLoadSelectItems();
    if (this.config.data.candidateId) {
      this.form.controls["candidateId"].setValue(this.config.data.candidateId);
    }
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
      formData.append(
        "CandidateId",
        this.form.controls["candidateId"].value,
      );
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

  private ensureCurrentVacancyOption(result: CandidateApplicationDetail) {
    const currentOptions = this.cb_vacancies();
    const exists = currentOptions.some(
      (item) => item.value === result.requestPositionId,
    );

    if (exists) return;

    const label = [result.vacancyFolio, result.positionName, result.customerName]
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

  private toDateOnly(value: string | null): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
}
