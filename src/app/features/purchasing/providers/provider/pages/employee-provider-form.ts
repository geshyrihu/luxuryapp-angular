import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { imageToBase64 } from "src/app/core/helpers/enumeration";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { UserInfoDTO } from "src/app/core/interfaces/user-info.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EmployeeInternalService } from "../../../../hr/expediente-del-empleado/employees/employee-internal/services/employee-internal.service";

type Opcion = "none" | "vacante" | "alta";

@Component({
  selector: "app-employee-provider-form",
  templateUrl: "./employee-provider-form.html",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputImg,
    WebButtonLabelSave,
    CustomInputTextAreaSignal,
  ],
})
export class EmployeeProviderForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  employeeS = inject(EmployeeInternalService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  dateS = inject(DateService);
  enumSelectS = inject(EnumSelectService);
  ref = inject(DynamicDialogRef);

  submitting = signal(false);
  fase = signal<1 | 2>(1);
  opcion = signal<Opcion>("none");
  newEmployeeId = signal<string>("");

  /** Vacante pre-seleccionada cuando se abre el form desde un puesto vacante. */
  readonly preselectedPositionRequestId: string | null =
    this.config.data?.positionRequestId ?? null;

  /** Rol del puesto vacante é pre-llena applicationRoleId en fase 1. */
  readonly preselectedApplicationRoleId: string | null =
    this.config.data?.applicationRoleId ?? null;

  imgBase64: string = "";
  typePerson: any = this.config.data.typePerson;

  imagen: File | null = null;
  cb_applicationRole = signal<ISelectItem[]>([]);
  cb_vacantes = signal<ISelectItem[]>([]);
  cb_typeContractRegister = signal<ISelectItem[]>([]);

  data: UserInfoDTO;
  existingPerson: any[] = [];
  existingPhone: any[] = [];

  form = new FormGroup({
    firstName: new FormControl<string>("", Validators.required),
    lastName: new FormControl<string>("", Validators.required),
    phoneNumber: new FormControl<string>("", Validators.required),
    applicationRoleId: new FormControl<number | string>(
      "",
      Validators.required,
    ),
    photoPath: new FormControl<File | string>("", Validators.required),
    typePerson: new FormControl<number>(this.typePerson, Validators.required),
    birth: new FormControl<Date | string>("", Validators.required),
    email: new FormControl<string>("", [
      Validators.required,
      Validators.email,
      Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
    ]),
  });

  altaForm = new FormGroup({
    positionRequestId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
    boss: new FormControl<string>("", Validators.required),
    customerAddress: new FormControl<string>("", Validators.required),
    additionalInformation: new FormControl<string>(""),
  });

  vacanteForm = new FormGroup({
    positionRequestId: new FormControl<string | null>(
      null,
      Validators.required,
    ),
    typeContractRegister: new FormControl<number | null>(
      null,
      Validators.required,
    ),
  });

  async ngOnInit(): Promise<void> {
    this.employeeS.getApplicationRoles().then((response: any) => {
      this.cb_applicationRole.set(response);
      if (this.preselectedApplicationRoleId) {
        this.form.controls.applicationRoleId.setValue(
          this.preselectedApplicationRoleId,
        );
      }
    });
  }

  private async loadFase2Catalogs(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const [vacantes, tiposContrato, address, admins] = await Promise.all([
      this.apiResponseS.onGetList<ISelectItem[]>(
        `requestemployeeregister/vacantes/${customerId}`,
      ),
      firstValueFrom(this.enumSelectS.typeContractRegister()),
      this.apiResponseS.onGetItem<any>(`customer-addresses/${customerId}`),
      this.apiResponseS.onGetList<any[]>(
        `customer-data-company/administrador/${customerId}`,
      ),
    ]);

    this.cb_vacantes.set(vacantes ?? []);
    this.cb_typeContractRegister.set((tiposContrato as ISelectItem[]) ?? []);

    // Default: "Por tres meses" (ForThreeMont = 1)
    this.altaForm.controls.typeContractRegister.setValue(1);
    this.vacanteForm.controls.typeContractRegister.setValue(1);

    // Pre-seleccionar vacante si se abrié desde un puesto vacante específico
    if (this.preselectedPositionRequestId) {
      this.altaForm.controls.positionRequestId.setValue(
        this.preselectedPositionRequestId,
      );
      this.vacanteForm.controls.positionRequestId.setValue(
        this.preselectedPositionRequestId,
      );
    }

    if (address) {
      this.altaForm.controls.customerAddress.setValue(
        this.buildFullAddress(address),
      );
    }

    if (admins?.length) {
      this.altaForm.controls.boss.setValue(admins[0].nameEmployee ?? "");
    }
  }

  private buildFullAddress(a: any): string {
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

  register() {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const formData = this.createFormData(this.form.value);

    this.submitting.set(true);
    const request$ =
      this.typePerson == 0
        ? this.employeeS.createEmployee(formData)
        : this.employeeS.createEmployeeExternal(formData);

    return request$.then((result: any) => {
      if (result) {
        const employeeId = result?.id ?? result?.employeeId ?? "";
        if (employeeId) {
          this.newEmployeeId.set(employeeId);
          this.loadFase2Catalogs();
          this.submitting.set(false);
          this.fase.set(2);
        } else {
          this.ref.close(true);
        }
      } else {
        this.submitting.set(false);
      }
    });
  }

  setOpcion(opcion: Opcion): void {
    this.opcion.set(opcion);
  }

  onConfirmarFase2(): void {
    const opcion = this.opcion();

    if (opcion === "none") {
      this.ref.close(true);
      return;
    }

    if (opcion === "vacante") {
      if (!this.apiResponseS.validateForm(this.vacanteForm)) return;
      const { positionRequestId, typeContractRegister } =
        this.vacanteForm.getRawValue();
      this.submitting.set(true);
      this.apiResponseS
        .onPost(
          `SolicitudesReclutamiento/SolicitudAlta/${this.authS.applicationUserId}`,
          {
            employeeId: this.newEmployeeId(),
            positionRequestId,
            typeContractRegister,
            candidateName: `${this.form.value.firstName} ${this.form.value.lastName}`,
          },
        )
        .then(() => this.ref.close(true))
        .finally(() => this.submitting.set(false));
    }

    if (opcion === "alta") {
      if (!this.apiResponseS.validateForm(this.altaForm)) return;
      const altaValues = this.altaForm.getRawValue();
      this.submitting.set(true);
      this.apiResponseS
        .onPost(
          `SolicitudesReclutamiento/SolicitudAlta/${this.authS.applicationUserId}`,
          {
            employeeId: this.newEmployeeId(),
            positionRequestId: altaValues.positionRequestId,
            typeContractRegister: altaValues.typeContractRegister,
            boss: altaValues.boss,
            customerAddress: altaValues.customerAddress,
            additionalInformation: altaValues.additionalInformation,
            candidateName: `${this.form.value.firstName} ${this.form.value.lastName}`,
          },
        )
        .then(() => this.ref.close(true))
        .finally(() => this.submitting.set(false));
    }
  }

  private createFormData(model: any): FormData {
    const formData = new FormData();
    formData.append("email", model.email);
    formData.append("customerId", this.customerIdS.customerId());
    formData.append("firstName", model.firstName);
    formData.append("birth", this.dateS.getDateFormat(model.birth));
    formData.append("lastName", model.lastName);
    formData.append("phoneNumber", model.phoneNumber);
    formData.append("applicationRoleId", model.applicationRoleId);
    formData.append("typePerson", this.typePerson.toString());
    if (this.imagen) {
      formData.append("photoPath", this.imagen);
    }
    return formData;
  }

  change(file: File): void {
    if (file) {
      imageToBase64(file)
        .then((value: string) => {
          this.imgBase64 = value;
        })
        .catch((error) => console.log(error));
      this.imagen = file;
      this.form.controls.photoPath.setValue(file);
    }
  }

  searchExistingPerson(event: any) {
    const fullName = event.target.value;
    if (fullName.length < 1) return;
    this.existingPerson = [];
    this.employeeS.searchExistingPerson(fullName).then((result: any) => {
      this.existingPerson = result;
    });
  }

  searchExistingPhone(event: any) {
    const phone = event.target.value;
    if (phone.length < 1) return;
    this.existingPhone = [];
    this.employeeS.searchExistingPhone(phone).then((result: any) => {
      this.existingPhone = result;
    });
  }
}
