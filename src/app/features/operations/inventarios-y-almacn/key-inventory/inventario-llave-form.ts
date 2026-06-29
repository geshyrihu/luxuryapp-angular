import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputNumberSignal } from "src/app/core/components/web/inputs/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

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
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
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

  cb_equipoClasificacion: ISelectItem[] = [];
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
    const urlApi = `InventarioLlave/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "InventarioLlave",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }

  onLoadEquipoClasificacion() {
    const urlApi = "EquipoClasificacion";
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(urlApi)
      .then((result: any) => {
        this.cb_equipoClasificacion = result;
      });
  }
}

