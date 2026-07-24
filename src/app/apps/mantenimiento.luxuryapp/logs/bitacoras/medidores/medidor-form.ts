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
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
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
  cb_nombreMedidorCategoria = signal<SelectItemDto[]>([]);

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
      .onGetSelectItem<SelectItemDto[]>(Endpoints.MeterCategories.getAll)
      .then((response: SelectItemDto[]) => {
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
