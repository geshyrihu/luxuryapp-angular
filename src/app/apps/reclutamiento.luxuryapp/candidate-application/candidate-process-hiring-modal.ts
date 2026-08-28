import { CurrencyPipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
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
import { LxStepper } from "@ui/adaptive/stepper/stepper";
import { StepperStepSection } from "@ui/base/stepper-step-section.directive";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { lastValueFrom } from "rxjs";
import { EndpointsAdmin } from "src/app/core/constants/endpoints/admin.endpoints";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { CandidateProcessStage } from "src/app/core/enums/candidate-process-stage";
import { SweetAlertIcon } from "src/app/core/enums/sweetalert-icon.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import Swal from "sweetalert2";
import { CandidateDetail } from "../candidate/interfaces/candidate.dto";
import { CandidateProcessHiringFormGroup } from "./interfaces/candidate-process-hiring-form.interface";
import { CandidateProcessHiringDialogData } from "./interfaces/candidate-process-hiring.dto";

interface ApprovedCandidateOption {
  candidateId: string;
  candidateName: string;
}

interface VacancyContext {
  customerName: string;
  positionName: string;
  sueldoBase: number;
}

interface CustomerAddressDto {
  street?: string;
  number?: string;
  unitNumber?: string;
  district?: string;
  postalCode?: string;
  townHall?: string;
  city?: string;
  country?: string;
}

@Component({
  selector: "app-candidate-process-hiring-modal",
  templateUrl: "./candidate-process-hiring-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    LxStepper,
    StepperStepSection,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputToggleSwitch,
    InputMask,
    WebButtonLabel,
  ],
})
export class CandidateProcessHiringModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly enumSelectS = inject(EnumSelectService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dateS = inject(DateService);

  readonly submitting = signal(false);
  readonly activeStep = signal(1);
  readonly validationErrors = signal<string[]>([]);
  readonly dialogData = this.config.data as CandidateProcessHiringDialogData;
  readonly id = this.dialogData.id;
  readonly candidateProcessId = this.dialogData.candidateProcessId;
  readonly candidateId = this.dialogData.candidateId ?? null;
  readonly requestPositionId = this.dialogData.requestPositionId ?? null;
  readonly toStage: CandidateProcessStage | undefined = this.dialogData.toStage;
  readonly contractOptions = signal<SelectItemDto[]>([]);
  readonly relationOptions = signal<SelectItemDto[]>([]);
  readonly workShiftOptions = signal<SelectItemDto[]>([]);
  readonly bankOptions = signal<SelectItemDto[]>([]);
  readonly maritalStatusOptions = signal<SelectItemDto[]>([]);
  readonly educationLevelOptions = signal<SelectItemDto[]>([]);
  readonly approvedCandidate = signal<ApprovedCandidateOption | null>(null);
  readonly vacancyContext = signal<VacancyContext | null>(null);
  readonly loadingVacancyContext = signal(false);
  readonly workShiftLocked = signal(false);
  readonly customerAddressLocked = signal(false);
  readonly hasValidTarget = computed(
    () => !!(this.candidateProcessId ?? this.id) || !!this.requestPositionId,
  );
  readonly steps = [
    { value: 1, label: "Datos personales" },
    { value: 2, label: "Direccion" },
    { value: 3, label: "Contactos" },
    { value: 4, label: "Banco y salud" },
    { value: 5, label: "Puesto y turno" },
    { value: 6, label: "Confirmacion" },
  ];
  private readonly fieldLabels: Record<string, string> = {
    executionDate: "Fecha de alta",
    firstName: "Nombre(s)",
    email: "Correo electronico",
    lastName: "Apellidos",
    birthDate: "Fecha de nacimiento",
    nss: "NSS",
    rfc: "RFC",
    rfcPostalCode: "Codigo postal del RFC",
    curp: "CURP",
    maritalStatus: "Estado civil",
    educationLevel: "Nivel de educacion",
    street: "Calle",
    neighborhood: "Colonia",
    municipality: "Municipio o alcaldia",
    postalCode: "Codigo postal",
    state: "Estado",
    phoneNumber: "Telefono celular",
    typeContractRegister: "Tipo de contrato",
    bankId: "Banco",
    accountNumber: "Cuenta bancaria",
    clabe: "CLABE",
    beneficiaryName: "Beneficiario",
    beneficiaryPhoneNumber: "Telefono del beneficiario",
    beneficiaryRelation: "Parentesco del beneficiario",
    emergencyContactName: "Contacto de emergencia",
    emergencyContactPhoneNumber: "Telefono de emergencia",
    emergencyContactRelation: "Parentesco de emergencia",
    workShift: "Turno de trabajo",
  };
  private readonly fieldSteps: Record<string, number> = {
    lastName: 1,
    firstName: 1,
    birthDate: 1,
    maritalStatus: 1,
    educationLevel: 1,
    phoneNumber: 1,
    email: 1,
    nss: 1,
    rfc: 1,
    curp: 1,
    street: 2,
    neighborhood: 2,
    municipality: 2,
    postalCode: 2,
    state: 2,
    emergencyContactName: 3,
    emergencyContactPhoneNumber: 3,
    emergencyContactRelation: 3,
    beneficiaryName: 3,
    beneficiaryPhoneNumber: 3,
    beneficiaryRelation: 3,
    bankId: 4,
    accountNumber: 4,
    clabe: 4,
    executionDate: 5,
    typeContractRegister: 5,
    workShift: 5,
  };
  readonly draftKey = computed(
    () =>
      `candidate-process-hiring-draft:${this.candidateProcessId ?? this.id}`,
  );
  readonly form = new FormGroup<CandidateProcessHiringFormGroup>({
    executionDate: new FormControl<string | null>(null, [
      Validators.required,
      (control) => this.dateOnlyValidator(control),
    ]),
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
    nss: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rfc: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rfcPostalCode: new FormControl("", { nonNullable: true }),
    curp: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    maritalStatus: new FormControl<number | null>(null, Validators.required),
    educationLevel: new FormControl<number | null>(null, Validators.required),
    hasInfonavitCredit: new FormControl(false, { nonNullable: true }),
    infonavitCreditNumber: new FormControl("", { nonNullable: true }),
    infonavitDiscountFactor: new FormControl("", { nonNullable: true }),
    street: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    neighborhood: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    municipality: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    postalCode: new FormControl("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern("^[0-9]{5}$"),
      ],
    }),
    state: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    bankId: new FormControl<string | null>(null, Validators.required),
    accountNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    clabe: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    beneficiaryName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    beneficiaryPhoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    beneficiaryRelation: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    emergencyContactName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emergencyContactPhoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emergencyContactRelation: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    hasControlledMedication: new FormControl(false, { nonNullable: true }),
    controlledMedicationDetails: new FormControl("", { nonNullable: true }),
    hasMedicationAllergies: new FormControl(false, { nonNullable: true }),
    medicationAllergiesDetails: new FormControl("", { nonNullable: true }),
    hasChronicDiseases: new FormControl(false, { nonNullable: true }),
    chronicDiseasesDetails: new FormControl("", { nonNullable: true }),
    boss: new FormControl("", { nonNullable: true }),
    customerAddress: new FormControl("", { nonNullable: true }),
    workShift: new FormControl<number | null>(null, Validators.required),
    additionalInformation: new FormControl("", { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    const [
      contracts,
      relations,
      shifts,
      banks,
      maritalStatuses,
      educationLevels,
    ] = await Promise.all([
      lastValueFrom(this.enumSelectS.typeContractRegister()),
      lastValueFrom(this.enumSelectS.relationEmployee()),
      lastValueFrom(this.enumSelectS.turnoTrabajo()),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.bank,
      ),
      lastValueFrom(this.enumSelectS.maritalStatus()),
      lastValueFrom(this.enumSelectS.educationLevel()),
    ]);

    this.contractOptions.set(contracts);
    this.relationOptions.set(relations);
    this.workShiftOptions.set(shifts);
    this.bankOptions.set(banks ?? []);
    this.maritalStatusOptions.set(maritalStatuses);
    this.educationLevelOptions.set(educationLevels);
    this.applyInitialData();
    this.restoreDraft();
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistDraft());

    if (this.candidateId) {
      await this.prefillFromCandidate(this.candidateId);
    }
    if (this.requestPositionId) {
      await this.loadVacancyContext();
    }
  }

  private async loadVacancyContext(): Promise<void> {
    if (!this.requestPositionId) return;
    this.loadingVacancyContext.set(true);
    try {
      const vacancy = await this.apiResponseS.onGetItem<{
        customerId: string;
        customerName: string;
        positionName: string;
        sueldoBase: number;
        turnoTrabajo: number;
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

      if (!this.form.controls.workShift.value) {
        this.form.controls.workShift.setValue(vacancy.turnoTrabajo);
      }
      this.workShiftLocked.set(!!this.form.controls.workShift.value);

      if (vacancy.customerId) {
        await this.loadCustomerAddress(vacancy.customerId);
      }

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

  private async loadCustomerAddress(customerId: string): Promise<void> {
    const address = await this.apiResponseS.onGetItem<CustomerAddressDto>(
      EndpointsAdmin.CustomerAddresses.getByCustomerId(customerId),
    );
    if (!address || this.form.controls.customerAddress.value) return;
    this.form.controls.customerAddress.setValue(this.buildFullAddress(address));
    this.customerAddressLocked.set(true);
  }

  private buildFullAddress(a: CustomerAddressDto): string {
    const parts: string[] = [];
    if (a.street) parts.push(a.street);
    if (a.number) parts.push(a.number);
    if (a.unitNumber) parts.push(`Int. ${a.unitNumber}`);
    if (a.district) parts.push(`Col. ${a.district}`);
    if (a.postalCode) parts.push(a.postalCode);
    if (a.townHall) parts.push(a.townHall);
    if (a.city) parts.push(a.city);
    if (a.country) parts.push(a.country);
    return parts.join(", ");
  }

  async onImportApprovedCandidate(): Promise<void> {
    const approved = this.approvedCandidate();
    if (!approved) return;

    const result = await Swal.fire({
      title: "Importar datos del candidato",
      html: `Se importarán nombre, apellido, correo, teléfono y fecha de nacimiento de
        <b>${approved.candidateName}</b>. El resto de los campos se llenan a mano.`,
      icon: SweetAlertIcon.Question,
      showCancelButton: true,
      confirmButtonText: "Sí, importar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });
    if (!result.isConfirmed) return;

    await this.prefillFromCandidate(approved.candidateId);
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

  onSubmit() {
    if (this.submitting()) return;
    if (!this.hasValidTarget()) return;
    this.validationErrors.set([]);
    if (!this.apiResponseS.validateForm(this.form)) {
      this.showValidationFeedback();
      return;
    }

    const executionDate = this.getValidDateOnly(
      this.form.controls.executionDate.value,
    );
    const birthDate = this.getValidDateOnly(this.form.controls.birthDate.value);
    if (!executionDate || !birthDate) {
      this.validationErrors.set([
        "Revisa las fechas: deben ser fechas reales en formato dia/mes/anio o anio-mes-dia.",
      ]);
      this.activeStep.set(!birthDate ? 1 : 5);
      return;
    }

    const formData = new FormData();
    formData.append("ExecutionDate", executionDate);
    formData.append("FirstName", this.form.controls.firstName.value.trim());
    formData.append("Email", this.form.controls.email.value.trim());
    formData.append("LastName", this.form.controls.lastName.value.trim());
    formData.append("BirthDate", birthDate);
    formData.append("Nss", this.form.controls.nss.value.trim());
    formData.append("Rfc", this.form.controls.rfc.value.trim());
    formData.append(
      "RfcPostalCode",
      this.form.controls.rfcPostalCode.value.trim(),
    );
    formData.append("Curp", this.form.controls.curp.value.trim());
    formData.append(
      "MaritalStatus",
      String(this.form.controls.maritalStatus.value),
    );
    formData.append(
      "EducationLevel",
      String(this.form.controls.educationLevel.value),
    );
    formData.append(
      "HasInfonavitCredit",
      String(this.form.controls.hasInfonavitCredit.value),
    );
    formData.append(
      "InfonavitCreditNumber",
      this.form.controls.infonavitCreditNumber.value.trim(),
    );
    formData.append(
      "InfonavitDiscountFactor",
      this.form.controls.infonavitDiscountFactor.value.trim(),
    );
    formData.append("Street", this.form.controls.street.value.trim());
    formData.append(
      "Neighborhood",
      this.form.controls.neighborhood.value.trim(),
    );
    formData.append(
      "Municipality",
      this.form.controls.municipality.value.trim(),
    );
    formData.append("PostalCode", this.form.controls.postalCode.value.trim());
    formData.append("State", this.form.controls.state.value.trim());
    formData.append("PhoneNumber", this.form.controls.phoneNumber.value.trim());
    formData.append(
      "TypeContractRegister",
      String(this.form.controls.typeContractRegister.value),
    );
    formData.append("BankId", this.form.controls.bankId.value ?? "");
    formData.append(
      "AccountNumber",
      this.form.controls.accountNumber.value.trim(),
    );
    formData.append("Clabe", this.form.controls.clabe.value.trim());
    formData.append(
      "BeneficiaryName",
      this.form.controls.beneficiaryName.value.trim(),
    );
    formData.append(
      "BeneficiaryPhoneNumber",
      this.form.controls.beneficiaryPhoneNumber.value.trim(),
    );
    formData.append(
      "BeneficiaryRelation",
      String(this.form.controls.beneficiaryRelation.value),
    );
    formData.append(
      "EmergencyContactName",
      this.form.controls.emergencyContactName.value.trim(),
    );
    formData.append(
      "EmergencyContactPhoneNumber",
      this.form.controls.emergencyContactPhoneNumber.value.trim(),
    );
    formData.append(
      "EmergencyContactRelation",
      String(this.form.controls.emergencyContactRelation.value),
    );
    formData.append(
      "HasControlledMedication",
      String(this.form.controls.hasControlledMedication.value),
    );
    formData.append(
      "ControlledMedicationDetails",
      this.form.controls.controlledMedicationDetails.value.trim(),
    );
    formData.append(
      "HasMedicationAllergies",
      String(this.form.controls.hasMedicationAllergies.value),
    );
    formData.append(
      "MedicationAllergiesDetails",
      this.form.controls.medicationAllergiesDetails.value.trim(),
    );
    formData.append(
      "HasChronicDiseases",
      String(this.form.controls.hasChronicDiseases.value),
    );
    formData.append(
      "ChronicDiseasesDetails",
      this.form.controls.chronicDiseasesDetails.value.trim(),
    );
    formData.append("Boss", this.form.controls.boss.value.trim());
    formData.append(
      "CustomerAddress",
      this.form.controls.customerAddress.value.trim(),
    );
    formData.append("TurnoTrabajo", String(this.form.controls.workShift.value));
    formData.append(
      "AdditionalInformation",
      this.form.controls.additionalInformation.value.trim(),
    );

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
          this.clearDraft();
          this.ref.close(true);
        } else {
          this.submitting.set(false);
        }
      })
      .catch(() => this.submitting.set(false));
  }

  clearDraft() {
    localStorage.removeItem(this.draftKey());
    this.form.reset();
    this.applyInitialData();
    if (this.requestPositionId) {
      this.workShiftLocked.set(false);
      this.customerAddressLocked.set(false);
      this.loadVacancyContext();
    }
  }

  private dateOnlyValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    return !control.value || this.getValidDateOnly(control.value)
      ? null
      : { invalidDate: true };
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

    const firstInvalidField = invalidFields[0]?.[0];
    this.activeStep.set(
      firstInvalidField ? (this.fieldSteps[firstInvalidField] ?? 1) : 1,
    );

    this.validationErrors.set(
      invalidFields
        .slice(0, 8)
        .map(
          ([field, control]) =>
            `${this.fieldLabels[field] ?? field}: ${this.getControlErrorMessage(control)}`,
        ),
    );
  }

  private getControlErrorMessage(control: AbstractControl): string {
    const errors = control.errors ?? {};
    if (errors["required"]) return "es requerido.";
    if (errors["email"]) return "ingresa un correo valido.";
    if (errors["pattern"]) return "el formato es invalido.";
    if (errors["minlength"]) return "no cumple la longitud minima.";
    if (errors["maxlength"]) return "supera la longitud maxima.";
    if (errors["invalidDate"]) return "la fecha ingresada no es valida.";
    if (errors["customError"]) return String(errors["customError"]);
    return "revisa el valor capturado.";
  }

  private applyInitialData(): void {
    this.form.patchValue({
      firstName: this.dialogData.candidateFirstName?.trim() ?? "",
      lastName: this.dialogData.candidateLastName?.trim() ?? "",
    });
  }

  private restoreDraft(): void {
    const rawDraft = localStorage.getItem(this.draftKey());
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft) as Partial<Record<string, unknown>>;
      this.form.patchValue(draft as Partial<typeof this.form.value>);
    } catch {
      localStorage.removeItem(this.draftKey());
    }
  }

  private persistDraft(): void {
    localStorage.setItem(
      this.draftKey(),
      JSON.stringify(this.form.getRawValue()),
    );
  }

  private splitLastName(lastName?: string): {
    paternalLastName: string;
    maternalLastName: string;
  } {
    const parts = (lastName ?? "")
      .split(" ")
      .map((part) => part.trim())
      .filter(Boolean);

    return {
      paternalLastName: parts[0] ?? "",
      maternalLastName: parts.slice(1).join(" "),
    };
  }

  resolveOptionLabel(
    options: SelectItemDto[],
    value: number | string | null,
  ): string {
    if (value === null) return "Pendiente";
    return options.find((item) => item.value === value)?.label ?? "Pendiente";
  }
}
