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
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface IFormInventarioLlave {
  id: FormControl<string>;
  customerId: FormControl<string | null>;
  descripcion: FormControl<string>;
  marca: FormControl<string>;
  numeroLlave: FormControl<number | null>;
  cantidad: FormControl<number | null>;
  equipoClasificacionId: FormControl<number | null>;
  applicationUserId: FormControl<string | null>;
}
@Component({
  selector: "app-inventario-llave-form",
  templateUrl: "./inventario-llave-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class InventarioLlaveForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  submitting = signal(false);

  id: string = "";

  cb_equipoClasificacion: SelectItemDto[] = [];
  form: FormGroup<IFormInventarioLlave> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    descripcion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    marca: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    numeroLlave: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    cantidad: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    equipoClasificacionId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string | null>(
      this.authS.applicationUserId,
      { validators: [Validators.required] },
    ),
  });

  ngOnInit() {
    this.onLoadEquipoClasificacion();
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = Endpoints.KeyInventory.getById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.KeyInventory.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }

  onLoadEquipoClasificacion() {
    const urlApi = Endpoints.SelectItems.equipoClasificacion;
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(urlApi)
      .then((result: any) => {
        this.cb_equipoClasificacion = result;
      });
  }
}
