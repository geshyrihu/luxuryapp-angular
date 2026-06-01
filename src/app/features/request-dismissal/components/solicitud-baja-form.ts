import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
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
  selector: "app-solicitud-baja",
  templateUrl: "./solicitud-baja-form.html",
  imports: [
    ReactiveFormsModule,
    FileUploadModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CustomButton,
  ],
})
export class SolicitudBajaForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formBuilder = inject(FormBuilder);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private dateS = inject(DateService);
  data: any;
  id: string = "";
  submitting = signal(false);

  employeeId: any = this.config.data.employeeId;

  cb_type_departure = signal<ISelectItem[]>([]);
  cb_si_no = signal<ISelectItem[]>([]);
  tipobaja = signal<number>(1);
  mensajeRenuncia =
    "Adjunta la renuncia firmada por el empleado, si no regreso a firmar se considera abandono de trabajo";

  form = this.formBuilder.nonNullable.group({
    id: [this.config.data.employeeId],
    applicationRoleId: ["", [Validators.required]],
    employeeId: ["", [Validators.required]],
    applicationRole: ["", [Validators.required]],
    applicationRoleKey: [""],
    executionDate: [null as Date | null, [Validators.required]],
    typeOfDeparture: [null as number | null, [Validators.required]],
    employee: ["", [Validators.required]],
    lastdayofwork: [null as Date | null, [Validators.required]],
    phoneEmployee: ["", [Validators.required]],
    reasonForLeaving: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(250),
      ],
    ],
    discountDescriptions: this.formBuilder.array([]),
    lawyerAssistance: [false],
    employeeInformed: [false],
    applicationUserRequestId: [this.authS.applicationUserId],
    files: [null as File[] | null, FileUploadValidators.fileSize(20000)],
  });

  get discountDescriptions() {
    return this.form.controls.discountDescriptions as FormArray;
  }

  get filesControl() {
    return this.form.controls["files"] as FormControl;
  }

  private destroyRef = inject(DestroyRef);

  async ngOnInit() {
    this.cb_si_no.set(await firstValueFrom(this.enumSelectS.boolYesNo()));
    this.cb_type_departure.set(
      await firstValueFrom(this.enumSelectS.tipoBaja()),
    );
    this.onLoadData();
    // Suscribirse a cambios en el control 'typeOfDeparture'
    this.form.controls["typeOfDeparture"].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((newValue) => {
        this.handleValueChange(newValue);
      });
  }

  onLoadData() {
    const urlApi = `RequestDismissal/GetRequestDismissal/${this.employeeId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (result) {
        this.form.patchValue({
          ...result,
          applicationRole:
            result.profession || result.applicationRoleName || "",
          applicationRoleKey: result.professionKey || "",
        });
      }
    });
  }

  handleValueChange(newValue: any) {
    if (newValue == 0) {
      // Hacer el campo de archivos obligatorio
      this.filesControl.setValidators([
        Validators.required,
        FileUploadValidators.fileSize(20000),
      ]);
    } else {
      // Eliminar la validación requerida importando validador si fuese necesario
      this.filesControl.setValidators(FileUploadValidators.fileSize(20000));
    }

    this.tipobaja.set(newValue);
    // Actualizar la validez del control y su estado
    this.filesControl.updateValueAndValidity();
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;
    if (this.filesControl.invalid) return;

    var model = this.createFormData(this.form.getRawValue());

    this.submitting.set(true);

    this.apiResponseS
      .onPost(
        `SolicitudesReclutamiento/SolicitudBaja/${this.customerIdS.customerId()}/${this.employeeId}/${this.authS.infoUserAuth.applicationUserId}`,
        model,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }

  createFormData(formValue: any) {
    const formData = new FormData();

    if (formValue.files != null) {
      for (var i = 0; i < formValue.files.length; i++) {
        formData.append("supportFiles", formValue.files[i]);
      }
    }
    formData.append("applicationRole", formValue.applicationRole);
    formData.append("applicationRoleId", formValue.applicationRoleId);
    formData.append("applicationRoleKey", formValue.applicationRoleKey || "");
    formData.append("employee", formValue.employee);
    formData.append("employeeId", formValue.employeeId);
    formData.append("phoneEmployee", formValue.phoneEmployee);
    formData.append("reasonForLeaving", formValue.reasonForLeaving);
    formData.append("lawyerAssistance", formValue.lawyerAssistance.toString());
    formData.append("employeeInformed", formValue.employeeInformed.toString());
    formData.append(
      "typeOfDeparture",
      formValue.typeOfDeparture?.toString() || "",
    );
    if (formValue.executionDate) {
      formData.append(
        "executionDate",
        this.dateS.getDateFormat(formValue.executionDate) ?? "",
      );
    }
    if (formValue.lastdayofwork) {
      formData.append(
        "lastDayOfWork",
        this.dateS.getDateFormat(formValue.lastdayofwork) ?? "",
      );
    }
    formData.append(
      "applicationUserRequestId",
      this.authS.applicationUserId.toString(),
    );

    const discountDescriptions = formValue.discountDescriptions;
    for (let i = 0; i < discountDescriptions.length; i++) {
      const discountDescription = discountDescriptions[i];
      formData.append(
        `discountDescription[${i}].description`,
        discountDescription.description,
      );
      formData.append(
        `discountDescription[${i}].price`,
        discountDescription.price.toString(),
      );
    }

    return formData;
  }

  isControlInvalid(control: AbstractControl | null): boolean {
    if (control instanceof FormControl) {
      return control.invalid && (control.touched || control.dirty);
    }
    return false;
  }

  addDiscountDescription() {
    const discountDescription = this.formBuilder.nonNullable.group({
      description: ["", [Validators.required]],
      price: ["", [Validators.required]],
    });
    this.discountDescriptions.push(discountDescription);
  }

  removeDiscountDescription(index: number) {
    this.discountDescriptions.removeAt(index);
  }

  getDiscountControl(
    index: number,
    controlName: string,
  ): FormControl | undefined {
    const control = this.discountDescriptions.at(index)?.get(controlName);
    return control instanceof FormControl ? control : undefined;
  }

  // File logic incorporated into main form
  maxSizeExceeded: boolean = false;
  onFileChange() {
    this.maxSizeExceeded = false;
    const maxFileSize = 10 * 1024 * 1024; // 10 MB
    let sizeFile = 0;
    const files = this.filesControl.value;
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        sizeFile = sizeFile + files[i].size;
      }
    }
    if (sizeFile > maxFileSize) {
      this.maxSizeExceeded = true;
    } else {
      if (files && files.length > 0) {
        this.filesControl.setErrors(null);
      }
    }
  }
}
