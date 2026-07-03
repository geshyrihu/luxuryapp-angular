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
import { Router } from "@angular/router";
import { ROUTES } from "src/app/routing/route-paths";
import { FileUploadModule, FileUploadValidators } from "@iplab/ngx-file-upload";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
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
    WebButtonLabelSave,
    WebButtonLabel,
  ],
  styles: [
    `
      :host ::ng-deep {
        /* Contenedor principal: area visible con borde punteado */
        file-upload {
          display: block !important;
          width: 100% !important;
          border: 2px dashed var(--ds-border-strong, #cbd5e1) !important;
          border-radius: var(--ds-radius-lg, 8px) !important;
          background-color: var(--ds-bg-surface, #ffffff) !important;
          min-height: 200px !important;
          position: relative !important;
        }

        file-upload:hover {
          background-color: var(--ds-bg-sunken, #f8fafc) !important;
          border-color: var(--ds-primary, #155ec0) !important;
        }

        /*
          La libreróa posiciona el label como inline-block centrado (left:50% + translate).
          Lo convertimos en un bloque que rellena todo el area y usa flex para centrar.
        */
        file-upload label.upload-input {
          position: absolute !important;
          inset: 0 !important;
          transform: none !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          pointer-events: auto !important;
          cursor: pointer !important;
          color: inherit !important;
        }

        /* El host del drop-zone: flex column para apilar icono y texto */
        file-upload-drop-zone {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center !important;
          padding: 1rem !important;
        }

        /* .upload-text tiene overflow:hidden y padding-left:20px que recortan el texto */
        file-upload-drop-zone .upload-text {
          overflow: visible !important;
          padding: 0 !important;
          width: auto !important;
          text-align: center !important;
        }
      }
    `,
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
  private router = inject(Router);
  data: any;
  id: string = "";
  submitting = signal(false);

  employeeId: any = this.config.data.employeeId;

  cb_type_departure = signal<ISelectItem[]>([]);
  cb_si_no = signal<ISelectItem[]>([]);
  tipobaja = signal<number>(1);
  mensajeRenuncia =
    "Adjunta la renuncia firmada por el empleado, si no regreso a firmar se considera abandono de trabajo";

  hasEvaluations: boolean | null = null;

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
    files: [
      null as File[] | null,
      [
        FileUploadValidators.fileSize(10485760),
        FileUploadValidators.accept([
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".jpeg",
          ".png",
        ]),
      ],
    ],
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
    // 0: Renuncia, 1: Abandono, 2: Despido, 3: Evaluacion, 4: Faltas
    this.filesControl.clearValidators();
    if (newValue == 0 || newValue == 2 || newValue == 4) {
      this.filesControl.setValidators([
        Validators.required,
        FileUploadValidators.fileSize(10485760),
        FileUploadValidators.accept([
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".jpeg",
          ".png",
        ]),
      ]);
      if (newValue == 0)
        this.mensajeRenuncia = "Adjunta la renuncia firmada (PDF/DOCX/IMG).";
      else if (newValue == 2)
        this.mensajeRenuncia =
          "Adjunta la evidencia o justificación de despido (PDF/DOCX/IMG).";
      else if (newValue == 4)
        this.mensajeRenuncia =
          "Adjunta el acta administrativa firmada (PDF/DOCX/IMG).";
    } else {
      this.filesControl.setValidators([
        FileUploadValidators.fileSize(10485760),
        FileUploadValidators.accept([
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".jpeg",
          ".png",
        ]),
      ]);

      if (newValue == 3) {
        this.mensajeRenuncia =
          "Las evaluaciones estén registradas en el sistema. No se requiere adjuntar documento manual.";
        if (this.hasEvaluations === null) {
          this.checkEvaluations();
        }
      } else {
        this.mensajeRenuncia = "";
      }
    }

    this.tipobaja.set(newValue);
    this.filesControl.updateValueAndValidity();
  }

  checkEvaluations() {
    const urlApi = `PerformanceEvaluations/employee/${this.employeeId}/history`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.hasEvaluations =
        result && Array.isArray(result) && result.length > 0;
    });
  }

  goToCreateEvaluation() {
    this.ref.close();
    this.router.navigate(ROUTES.EVALUACION_EMPLEADOS.CONDUCTA_LISTA);
  }

  onSubmit() {
    if (this.submitting()) return;
    if (!this.apiResponseS.validateForm(this.form)) return;
    if (this.filesControl.invalid) return;
    if (
      this.form.controls.typeOfDeparture.value == 3 &&
      this.hasEvaluations === false
    )
      return;

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
