import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { MultiSelectModule } from "primeng/multiselect";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputFile } from "src/app/core/components/inputs/web/custom-input-file-signal";
import { CustomInputImg } from "src/app/core/components/inputs/web/custom-input-img-signal";
import { CustomInputMaskSignal } from "src/app/core/components/inputs/web/custom-input-mask-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IProveedorForm {
  id: FormControl<string | null>;
  tipoServicio: FormControl<ISelectItem | null>;
  address: FormControl<string>;
  bankId: FormControl<number | null>;
  cellPhoneOne: FormControl<string>;
  cellPhoneTwo: FormControl<string | null>;
  contactOne: FormControl<string>;
  contactTwo: FormControl<string | null>;
  emailOne: FormControl<string>;
  emailTwo: FormControl<string | null>;
  interbankCode: FormControl<string>;
  nameCheck: FormControl<string>;
  nameProvider: FormControl<string>;
  nameComercial: FormControl<string | null>;
  pathPhoto: FormControl<string | File | null>;
  paymentAccount: FormControl<string>;
  phoneOne: FormControl<string>;
  phoneTwo: FormControl<string | null>;
  positionOne: FormControl<string>;
  positionTwo: FormControl<string | null>;
  repair: FormControl<boolean | null>;
  rfc: FormControl<string>;
  bankName: FormControl<ISelectItem | null>;
  sales: FormControl<boolean | null>;
  applicationUserId: FormControl<string | null>;
  convenio: FormControl<string | null>;
  referencia: FormControl<string | null>;
  webPage: FormControl<string | null>;
  customerId: FormControl<string | null>;
  categorias: FormControl<ISelectItem[] | null>;
  constanciaFiscal: FormControl<string | File | null>;
}

@Component({
  selector: "app-proveedor-form",
  templateUrl: "./proveedor-form.html",
  imports: [
    ReactiveFormsModule,
    MultiSelectModule,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputMaskSignal,
    CustomInputTextAreaSignal,
    CustomInputSwitch,
    CustomInputAutoComplete,
    CustomInputFile,
    CustomInputImg,
    WebButtonLabelSave,
    InputTextModule,
  ],
})
export class ProveedorForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  destroyRef = inject(DestroyRef);

  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_category = signal<ISelectItem[]>([]);
  cb_tipoServicio = signal<ISelectItem[]>([]);
  cb_bancos = signal<ISelectItem[]>([]);
  rfcCoincidente = signal<any[]>([]);

  photoFileUpdate: boolean = false;
  urlLogo = "";

  form: FormGroup<IProveedorForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    tipoServicio: new FormControl<ISelectItem | null>(null, {
      validators: [Validators.required],
    }),
    address: new FormControl("", { validators: [Validators.required] }),
    bankId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    cellPhoneOne: new FormControl("", { validators: [Validators.required] }),
    cellPhoneTwo: new FormControl(""),
    contactOne: new FormControl("", { validators: [Validators.required] }),
    contactTwo: new FormControl(""),
    emailOne: new FormControl("", { validators: [Validators.required] }),
    emailTwo: new FormControl(""),
    interbankCode: new FormControl("", { validators: [Validators.required] }),
    nameCheck: new FormControl("", { validators: [Validators.required] }),
    nameProvider: new FormControl("", { validators: [Validators.required] }),
    nameComercial: new FormControl(""),
    pathPhoto: new FormControl<string | File>(""),
    paymentAccount: new FormControl("", { validators: [Validators.required] }),
    phoneOne: new FormControl("", { validators: [Validators.required] }),
    phoneTwo: new FormControl(""),
    positionOne: new FormControl("", { validators: [Validators.required] }),
    positionTwo: new FormControl(""),
    repair: new FormControl(false),
    rfc: new FormControl("", { validators: [Validators.required] }),
    bankName: new FormControl<ISelectItem | null>(null, {
      validators: [Validators.required],
    }),
    sales: new FormControl(false),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId,
    ),
    convenio: new FormControl(""),
    referencia: new FormControl(""),
    webPage: new FormControl(""),
    customerId: new FormControl<string | null>(this.customerIdS.customerId()),
    categorias: new FormControl<ISelectItem[] | null>(null),
    constanciaFiscal: new FormControl<string | File>(""),
  });

  get f() {
    return this.form.controls;
  }

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    if (!this.id) {
      this.form.controls.constanciaFiscal.setValidators(Validators.required);
      this.form.controls.constanciaFiscal.updateValueAndValidity();
    }

    // Subscribe to RFC changes
    this.form.controls.rfc.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.onValidarRFC(value);
      });

    await this.onLoadSelectItem();

    if (this.id) {
      await this.getItem();
    }
  }

  public isNullUrl(url: string): boolean {
    return url.endsWith("/null") || url === "null";
  }

  async onLoadSelectItem(): Promise<void> {
    const [categories, banks, tipoServicio] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(`Categories`),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(`Bank`),
      this.apiResponseS.onGetEnumSelectItem(`EServiceType`),
    ]);

    this.cb_category.set(categories as ISelectItem[]);
    this.cb_bancos.set(banks as ISelectItem[]);
    this.cb_tipoServicio.set(tipoServicio as ISelectItem[]);
  }

  async getItem(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      `Providers/${this.id}/${this.customerIdS.customerId()}`,
    );

    // Extraer bankId
    const bankId =
      typeof result.bankId === "object" ? result.bankId.value : result.bankId;

    // Buscar el banco completo
    const selectedBank = this.cb_bancos().find((item) => item.value === bankId);

    this.form.patchValue({
      ...result,
      bankId,
      bankName: selectedBank || null,
    });

    this.urlLogo = result.pathPhoto || "";
  }

  saveBancoId = (item: ISelectItem) => {
    this.form.patchValue({
      bankId: item?.value,
      bankName: item?.label,
    });
  };

  async onSubmit() {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id === "" ? `Providers/` : `Providers/${this.id}`,
      method: this.id === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue) => this.onCreateFormData(formValue),
    });
  }

  onCreateFormData(DTO: any): FormData {
    const formData = new FormData();

    // Convertimos el objeto DTO a FormData dinámicamente
    Object.keys(DTO).forEach((key) => {
      const value = DTO[key];
      if (value === null || value === undefined) {
        return; // No Aóadir valores nulos
      }

      if (key === "categorias" && Array.isArray(value)) {
        // Caso especial para el array de categoróas
        value.forEach((category: any) => {
          formData.append("categorias", category.value);
        });
      } else if (typeof value === "boolean") {
        // Caso especial para booleanos
        formData.append(key, String(value));
      } else {
        // Para todos los demís tipos (string, number, File)
        formData.append(key, value);
      }
    });

    // Aseguramos que el applicationUserId siempre esté presente
    formData.append("applicationUserId", String(this.authS.applicationUserId));
    formData.set("customerId", String(this.customerIdS.customerId()));

    return formData;
  }

  uploadFile(file: File) {
    this.photoFileUpdate = true;
    this.form.patchValue({ pathPhoto: file });
  }

  onValidarRFC(valueRfc: string) {
    if (valueRfc.length > 5) {
      const urlApi = `Providers/ValidarRfc/${valueRfc}/${this.customerIdS.customerId()}`;
      this.apiResponseS.onGetList(urlApi).then((result: any) => {
        this.rfcCoincidente.set(result);
      });
    }
  }

  change(file: any) {
    this.form.patchValue({ constanciaFiscal: file });
  }
}
