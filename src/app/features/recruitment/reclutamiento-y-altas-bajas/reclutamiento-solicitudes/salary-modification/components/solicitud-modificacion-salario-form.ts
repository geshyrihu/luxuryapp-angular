import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

@Component({
  selector: "app-solicitud-modificacion-salario",
  templateUrl: "./solicitud-modificacion-salario-form.html",
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
    CustomInputTextAreaSignal,
    CustomInputAutoComplete,
    CardModule,
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
  cb_applicationRole = signal<ISelectItem[]>([]);
  cb_si_no = signal<ISelectItem[]>([]);

  form = this.formB.group({
    employeeId: ["", Validators.required],
    employeeName: ["", Validators.required],
    applicationRoleCurrentId: [null as any],
    applicationRoleCurrent: [null as string | null],
    applicationRoleNewId: [null as any],
    applicationRoleNew: [null as string | null],
    currentSalary: [0, Validators.required],
    finalSalary: [0, [Validators.required, Validators.min(1)]],
    executionDate: [null as Date | null, Validators.required],
    retroactive: [false, Validators.required],
    additionalInformation: [""],
    files: new FormControl<File[] | null>(
      null,
      FileUploadValidators.fileSize(20000),
    ),
  });

  get filesControl() {
    return this.form.controls["files"] as FormControl;
  }

  async ngOnInit(): Promise<void> {
    await this.onLoadSelectItems();
    await this.onLoadData();
  }

  async onLoadSelectItems(): Promise<void> {
    const [siNo, applicationRoles] = await Promise.all([
      firstValueFrom(this.enumSelectS.boolYesNo()),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        `application-roles-to-administrator`,
      ),
    ]);

    this.cb_si_no.set(siNo);
    this.cb_applicationRole.set(applicationRoles as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `RequestSalaryModification/GetDataForModificacionSalario/${this.workPositionId}`,
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
      applicationRoleCurrentId,
      applicationRoleCurrent: selectedApplicationRole?.label || null,
    });
  }

  onSaveApplicationRoleIDTOAccount = (item: ISelectItem) => {
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
    formData.append("currentSalary", formValue.currentSalary);
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
    formData.append("finalSalary", formValue.finalSalary);
    formData.append("workPositionId", String(this.workPositionId));
    formData.append(
      "executionDate",
      this.dateS.getDateFormat(formValue.executionDate as Date),
    );
    formData.append("retroactive", String(formValue.retroactive));
    formData.append(
      "additionalInformation",
      formValue.additionalInformation || "",
    );

    return formData;
  }
}
