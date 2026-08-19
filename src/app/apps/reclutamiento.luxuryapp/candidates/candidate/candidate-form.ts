import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { firstValueFrom } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, switchMap } from "rxjs/operators";
import {
  FormArray,
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { InputEmail } from "@ui/inputs/adaptive/input-email/input-email";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CandidateStatus } from "src/app/core/enums/candidate-status";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateCvUpload } from "../recruitment-shared/candidate-cv-upload";
import {
  CandidateDetail,
  CandidatePhoneLookup,
  CandidateWorkExperienceAddOrEdit,
  CandidateWorkExperienceItem,
} from "./interfaces/candidate.dto";
import { CandidateFormGroup } from "./interfaces/candidate-form.interface";

function minimumAdultAgeValidator(control: AbstractControl) {
  const rawValue = control.value;
  if (!rawValue) return null;

  const birthDate = new Date(`${rawValue}T00:00:00`);
  if (Number.isNaN(birthDate.getTime())) return { invalidDate: true };

  const today = new Date();
  const adultThreshold = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate(),
  );

  return birthDate <= adultThreshold ? null : { minimumAdultAge: true };
}

@Component({
  selector: "app-candidate-form",
  templateUrl: "./candidate-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputTextAreaSignal,
    InputMask,
    InputEmail,
    CandidateCvUpload,
    WebButtonLabel,
    WebButtonLabelSave,
  ],
})
export class CandidateForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  enumSelectS = inject(EnumSelectService);
  dialogHandlerS = inject(DialogHandlerService);
  private destroyRef = inject(DestroyRef);

  id: string = "";
  submitting = signal(false);
  currentCvUrl = signal("");
  recruitmentSourceOptions = signal<SelectItemDto[]>([]);
  selectedFile: File | null = null;
  readonly originalWorkExperienceIds = signal<string[]>([]);

  /** Candidato existente encontrado al capturar un telefono ya registrado (busqueda silenciosa). */
  duplicateCandidate = signal<CandidatePhoneLookup | null>(null);
  readonly CandidateStatus = CandidateStatus;

  form: FormGroup<CandidateFormGroup> = new FormGroup({
    id: new FormControl({ value: "", disabled: true }),
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
    birthDate: new FormControl<string | null>(null, {
      validators: [Validators.required, minimumAdultAgeValidator],
    }),
    recruitmentSource: new FormControl<number | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    currentAddress: new FormControl<string | null>(null),
    availability: new FormControl<string | null>(null),
    salaryExpectation: new FormControl<number | null>(null),
    experienceSummary: new FormControl<string | null>(null),
    generalComments: new FormControl<string | null>(null),
  });

  workExperiences = new FormArray<FormGroup>([]);

  async ngOnInit(): Promise<void> {
    this.id = this.config.data?.id ?? "";
    await this.loadSelectItems();
    if (this.id) this.onLoadData();
    else this.addWorkExperience();

    this.form.controls.phoneNumber.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        filter((value): value is string => !!value && value.replace(/\D/g, "").length >= 10),
        switchMap((phone) =>
          this.apiResponseS.onGetItem<CandidatePhoneLookup | null>(
            EndpointsReclutamiento.Candidates.searchByPhone(phone),
            false,
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((found) => {
        this.duplicateCandidate.set(found && found.id !== this.id ? found : null);
      });
  }

  private async loadSelectItems(): Promise<void> {
    this.recruitmentSourceOptions.set(
      await firstValueFrom(this.enumSelectS.fuenteReclutamiento()),
    );
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<CandidateDetail>(
        EndpointsReclutamiento.Candidates.getById(this.id),
      )
      .then((result) => {
        if (!result) return;

        this.form.patchValue({
          ...result,
          recruitmentSource: result.recruitmentSource ?? null,
        });
        this.currentCvUrl.set(result.cvFileUrl ?? "");
        this.setWorkExperiences(result.workExperiences ?? []);
      });
  }

  dismissDuplicateCandidate() {
    this.duplicateCandidate.set(null);
  }

  /** Carga al candidato ya registrado dentro de este mismo formulario para revisar/actualizar sus datos. */
  onLoadDuplicateCandidate() {
    const found = this.duplicateCandidate();
    if (!found) return;

    this.id = found.id;
    this.duplicateCandidate.set(null);
    this.onLoadData();
  }

  async onUnarchiveDuplicateCandidate() {
    const found = this.duplicateCandidate();
    if (!found) return;

    const result = await this.apiResponseS.onPatch<boolean>(
      EndpointsReclutamiento.Candidates.unarchive(found.id),
      {},
    );
    if (result) {
      this.duplicateCandidate.set({ ...found, status: CandidateStatus.Active });
    }
  }

  /** Cierra este formulario y abre el de asignacion a entrevista con el candidato preseleccionado. */
  async onAssignDuplicateCandidateToInterview() {
    const found = this.duplicateCandidate();
    if (!found) return;

    const { CandidateApplicationForm } = await import(
      "../candidate-application/candidate-application-form"
    );

    this.ref.close();
    await this.dialogHandlerS.openDialog(
      CandidateApplicationForm,
      { candidateId: found.id },
      "Asignar candidato a entrevista",
      this.dialogHandlerS.sizeLg,
    );
  }

  async onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    const formData = new FormData();
    formData.append("FirstName", this.form.controls.firstName.value.trim());
    formData.append("LastName", this.form.controls.lastName.value.trim());
    formData.append("PhoneNumber", this.form.controls.phoneNumber.value ?? "");
    formData.append("Email", this.form.controls.email.value ?? "");
    formData.append("BirthDate", this.form.controls.birthDate.value ?? "");
    formData.append(
      "RecruitmentSource",
      String(this.form.controls.recruitmentSource.value),
    );

    formData.append(
      "CurrentAddress",
      this.form.controls.currentAddress.value ?? "",
    );
    formData.append(
      "Availability",
      this.form.controls.availability.value ?? "",
    );

    const salaryExpectation = this.form.controls.salaryExpectation.value;
    if (salaryExpectation != null) {
      formData.append("SalaryExpectation", String(salaryExpectation));
    }

    formData.append(
      "ExperienceSummary",
      this.form.controls.experienceSummary.value ?? "",
    );

    formData.append(
      "GeneralComments",
      this.form.controls.generalComments.value ?? "",
    );

    if (this.selectedFile) {
      formData.append("CvFile", this.selectedFile, this.selectedFile.name);
    }

    this.submitting.set(true);

    const result = this.id
      ? await this.apiResponseS.onPut<CandidateDetail>(
          EndpointsReclutamiento.Candidates.update(this.id),
          formData,
        )
      : await this.apiResponseS.onPostFile<CandidateDetail>(
          EndpointsReclutamiento.Candidates.base,
          formData,
        );

    if (result && typeof result !== "boolean" && result.id) {
      await this.syncWorkExperiences(result.id);
      this.ref.close(result);
    }

    this.submitting.set(false);
  }

  onCvSelected(_fileName: string | null) {}

  onCvFile(file: File | null) {
    this.selectedFile = file;
  }

  addWorkExperience(value?: Partial<CandidateWorkExperienceAddOrEdit>) {
    this.workExperiences.push(
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

  removeWorkExperience(index: number) {
    this.workExperiences.removeAt(index);
  }

  get workExperienceControls() {
    return this.workExperiences.controls;
  }

  private setWorkExperiences(items: CandidateWorkExperienceItem[]) {
    this.workExperiences.clear();
    this.originalWorkExperienceIds.set(items.map((x) => x.id));

    if (items.length === 0) {
      this.addWorkExperience();
      return;
    }

    for (const item of items) {
      this.addWorkExperience({
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

  private async syncWorkExperiences(candidateId: string) {
    const validRows = this.workExperienceControls
      .map((group) => group.getRawValue())
      .filter((row) => row.companyName?.trim() && row.jobPosition?.trim() && row.startDate);

    const keptIds = new Set<string>();

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

      if (row.id) {
        keptIds.add(row.id);
        await this.apiResponseS.onPut(
          EndpointsReclutamiento.CandidateWorkExperiences.update(row.id),
          payload,
        );
      } else {
        const created =
          await this.apiResponseS.onPost<CandidateWorkExperienceItem>(
            EndpointsReclutamiento.CandidateWorkExperiences.base,
            payload,
          );
        if (created && typeof created !== "boolean" && created.id) {
          keptIds.add(created.id);
        }
      }
    }

    const idsToDelete = this.originalWorkExperienceIds().filter(
      (id) => !keptIds.has(id),
    );

    for (const id of idsToDelete) {
      await this.apiResponseS.onDelete(
        EndpointsReclutamiento.CandidateWorkExperiences.delete(id),
      );
    }
  }
}
