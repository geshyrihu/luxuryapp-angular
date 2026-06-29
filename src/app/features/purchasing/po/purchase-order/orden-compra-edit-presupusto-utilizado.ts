import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { CustomInputCurrencySignal } from "src/app/core/components/web/inputs/custom-input-currency-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
export interface IOrdenCompraPresupuestoForm {
  id: FormControl<string | null>;
  amount: FormControl<number | null>;
  ordenCompraId: FormControl<string | null>;
  accountName: FormControl<string | null>;
  fiscalYear: FormControl<number | null>;
  accountNumber: FormControl<string | null>;
}

@Component({
  selector: "app-orden-compra-edit-presupusto-utilizado",
  templateUrl: "./orden-compra-edit-presupusto-utilizado.html",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputCurrencySignal,
    CustomButtonSave,
  ],
})
export class OrdenCompraEditPresupustoUtilizado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  submitting = signal(false);

  id: string = "";

  form: FormGroup<IOrdenCompraPresupuestoForm> =
    this.formB.group<IOrdenCompraPresupuestoForm>({
      id: new FormControl({ value: this.id, disabled: true }),
      amount: new FormControl(null, Validators.required),
      ordenCompraId: new FormControl("", Validators.required),
      accountName: new FormControl("", Validators.required),
      fiscalYear: new FormControl(null, Validators.required),
      accountNumber: new FormControl("", Validators.required),
    });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseOrderBudgets.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    this.apiResponseS
      .onPut(Endpoints.PurchaseOrderBudgets.update(this.id), this.form.value)
      .then((result: boolean) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}

