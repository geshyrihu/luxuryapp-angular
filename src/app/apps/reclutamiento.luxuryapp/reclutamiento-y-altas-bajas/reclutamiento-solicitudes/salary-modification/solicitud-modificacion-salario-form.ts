import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { Endpoints } from "src/app/core/constants/endpoints";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-solicitud-modificacion-salario",
  templateUrl: "./solicitud-modificacion-salario-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    CustomInputTextAreaSignal,
    InputAutocomplete,
    ],
})
export class SolicitudModificacionSalarioForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  private ref = inject(DynamicDialogRef);
  private authS = inject(AuthService);
  private enumSelectS = inject(EnumSelectService);
  workPositionId: any = this.config.data.workPositionId;
  submitting = signal(false);
  maxSizeExceeded = signal(false);

  // Signals para ComboBoxes
  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_si_no = signal<SelectItemDto[]>([]);
  cb_vacantes = signal<SelectItemDto[]>([]);

  form = this.formB.group({
    employeeId: ["", Validators.required],
    employeeName: ["", Validators.required],
    workPositionId: [null as any],
    applicationRoleCurrentId: [null as any],
    applicationRoleCurrent: [null as string | null],
    applicationRoleNewId: [null as any],
    applicationRoleNew: [null as string | null],
    currentSalary: [0],
    finalSalary: [null as number | null],
    executionDate: [null as Date | null, Validators.required],
    retroactive: [false, Validators.required],
    additionalInformation: [""],
    isCoveringVacancy: [false],
    vacancyId: [null as string | null],
    files: new FormControl<File[] | null>(
      null,
      FileUploadValidators.fileSize(20000),
    ),
  });

  get filesControl() {
    return this.form.controls["files"] as FormControl;
  }

  async ngOnInit(): Promise<void> {
    const data = await this.onLoadData();
    const customerId = data?.customerId || this.customerIdS.customerId();
    await this.onLoadSelectItems(customerId);

    // Auto-completar el puesto nuevo basado en la vacante seleccionada
    this.form.controls["vacancyId"].valueChanges.subscribe((vacancyId) => {
      if (vacancyId) {
        const selected = this.cb_vacantes().find((v) => v.value === vacancyId);
        if (selected) {
          const lastIndex = selected.label.lastIndexOf("-");
          if (lastIndex !== -1) {
            const roleName = selected.label.substring(lastIndex + 1).trim();
            const role = this.cb_applicationRole().find(
              (r) => r.label.trim().toLowerCase() === roleName.toLowerCase(),
            );
            if (role) {
              this.form.patchValue({
                applicationRoleNewId: role.value,
                applicationRoleNew: role.label,
              });
            }
          }
        }
      }
    });
  }

  async onLoadSelectItems(customerId: string): Promise<void> {
    const [siNo, applicationRoles, vacantes] = await Promise.all([
      firstValueFrom(this.enumSelectS.boolYesNo()),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        `application-roles-to-administrator`,
      ),
      this.apiResponseS.onGetList<SelectItemDto[]>(
        `requestemployeeregister/vacantes/${customerId}`,
      ),
    ]);

    this.cb_si_no.set(siNo);
    this.cb_applicationRole.set(applicationRoles as SelectItemDto[]);
    this.cb_vacantes.set(vacantes || []);
  }

  async onLoadData(): Promise<any> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.RequestSalaryModification.getDataForModificacionSalario(this.workPositionId),
    );

    // Extraer applicationRoleCurrentId
    let applicationRoleCurrentId = null;
    if (
      result.applicationRoleCurrentId !== null &&
      result.applicationRoleCurrentId !== undefined
    ) {
      applicationRoleCurrentId =
        typeof result.applicationRoleCurrentId === "object" &&
        result.applicationRoleCurrentId !== null
          ? (result.applicationRoleCurrentId as any).value
          : result.applicationRoleCurrentId;
    }

    // Buscar el ApplicationRole completo
    const selectedApplicationRole = applicationRoleCurrentId
      ? this.cb_applicationRole().find(
          (item) => item.value === applicationRoleCurrentId,
        )
      : null;

    this.form.patchValue({
      ...result,
      currentSalary: result.sueldoActual,
      applicationRoleCurrentId,
      applicationRoleCurrent:
        result.applicationRoleCurrent || selectedApplicationRole?.label || null,
    });

    return result;
  }

  onSaveApplicationRoleIDTOAccount = (item: SelectItemDto) => {
    this.form.patchValue({
      applicationRoleNewId: item?.value,
      applicationRoleNew: item?.label,
    });
  };

  onFileChange() {
    this.maxSizeExceeded.set(false);
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    let sizeFile = 0;

    const files = this.filesControl.value;
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        sizeFile += files[i].size;
      }
    }

    if (sizeFile > maxFileSize) {
      this.maxSizeExceeded.set(true);
    }
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;

    if (this.maxSizeExceeded()) {
      return;
    }

    const model = this.createFormData(this.form.getRawValue());

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        `SolicitudesReclutamiento/solicitudmodificacionsalario/${this.customerIdS.customerId()}/${this.authS.infoUserAuth.applicationUserId}`,
        model,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  private createFormData(formValue: any): FormData {
    const formData = new FormData();

    // Agregar archivos
    const files = formValue.files;
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        formData.append("soport", files[i]);
      }
    }

    // Agregar campos del formulario
    formData.append("employeeId", formValue.employeeId);
    formData.append(
      "sueldoActual",
      formValue.currentSalary ? String(formValue.currentSalary) : "0",
    );
    formData.append(
      "currentSalary",
      formValue.currentSalary ? String(formValue.currentSalary) : "0",
    );
    formData.append(
      "applicationRoleCurrent",
      formValue.applicationRoleCurrent || "",
    );
    formData.append(
      "applicationRoleCurrentId",
      formValue.applicationRoleCurrentId || "",
    );
    formData.append(
      "applicationRoleNewId",
      formValue.applicationRoleNewId || "",
    );
    formData.append("applicationRoleNew", formValue.applicationRoleNew || "");
    formData.append("employeeName", formValue.employeeName);
    formData.append(
      "finalSalary",
      formValue.finalSalary !== null && formValue.finalSalary !== undefined
        ? String(formValue.finalSalary)
        : "0",
    );
    formData.append(
      "workPositionId",
      formValue.workPositionId || String(this.workPositionId),
    );
    formData.append(
      "executionDate",
      this.dateS.getDateFormat(formValue.executionDate as Date),
    );
    formData.append("retroactive", String(formValue.retroactive));
    formData.append(
      "additionalInformation",
      formValue.additionalInformation || "",
    );
    if (formValue.vacancyId) {
      formData.append("vacancyId", formValue.vacancyId);
    }

    return formData;
  }
}
