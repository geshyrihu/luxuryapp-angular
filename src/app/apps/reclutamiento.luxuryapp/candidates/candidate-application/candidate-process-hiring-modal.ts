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
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LxStepper } from "@ui/adaptive/stepper/stepper";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { lastValueFrom } from "rxjs";
import { CandidateApplicationStage } from "src/app/core/enums/candidate-application-stage";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateProcessHiringDialogData } from "./interfaces/candidate-process-hiring.dto";
import { CandidateProcessHiringFormGroup } from "./interfaces/candidate-process-hiring-form.interface";

@Component({
  selector: "app-candidate-process-hiring-modal",
  standalone: true,
  templateUrl: "./candidate-process-hiring-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    LxStepper,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputToggleSwitch,
  ],
})
export class CandidateProcessHiringModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly enumSelectS = inject(EnumSelectService);
  private readonly destroyRef = inject(DestroyRef);

  readonly submitting = signal(false);
  readonly activeStep = signal(1);
  readonly dialogData = this.config.data as CandidateProcessHiringDialogData;
  readonly id = this.dialogData.id;
  readonly candidateProcessId = this.dialogData.candidateProcessId;
  readonly toStage: CandidateApplicationStage = this.dialogData.toStage;
  readonly contractOptions = signal<SelectItemDto[]>([]);
  readonly relationOptions = signal<SelectItemDto[]>([]);
  readonly workShiftOptions = signal<SelectItemDto[]>([]);
  readonly recruitmentSourceOptions = signal<SelectItemDto[]>([]);
  readonly steps = [
    { value: 1, label: "Datos personales" },
    { value: 2, label: "Direccion" },
    { value: 3, label: "Contactos" },
    { value: 4, label: "Banco y salud" },
    { value: 5, label: "Puesto y turno" },
    { value: 6, label: "Confirmacion" },
  ];
  readonly draftKey = computed(
    () => `candidate-process-hiring-draft:${this.candidateProcessId ?? this.id}`,
  );
  readonly recruitmentSourceLabel = computed(() => {
    const currentValue = this.form.controls.recruitmentSource.value;
    if (currentValue === null) return "Se heredara desde el candidato";
    return (
      this.recruitmentSourceOptions().find((item) => item.value === currentValue)
        ?.label ?? "Fuente sin etiqueta"
    );
  });

  readonly form = new FormGroup<CandidateProcessHiringFormGroup>({
    executionDate: new FormControl<string | null>(null, Validators.required),
    firstName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    paternalLastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    maternalLastName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    birthDate: new FormControl<string | null>(null, Validators.required),
    nss: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rfc: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    curp: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
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
      validators: [Validators.required],
    }),
    state: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    phoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    typeContractRegister: new FormControl<number | null>(null, Validators.required),
    bankName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
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
    beneficiaryRelation: new FormControl<number | null>(null, Validators.required),
    emergencyContactName: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emergencyContactPhoneNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    emergencyContactRelation: new FormControl<number | null>(null, Validators.required),
    hasControlledMedication: new FormControl(false, { nonNullable: true }),
    controlledMedicationDetails: new FormControl("", { nonNullable: true }),
    hasMedicationAllergies: new FormControl(false, { nonNullable: true }),
    medicationAllergiesDetails: new FormControl("", { nonNullable: true }),
    hasChronicDiseases: new FormControl(false, { nonNullable: true }),
    chronicDiseasesDetails: new FormControl("", { nonNullable: true }),
    boss: new FormControl("", { nonNullable: true }),
    customerAddress: new FormControl("", { nonNullable: true }),
    workShift: new FormControl<number | null>(null, Validators.required),
    recruitmentSource: new FormControl<number | null>(null, Validators.required),
    additionalInformation: new FormControl("", { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    const [contracts, relations, shifts, sources] = await Promise.all([
      lastValueFrom(this.enumSelectS.typeContractRegister()),
      lastValueFrom(this.enumSelectS.relationEmployee()),
      lastValueFrom(this.enumSelectS.turnoTrabajo()),
      lastValueFrom(this.enumSelectS.fuenteReclutamiento()),
    ]);

    this.contractOptions.set(contracts);
    this.relationOptions.set(relations);
    this.workShiftOptions.set(shifts);
    this.recruitmentSourceOptions.set(sources);
    this.applyInitialData();
    this.restoreDraft();
    this.form.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.persistDraft());
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    const executionDate = this.toDateOnly(this.form.controls.executionDate.value);
    const birthDate = this.toDateOnly(this.form.controls.birthDate.value);
    if (!executionDate || !birthDate) return;

    const formData = new FormData();
    formData.append("ExecutionDate", executionDate);
    formData.append("FirstName", this.form.controls.firstName.value.trim());
    formData.append(
      "PaternalLastName",
      this.form.controls.paternalLastName.value.trim(),
    );
    formData.append(
      "MaternalLastName",
      this.form.controls.maternalLastName.value.trim(),
    );
    formData.append("BirthDate", birthDate);
    formData.append("Nss", this.form.controls.nss.value.trim());
    formData.append("Rfc", this.form.controls.rfc.value.trim());
    formData.append("Curp", this.form.controls.curp.value.trim());
    formData.append("Street", this.form.controls.street.value.trim());
    formData.append("Neighborhood", this.form.controls.neighborhood.value.trim());
    formData.append("Municipality", this.form.controls.municipality.value.trim());
    formData.append("PostalCode", this.form.controls.postalCode.value.trim());
    formData.append("State", this.form.controls.state.value.trim());
    formData.append("PhoneNumber", this.form.controls.phoneNumber.value.trim());
    formData.append(
      "TypeContractRegister",
      String(this.form.controls.typeContractRegister.value),
    );
    formData.append("BankName", this.form.controls.bankName.value.trim());
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
      "RecruitmentSource",
      String(this.form.controls.recruitmentSource.value),
    );
    formData.append(
      "AdditionalInformation",
      this.form.controls.additionalInformation.value.trim(),
    );

    this.submitting.set(true);
    const targetEndpoint = this.candidateProcessId
      ? EndpointsReclutamiento.CandidateProcesses.processHiring(
          this.candidateProcessId,
        )
      : EndpointsReclutamiento.CandidateApplications.processHiring(this.id);

    this.apiResponseS
      .onPost<boolean>(targetEndpoint, formData)
      .then((result: boolean | false) => {
        if (result) {
          this.clearDraft();
          this.ref.close(true);
        }
        else this.submitting.set(false);
      });
  }

  clearDraft() {
    localStorage.removeItem(this.draftKey());
  }

  private toDateOnly(value: string | null): string | undefined {
    if (!value) return undefined;
    const d = new Date(value);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  private applyInitialData(): void {
    const lastNameParts = this.splitLastName(this.dialogData.candidateLastName);
    this.form.patchValue({
      firstName: this.dialogData.candidateFirstName?.trim() ?? "",
      paternalLastName: lastNameParts.paternalLastName,
      maternalLastName: lastNameParts.maternalLastName,
      recruitmentSource: this.dialogData.recruitmentSource ?? null,
    });
  }

  private restoreDraft(): void {
    const rawDraft = localStorage.getItem(this.draftKey());
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft) as Partial<
        Record<string, unknown>
      >;
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

  resolveOptionLabel(options: SelectItemDto[], value: number | null): string {
    if (value === null) return "Pendiente";
    return options.find((item) => item.value === value)?.label ?? "Pendiente";
  }
}
