import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { DateService } from "src/app/core/services/date.service";
import { CandidateDetail } from "../candidate/interfaces/candidate.dto";
import { CandidateProcessHiringFormGroup } from "./interfaces/candidate-process-hiring-form.interface";
import {
  CandidateProcessHiringDialogData,
  CandidateProcessHiringDto,
} from "./interfaces/candidate-process-hiring.dto";

interface ApprovedCandidateOption {
  candidateId: string;
  candidateName: string;
}

interface VacancyContext {
  customerName: string;
  positionName: string;
  sueldoBase: number;
}

interface DuplicateEmployeeMatch {
  userId: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  estatus: string;
  nombreEdificio: string;
}

@Component({
  selector: "app-candidate-process-hiring-modal",
  templateUrl: "./candidate-process-hiring-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputTextSignal,
    WebButtonLabel,
  ],
})
export class CandidateProcessHiringModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateS = inject(DateService);

  readonly dialogData = this.config.data as CandidateProcessHiringDialogData;
  readonly id = this.dialogData.id;
  readonly candidateProcessId = this.dialogData.candidateProcessId;
  readonly candidateId = this.dialogData.candidateId ?? null;
  readonly requestPositionId = this.dialogData.requestPositionId ?? null;
  readonly toStage: CandidateProcessStage | undefined = this.dialogData.toStage;

  readonly submitting = signal(false);
  readonly searchingDuplicates = signal(false);
  readonly validationErrors = signal<string[]>([]);
  readonly duplicateMatches = signal<DuplicateEmployeeMatch[]>([]);
  readonly duplicateResolution = signal<string | "new" | null>(null);
  readonly lastDuplicateFingerprint = signal("");
  readonly approvedCandidate = signal<ApprovedCandidateOption | null>(null);
  readonly vacancyContext = signal<VacancyContext | null>(null);
  readonly loadingVacancyContext = signal(false);
  readonly hasValidTarget = computed(
    () => !!(this.candidateProcessId ?? this.id) || !!this.requestPositionId,
  );
  readonly saveLabel = computed(() =>
    this.duplicateMatches().length > 0 ? "Confirmar alta" : "Validar y guardar",
  );

  readonly form = new FormGroup<CandidateProcessHiringFormGroup>({
    firstName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    lastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthDate: new FormControl<string | null>(null, [
      Validators.required,
      (control) => this.birthDateValidator(control),
    ]),
    phoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    this.applyInitialData();
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.resetDuplicateResolution());

    if (this.candidateId) {
      await this.prefillFromCandidate(this.candidateId);
    }

    if (this.requestPositionId) {
      await this.loadVacancyContext();
    }
  }

  async onSubmit(): Promise<void> {
    if (this.submitting() || this.searchingDuplicates() || !this.hasValidTarget()) {
      return;
    }

    this.validationErrors.set([]);
    if (!this.apiResponseS.validateForm(this.form)) {
      this.showValidationFeedback();
      return;
    }

    const payload = this.buildPayload();
    if (!payload) return;

    const fingerprint = this.buildDuplicateFingerprint(payload);
    if (this.lastDuplicateFingerprint() !== fingerprint) {
      const matches = await this.searchDuplicates(payload, fingerprint);
      if (matches.length > 0) return;
    }

    if (this.duplicateMatches().length > 0 && !this.duplicateResolution()) {
      this.validationErrors.set([
        "Selecciona si deseas migrar/reingresar un perfil existente o crear uno nuevo.",
      ]);
      return;
    }

    const dto: CandidateProcessHiringDto = {
      ...payload,
      matchedUserId:
        this.duplicateResolution() && this.duplicateResolution() !== "new"
          ? this.duplicateResolution()
          : null,
    };

    const formData = new FormData();
    formData.append("FirstName", dto.firstName);
    formData.append("LastName", dto.lastName);
    formData.append("Email", dto.email);
    formData.append("BirthDate", dto.birthDate);
    formData.append("PhoneNumber", dto.phoneNumber);
    if (dto.matchedUserId) {
      formData.append("MatchedUserId", dto.matchedUserId);
    }

    this.submitting.set(true);
    const isDraftCompletion = this.dialogData.isDraftCompletion === true;
    const processId = this.candidateProcessId ?? this.id;
    const targetEndpoint = isDraftCompletion
      ? EndpointsReclutamiento.RequestEmployeeRegister.completeDraft(this.id!)
      : processId
        ? EndpointsReclutamiento.CandidateProcesses.processHiring(processId)
        : EndpointsReclutamiento.CandidateProcesses.directHire(
            this.requestPositionId!,
          );

    const request = isDraftCompletion
      ? this.apiResponseS.onPut<boolean>(targetEndpoint, formData)
      : this.apiResponseS.onPost<boolean>(targetEndpoint, formData);

    request
      .then((result: boolean | false) => {
        if (result) {
          this.ref.close(true);
          return;
        }

        this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false));
  }

  async onImportApprovedCandidate(): Promise<void> {
    const approved = this.approvedCandidate();
    if (!approved) return;

    await this.prefillFromCandidate(approved.candidateId);
  }

  onCancel(): void {
    this.ref.close(false);
  }

  selectMatchedUser(match: DuplicateEmployeeMatch): void {
    this.duplicateResolution.set(match.userId);
    this.validationErrors.set([]);
  }

  selectCreateNew(): void {
    this.duplicateResolution.set("new");
    this.validationErrors.set([]);
  }

  isSelectedMatch(userId: string): boolean {
    return this.duplicateResolution() === userId;
  }

  isCreateNewSelected(): boolean {
    return this.duplicateResolution() === "new";
  }

  private async searchDuplicates(
    payload: CandidateProcessHiringDto,
    fingerprint: string,
  ): Promise<DuplicateEmployeeMatch[]> {
    this.searchingDuplicates.set(true);

    try {
      const response = await this.apiResponseS.onPost<DuplicateEmployeeMatch[]>(
        EndpointsReclutamiento.RequestEmployeeRegister.searchEmployeeDuplicates,
        {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          phoneNumber: payload.phoneNumber,
        },
      );
      const matches: DuplicateEmployeeMatch[] = Array.isArray(response) ? response : [];

      this.lastDuplicateFingerprint.set(fingerprint);
      this.duplicateMatches.set(matches);
      this.duplicateResolution.set(matches.length > 0 ? null : "new");

      if (matches.length > 0) {
        this.validationErrors.set([
          "Se encontraron perfiles existentes. Elige si deseas migrar/reingresar a uno de ellos o crear uno nuevo.",
        ]);
      }

      return matches;
    } finally {
      this.searchingDuplicates.set(false);
    }
  }

  private buildPayload(): CandidateProcessHiringDto | null {
    const birthDate = this.getValidDateOnly(this.form.controls.birthDate.value);
    if (!birthDate) {
      this.validationErrors.set([
        "Revisa la fecha de nacimiento: debe ser una fecha válida.",
      ]);
      return null;
    }

    return {
      firstName: this.form.controls.firstName.value.trim(),
      lastName: this.form.controls.lastName.value.trim(),
      email: this.form.controls.email.value.trim().toLowerCase(),
      birthDate,
      phoneNumber: this.form.controls.phoneNumber.value.trim(),
    };
  }

  private buildDuplicateFingerprint(payload: CandidateProcessHiringDto): string {
    return [
      payload.firstName.trim().toLowerCase(),
      payload.lastName.trim().toLowerCase(),
      payload.email.trim().toLowerCase(),
      payload.phoneNumber.replace(/\D/g, ""),
      payload.birthDate,
    ].join("|");
  }

  private resetDuplicateResolution(): void {
    this.duplicateMatches.set([]);
    this.duplicateResolution.set(null);
    this.lastDuplicateFingerprint.set("");
    this.validationErrors.set([]);
  }

  private async loadVacancyContext(): Promise<void> {
    if (!this.requestPositionId) return;

    this.loadingVacancyContext.set(true);
    try {
      const vacancy = await this.apiResponseS.onGetItem<{
        customerName: string;
        positionName: string;
        sueldoBase: number;
        activeProcesses?: Array<{
          candidateId: string;
          candidateName: string;
          currentStage: CandidateProcessStage;
        }>;
      }>(
        EndpointsReclutamiento.CandidateProcesses.byRequestPosition(
          this.requestPositionId,
        ),
      );
      if (!vacancy) return;

      this.vacancyContext.set({
        customerName: vacancy.customerName,
        positionName: vacancy.positionName,
        sueldoBase: vacancy.sueldoBase,
      });

      if (!this.candidateId) {
        const approved = vacancy.activeProcesses?.find(
          (item) => item.currentStage === CandidateProcessStage.Seleccionado,
        );
        this.approvedCandidate.set(
          approved
            ? {
                candidateId: approved.candidateId,
                candidateName: approved.candidateName,
              }
            : null,
        );
      }
    } finally {
      this.loadingVacancyContext.set(false);
    }
  }

  private async prefillFromCandidate(candidateId: string): Promise<void> {
    const candidate = await this.apiResponseS.onGetItem<CandidateDetail>(
      EndpointsReclutamiento.Candidates.getById(candidateId),
    );
    if (!candidate) return;

    this.form.patchValue({
      firstName: candidate.firstName ?? "",
      lastName: candidate.lastName ?? "",
      email: candidate.email ?? "",
      phoneNumber: candidate.phoneNumber ?? "",
      birthDate: candidate.birthDate ?? null,
    });
  }

  private birthDateValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (!control.value) return null;

    const value = this.getValidDateOnly(control.value);
    if (!value) return { invalidDate: true };

    const birthDate = this.dateS.parseDate(value);
    const today = new Date();
    if (birthDate && birthDate > today) {
      return { customError: "La fecha de nacimiento no puede ser futura." };
    }

    return null;
  }

  private getValidDateOnly(value: unknown): string | undefined {
    const formatted = this.dateS.getDateFormat(value);
    const match = formatted?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return undefined;

    const year = Number(match[1]);
    if (year < 1900 || year > 2100) return undefined;

    return formatted;
  }

  private showValidationFeedback(): void {
    const invalidFields = Object.entries(
      this.form.controls as unknown as Record<string, AbstractControl>,
    ).filter(([, control]) => control.invalid);

    this.validationErrors.set(
      invalidFields.map(
        ([field, control]) =>
          `${this.resolveFieldLabel(field)}: ${this.getControlErrorMessage(control)}`,
      ),
    );
  }

  private resolveFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      firstName: "Nombre(s)",
      lastName: "Apellidos",
      birthDate: "Fecha de nacimiento",
      email: "Correo electrónico",
      phoneNumber: "Teléfono celular",
    };

    return labels[field] ?? field;
  }

  private getControlErrorMessage(control: AbstractControl): string {
    const errors = control.errors ?? {};
    if (errors["required"]) return "es requerido.";
    if (errors["email"]) return "ingresa un correo válido.";
    if (errors["invalidDate"]) return "la fecha ingresada no es válida.";
    if (errors["customError"]) return String(errors["customError"]);
    return "revisa el valor capturado.";
  }

  private applyInitialData(): void {
    this.form.patchValue({
      firstName: this.dialogData.candidateFirstName?.trim() ?? "",
      lastName: this.dialogData.candidateLastName?.trim() ?? "",
    });
  }
}

