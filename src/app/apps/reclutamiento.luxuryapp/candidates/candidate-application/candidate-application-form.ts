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
  FormArray,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { InputEmail } from "@ui/inputs/adaptive/input-email/input-email";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputDateTimeSignal } from "@ui/inputs/web/custom-input-date-time-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CandidateCvUpload } from "../recruitment-shared/candidate-cv-upload";
import { CandidateApplicationDetail } from "./interfaces/candidate-application";
import {
  CandidateDetail,
  CandidateWorkExperienceAddOrEdit,
  CandidateWorkExperienceItem,
} from "../candidate/interfaces/candidate.dto";
import { CandidateForm } from "../candidate/candidate-form";

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
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputTextAreaSignal,
    InputMask,
    InputEmail,
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
  candidateProcessId: string = "";
  readonly lockRequestPosition = Boolean(this.config.data?.lockRequestPosition);
  readonly allowCreateCandidate =
    this.config.data?.allowCreateCandidate !== false;
  submitting = signal(false);
  isCreatingCandidate = signal(false);
  selectedFile: File | null = null;
  currentCvUrl = signal<string>("");
  cb_candidates = signal<SelectItemDto[]>([]);
  cb_vacancies = signal<SelectItemDto[]>([]);
  cb_interviewers = signal<SelectItemDto[]>([]);
  loadingInterviewers = signal(false);
  readonly originalWorkExperienceIds = signal<string[]>([]);

  form: FormGroup = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
    candidateId: new FormControl<string | null>(null, Validators.required),
    requestPositionId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    cvFileName: new FormControl<string | null>(null),
    applicationDate: new FormControl<string | null>(null),
    recruitmentInterviewAt: new FormControl<string | null>(null),
    operationsInterviewAssignedToUserId: new FormControl<string | null>(null),
    initialComment: new FormControl<string | null>(null),
  });

  candidateForm: FormGroup = new FormGroup({
    firstName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    lastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    phoneNumber: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    age: new FormControl<number | null>(null),
    currentAddress: new FormControl<string | null>(null),
    availability: new FormControl<string | null>(null),
    salaryExpectation: new FormControl<number | null>(null),
    experienceSummary: new FormControl<string | null>(null),
    generalComments: new FormControl<string | null>(null),
  });

  candidateWorkExperiences = new FormArray<FormGroup>([]);

  private get editingId(): string {
    return this.candidateProcessId || this.id;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    this.candidateProcessId = this.config.data?.candidateProcessId ?? "";
    await this.onLoadSelectItems();
    this.form.controls["candidateId"].valueChanges.subscribe((candidateId) => {
      if (!candidateId || this.isCreatingCandidate()) return;
      void this.loadCandidateCvPreview(candidateId);
    });
    this.form.controls["requestPositionId"].valueChanges.subscribe(
      (requestPositionId) => {
        void this.onLoadInterviewersForRequestPosition(requestPositionId);
      },
    );
    this.form.controls["recruitmentInterviewAt"].valueChanges.subscribe(() => {
      this.applyInterviewerValidators();
    });
    
    this.applyDialogDefaults();

    if (!this.editingId) {
      this.form.controls["applicationDate"].setValue(this.todayDateOnly());
    }
    this.form.controls["applicationDate"].disable({ emitEvent: false });
    this.applyInterviewerValidators();
    
    // We can remove the manual check for requestPositionId here since applyDialogDefaults will trigger the subscription.
    // However, if the subscription uses async/await, it's fine.
    // Actually, if requestPositionId was set in applyDialogDefaults, it will trigger onLoadInterviewersForRequestPosition.
    // Just to be safe, I will leave the manual check but it shouldn't hurt if it runs twice (it uses signals).
    if (this.form.controls["requestPositionId"].value) {
      void this.onLoadInterviewersForRequestPosition(
        this.form.controls["requestPositionId"].value,
      );
    }
    if (this.editingId) this.onLoadData();
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
        EndpointsReclutamiento.CandidateApplications.getById(this.editingId),
      )
      .then((result) => {
        if (result) {
          this.id = result.id ?? this.id;
          this.candidateProcessId =
            result.candidateProcessId ?? this.candidateProcessId;
          this.ensureCurrentVacancyOption(result);
          this.ensureCurrentCandidateOption(result);
          this.form.patchValue({
            candidateId: result.candidateId,
            requestPositionId: result.requestPositionId,
            cvFileName: result.cvFileName,
            applicationDate: result.applicationDate,
            recruitmentInterviewAt: result.recruitmentInterviewAt ?? null,
            operationsInterviewAssignedToUserId:
              result.operationsInterviewAssignedToUserId || null,
            initialComment: null,
          });
          this.currentCvUrl.set(result.cvFileUrl ?? "");
          this.applyInterviewerValidators();
        }
      });
  }

  async onSubmit(): Promise<void> {
    if (this.isCreatingCandidate()) {
      const candidateId = await this.createCandidateInline();
      if (!candidateId) return;
      this.form.controls["candidateId"].setValue(candidateId);
      this.isCreatingCandidate.set(false);
      this.applyCandidateModeValidators();
    }

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
      const operationsInterviewAssignedToUserId =
        this.form.controls["operationsInterviewAssignedToUserId"].value?.trim();
      if (operationsInterviewAssignedToUserId) {
        formData.append(
          "OperationsInterviewAssignedToUserId",
          operationsInterviewAssignedToUserId,
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
      if (this.editingId) {
        result = await this.apiResponseS.onPut<CandidateApplicationDetail>(
          EndpointsReclutamiento.CandidateProcesses.updateMultipart(
            this.editingId,
          ),
          formData,
        );
      } else {
        result = await this.apiResponseS.onPostFile<CandidateApplicationDetail>(
          EndpointsReclutamiento.CandidateProcesses.createMultipart,
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
    this.isCreatingCandidate.set(true);
    this.applyCandidateModeValidators();
    this.selectedFile = null;
    this.currentCvUrl.set("");
    this.form.controls["cvFileName"].setValue(null);
    this.candidateForm.reset({
      firstName: "",
      lastName: "",
      phoneNumber: null,
      email: null,
      age: null,
      currentAddress: null,
      availability: null,
      salaryExpectation: null,
      experienceSummary: null,
      generalComments: null,
    });
    this.setCandidateWorkExperiences([]);
  }

  async onEditSelectedCandidate() {
    const candidateId = this.form.controls["candidateId"].value;
    if (!candidateId || this.isCreatingCandidate()) return;

    const result = await this.dialogHandlerS.openDialog<
      CandidateDetail | boolean
    >(
      CandidateForm,
      {
        id: candidateId,
        title: "Actualizar candidato",
      },
      "Actualizar candidato",
      this.dialogHandlerS.sizeLg,
    );

    if (!result || typeof result === "boolean") {
      return;
    }

    this.refreshCandidateOption(result);
    this.form.controls["candidateId"].setValue(result.id);
    this.currentCvUrl.set(result.cvFileUrl ?? "");
    this.form.controls["cvFileName"].setValue(result.cvFileName ?? null);
  }

  onCancelCreateCandidate() {
    this.isCreatingCandidate.set(false);
    this.applyCandidateModeValidators();
    this.candidateForm.reset();
    this.setCandidateWorkExperiences([]);
    this.selectedFile = null;
    void this.loadCandidateCvPreview(this.form.controls["candidateId"].value);
  }

  addCandidateWorkExperience(
    value?: Partial<CandidateWorkExperienceAddOrEdit>,
  ) {
    this.candidateWorkExperiences.push(
      new FormGroup({
        id: new FormControl<string | null>(value?.id ?? null),
        companyName: new FormControl(value?.companyName ?? "", {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(150)],
        }),
        jobPosition: new FormControl(value?.jobPosition ?? "", {
          nonNullable: true,
          validators: [Validators.required, Validators.maxLength(150)],
        }),
        startDate: new FormControl<string | null>(value?.startDate ?? null, {
          validators: [Validators.required],
        }),
        endDate: new FormControl<string | null>(value?.endDate ?? null),
        monthlyNetSalary: new FormControl<number | null>(
          value?.monthlyNetSalary ?? null,
        ),
        departureReason: new FormControl<string | null>(
          value?.departureReason ?? null,
          [Validators.maxLength(500)],
        ),
      }),
    );
  }

  removeCandidateWorkExperience(index: number) {
    this.candidateWorkExperiences.removeAt(index);
  }

  get candidateWorkExperienceControls() {
    return this.candidateWorkExperiences.controls;
  }

  isSubmitDisabled(): boolean {
    return (
      this.submitting() ||
      this.form.invalid ||
      this.isInterviewSchedulingBlocked() ||
      (this.isCreatingCandidate() &&
        (this.candidateForm.invalid || !this.selectedFile))
    );
  }

  interviewersUnavailable(): boolean {
    return (
      !!this.form.controls["requestPositionId"].value &&
      !this.loadingInterviewers() &&
      this.cb_interviewers().length === 0
    );
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

  private async onLoadInterviewersForRequestPosition(
    requestPositionId: string | null,
  ): Promise<void> {
    if (!requestPositionId) {
      this.cb_interviewers.set([]);
      this.form.controls["operationsInterviewAssignedToUserId"].setValue(null);
      this.applyInterviewerValidators();
      return;
    }

    this.loadingInterviewers.set(true);
    try {
      const interviewers = await this.apiResponseS.onGetItem<
        SelectItemDto[]
      >(
        EndpointsReclutamiento.InterviewerMatrix.eligibleInterviewersByRequestPosition(
          requestPositionId,
        ),
      );

      const options = interviewers ?? [];
      this.cb_interviewers.set(options);

      const currentValue =
        this.form.controls["operationsInterviewAssignedToUserId"].value;
      if (!options.some((item) => item.value === currentValue)) {
        this.form.controls["operationsInterviewAssignedToUserId"].setValue(null);
      }
    } finally {
      this.loadingInterviewers.set(false);
      this.applyInterviewerValidators();
    }
  }

  private applyInterviewerValidators(): void {
    const control = this.form.controls["operationsInterviewAssignedToUserId"];
    const requiresInterviewer = !!this.form.controls["recruitmentInterviewAt"].value;

    control.setValidators(requiresInterviewer ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private isInterviewSchedulingBlocked(): boolean {
    return (
      !!this.form.controls["recruitmentInterviewAt"].value &&
      (this.loadingInterviewers() ||
        this.cb_interviewers().length === 0 ||
        !this.form.controls["operationsInterviewAssignedToUserId"].value)
    );
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

  private applyCandidateModeValidators() {
    const candidateControl = this.form.controls["candidateId"];
    if (this.isCreatingCandidate()) {
      candidateControl.clearValidators();
      candidateControl.setErrors(null);
    } else {
      candidateControl.setValidators([Validators.required]);
    }
    candidateControl.updateValueAndValidity({ emitEvent: false });
  }

  private setCandidateWorkExperiences(items: CandidateWorkExperienceItem[]) {
    this.candidateWorkExperiences.clear();
    this.originalWorkExperienceIds.set(items.map((x) => x.id));

    if (items.length === 0) {
      this.addCandidateWorkExperience();
      return;
    }

    for (const item of items) {
      this.addCandidateWorkExperience({
        id: item.id,
        companyName: item.companyName,
        jobPosition: item.jobPosition,
        startDate: item.startDate,
        endDate: item.endDate ?? null,
        monthlyNetSalary: item.monthlyNetSalary ?? null,
        departureReason: item.departureReason ?? null,
      });
    }
  }

  private async createCandidateInline(): Promise<string | null> {
    if (!this.apiResponseS.validateForm(this.candidateForm)) return null;
    if (!this.selectedFile) {
      return null;
    }

    const formData = new FormData();
    formData.append(
      "FirstName",
      this.candidateForm.controls["firstName"].value?.trim() ?? "",
    );
    formData.append(
      "LastName",
      this.candidateForm.controls["lastName"].value?.trim() ?? "",
    );
    formData.append(
      "PhoneNumber",
      this.candidateForm.controls["phoneNumber"].value ?? "",
    );
    formData.append("Email", this.candidateForm.controls["email"].value ?? "");

    const age = this.candidateForm.controls["age"].value;
    if (age != null) formData.append("Age", String(age));

    formData.append(
      "CurrentAddress",
      this.candidateForm.controls["currentAddress"].value ?? "",
    );
    formData.append(
      "Availability",
      this.candidateForm.controls["availability"].value ?? "",
    );

    const salaryExpectation =
      this.candidateForm.controls["salaryExpectation"].value;
    if (salaryExpectation != null) {
      formData.append("SalaryExpectation", String(salaryExpectation));
    }

    formData.append(
      "ExperienceSummary",
      this.candidateForm.controls["experienceSummary"].value ?? "",
    );

    formData.append(
      "GeneralComments",
      this.candidateForm.controls["generalComments"].value ?? "",
    );
    formData.append("CvFile", this.selectedFile, this.selectedFile.name);

    const created = await this.apiResponseS.onPostFile<CandidateDetail>(
      EndpointsReclutamiento.Candidates.base,
      formData,
    );

    if (!created || typeof created === "boolean") return null;

    await this.syncCandidateWorkExperiences(created.id);
    this.cb_candidates.update((current) => [
      {
        value: created.id,
        label: created.fullName,
      },
      ...current.filter((item) => item.value !== created.id),
    ]);
    return created.id;
  }

  private async syncCandidateWorkExperiences(candidateId: string) {
    const validRows = this.candidateWorkExperienceControls
      .map((group) => group.getRawValue())
      .filter(
        (row) => row.companyName?.trim() && row.jobPosition?.trim() && row.startDate,
      );

    for (const row of validRows) {
      const payload = {
        candidateId,
        companyName: row.companyName?.trim() ?? "",
        jobPosition: row.jobPosition?.trim() ?? "",
        startDate: row.startDate,
        endDate: row.endDate || null,
        monthlyNetSalary: row.monthlyNetSalary ?? null,
        departureReason: row.departureReason?.trim() ?? "",
      };

      await this.apiResponseS.onPost<CandidateWorkExperienceItem>(
        EndpointsReclutamiento.CandidateWorkExperiences.base,
        payload,
      );
    }
  }

  private async loadCandidateCvPreview(candidateId: string | null) {
    if (!candidateId) {
      this.currentCvUrl.set("");
      this.form.controls["cvFileName"].setValue(null);
      return;
    }

    const candidate = await this.apiResponseS.onGetItem<CandidateDetail>(
      EndpointsReclutamiento.Candidates.getById(candidateId),
      false,
    );

    if (!candidate) return;

    this.currentCvUrl.set(candidate.cvFileUrl ?? "");
    this.form.controls["cvFileName"].setValue(candidate.cvFileName ?? null);
  }

  private refreshCandidateOption(candidate: CandidateDetail) {
    this.cb_candidates.update((current) => [
      {
        value: candidate.id,
        label: candidate.fullName,
      },
      ...current.filter((item) => item.value !== candidate.id),
    ]);
  }
}
