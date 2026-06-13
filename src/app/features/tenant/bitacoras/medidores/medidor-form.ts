import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IMedidorForm {
  id: FormControl<string | null>;
  medidorCategoriaId: FormControl<number | string>;
  numeroMedidor: FormControl<string>;
  descripcion: FormControl<string>;
  medidorActivo: FormControl<boolean>;
  fechaRegistro: FormControl<string>;
  consumoDiarioMaximo: FormControl<number>;
  customerId: FormControl<string>;
}

@Component({
  selector: "app-medidor-form",
  templateUrl: "./medidor-form.html",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputDecimal,
    CustomInputTextSignal,
    CustomInputSelectSignal,
  ],
})
export class MedidorForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  id = signal<number>(0);
  cb_nombreMedidorCategoria = signal<ISelectItem[]>([]);

  form: FormGroup<IMedidorForm> = new FormGroup<IMedidorForm>({
    id: new FormControl({ value: "", disabled: true }),
    medidorCategoriaId: new FormControl<number | string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    numeroMedidor: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    descripcion: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    medidorActivo: new FormControl(true, { nonNullable: true }),
    fechaRegistro: new FormControl("", { nonNullable: true }),
    consumoDiarioMaximo: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    customerId: new FormControl(this.customerIdS.customerId(), {
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id.set(this.config.data.id);
    this.onSelectItem();
    if (this.id() !== 0) this.onLoadData();
  }

  onSelectItem() {
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(Endpoints.MeterCategories.getAll)
      .then((response: ISelectItem[]) => {
        this.cb_nombreMedidorCategoria.set(response || []);
      });
  }

  onLoadData() {
    const urlApi = Endpoints.Meters.getById(this.id()!);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    if (this.id() === 0) {
      this.apiResponseS
        .onPost(Endpoints.Meters.create, this.form.getRawValue())
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.Meters.update(this.id()!), this.form.getRawValue())
        .then((result: boolean) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }
}