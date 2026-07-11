import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { InputImg } from "@ui/inputs/adaptive/input-img/input-img";
import { InputMask } from "@ui/inputs/adaptive/input-mask/input-mask";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { Observable, of } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";

interface IEmployeeExternalForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  phoneNumberPrefix: FormControl<string | null>;
  applicationRoleId: FormControl<string | null>;
  providerId: FormControl<string | null>;
  providerName: FormControl<string | null>;
  photoPath: FormControl<string | File | null>;
  email: FormControl<string>;
  phoneNumber: FormControl<string>;
}

@Component({
  selector: "app-employee-external-form",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    WebButtonLabel,
    CustomInputTextSignal,
    InputMask,
    CustomInputSelectSignal,
    CustomInputSelectSignal,
    InputAutocomplete,
    InputImg,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./employee-external-form.html",
})
export class EmployeeExternalForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  ref = inject(DynamicDialogRef);

  userId: string = "";
  submitting = signal(false);

  imgBase64: string = "";
  imagen: File;

  // Signals para ComboBoxes
  cb_applicationRole = signal<ISelectItem[]>([]);
  cb_providers = signal<ISelectItem[]>([]);
  existingApplicationUser = signal<any[]>([]);

  form: FormGroup<IEmployeeExternalForm> = this.formB.group(
    {
      firstName: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      lastName: new FormControl("", {
        validators: [Validators.required],
        nonNullable: true,
      }),
      phoneNumberPrefix: new FormControl("+52"),
      applicationRoleId: new FormControl<string | null>(null, {
        validators: [Validators.required],
      }),
      providerId: new FormControl("", { validators: [Validators.required] }),
      providerName: new FormControl<string | null>(null),
      photoPath: new FormControl<string | File>(""),
      email: new FormControl("", {
        validators: [
          Validators.required,
          Validators.email,
          Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
        ],
        asyncValidators: [this.emailExistsValidator()],
        nonNullable: true,
      }),
      phoneNumber: new FormControl("", {
        validators: [Validators.required],
        asyncValidators: [this.phoneExistsValidator()],
        nonNullable: true,
      }),
    },
    { updateOn: "blur" },
  );

  async ngOnInit(): Promise<void> {
    this.userId = this.config.data.userId;

    await this.onLoadSelectItems();

    if (this.userId) {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [applicationRoles, providers] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.applicationRolesToProvider,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.providers(this.customerIdS.customerId()),
      ),
    ]);

    this.cb_applicationRole.set(applicationRoles as ISelectItem[]);
    this.cb_providers.set(providers as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.EmployeeExternal.getById(this.userId),
    );

    // Extraer providerId
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;

    // Buscar el proveedor completo
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );

    this.form.patchValue({
      ...result,
      providerId,
      providerName: selectedProvider || null,
    });

    this.imgBase64 = result.photoPath || "";
  }

  saveProviderId = (item: ISelectItem) => {
    this.form.patchValue({
      providerId: item?.value,
      providerName: item?.label,
    });
  };

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: !this.userId
        ? Endpoints.EmployeeExternal.create
        : Endpoints.EmployeeExternal.update(this.userId),
      method: !this.userId ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (val) => this.createFormData(val),
    });
  }

  private createFormData(model: any): FormData {
    const formData = new FormData();

    formData.append("email", model.email);
    formData.append("firstName", model.firstName);
    formData.append("lastName", model.lastName);
    formData.append("phoneNumber", model.phoneNumber);
    formData.append("phoneNumberPrefix", model.phoneNumberPrefix ?? "+52");
    formData.append("applicationRoleId", model.applicationRoleId);
    formData.append("providerId", model.providerId);
    formData.append("customerId", this.customerIdS.customerId().toString());

    if (this.imagen) {
      formData.append("photoPath", this.imagen);
    }

    return formData;
  }

  searchExistingEmail(): void {
    const email = this.form.get("email")?.value;
    const userId = this.userId;

    if (email && email.length > 5) {
      this.apiResponseS
        .onGetListNotLoading(
          Endpoints.EmployeeExternal.searchByEmail(
            this.customerIdS.customerId(),
            email,
            userId,
          ),
        )
        .then((res: any[]) => {
          this.existingApplicationUser.set(res);
        })
        .catch(() => {
          this.existingApplicationUser.set([]);
        });
    } else {
      this.existingApplicationUser.set([]);
    }
  }

  searchExistingPhone(): void {
    let phone = this.form.get("phoneNumber")?.value;
    phone = phone?.replace(/\D/g, "");
    const userId = this.userId;

    if (phone && phone.length >= 10) {
      this.apiResponseS
        .onGetListNotLoading(
          Endpoints.EmployeeExternal.searchByPhone(
            this.customerIdS.customerId(),
            phone,
            userId,
          ),
        )
        .then((res: any[]) => {
          this.existingApplicationUser.set(res);
        })
        .catch(() => {
          this.existingApplicationUser.set([]);
        });
    } else {
      this.existingApplicationUser.set([]);
    }
  }

  get photoInvalid(): boolean {
    return !this.imgBase64 && this.form.get("photoPath")?.touched;
  }

  change(file: File): void {
    if (file) {
      this.imagen = file;
      // No necesitamos leer el archivo aqui, el componente hijo ya lo hizo
      // y actualizo su estado interno imgBase64
      this.form.get("photoPath")?.markAsTouched();
    }
  }

  emailExistsValidator() {
    return (
      control: AbstractControl,
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      const email = control.value;
      const userId = this.userId;

      if (!email || email.length < 5) {
        return of(null);
      }

      return this.apiResponseS
        .onGetListNotLoading(
          Endpoints.EmployeeExternal.searchByEmail(
            this.customerIdS.customerId(),
            email,
            userId,
          ),
        )
        .then((res: any[]) => {
          if (res && res.length > 0) {
            return { emailExist: true };
          }
          return null;
        })
        .catch(() => null);
    };
  }

  phoneExistsValidator() {
    return (
      control: AbstractControl,
    ):
      | Promise<ValidationErrors | null>
      | Observable<ValidationErrors | null> => {
      let phone = control.value;
      const userId = this.userId;

      if (!phone || phone.length < 10) {
        return of(null);
      }

      phone = phone.replace(/\D/g, "");

      return this.apiResponseS
        .onGetListNotLoading(
          Endpoints.EmployeeExternal.searchByPhone(
            this.customerIdS.customerId(),
            phone,
            userId,
          ),
        )
        .then((res: any[]) => {
          if (res && res.length > 0) {
            return { phoneExist: true };
          }
          return null;
        })
        .catch(() => null);
    };
  }

  addAccessCustomer(applicationUserId: string) {
    this.apiResponseS
      .onPost(
        Endpoints.EmployeeExternal.addAccessCustomer(
          applicationUserId,
          this.customerIdS.customerId(),
        ),
        null,
      )
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
