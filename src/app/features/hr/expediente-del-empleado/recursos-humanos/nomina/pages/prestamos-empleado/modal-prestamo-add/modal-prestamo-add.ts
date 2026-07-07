import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  NUMERO_PAGOS_OPTIONS,
  PrestamoEmpleadoCreateDTO,
} from "../../../interfaces/prestamo-empleado.interface";

@Component({
  selector: "app-modal-prestamo-add",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputDecimal,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./modal-prestamo-add.html",
})
export default class ModalPrestamoAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  employees = signal<ISelectItem[]>([]);
  readonly numeroPagosOptions: ISelectItem[] = NUMERO_PAGOS_OPTIONS;
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    employeeId: [""],
    employeeName: ["", Validators.required],
    montoTotal: [0, [Validators.required, Validators.min(1)]],
    numeroPagos: [1, Validators.required],
    motivo: ["", [Validators.required, Validators.minLength(5)]],
    observaciones: [""],
  });

  async ngOnInit(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const employees = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.employees.set(employees ?? []);
  }

  saveEmployee = (item: ISelectItem) => {
    this.form.patchValue({
      employeeId: item?.value || "",
      employeeName: item?.label || "",
    });
  };

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.HR.Nomina.Prestamos.create,
      method: "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (v) => {
        return {
          customerId: this.customerIdS.customerId(),
          employeeId: v.employeeId,
          montoTotal: v.montoTotal,
          numeroPagos: v.numeroPagos,
          motivo: v.motivo,
          observaciones: v.observaciones || undefined,
        } as PrestamoEmpleadoCreateDTO;
      },
    });
  }
}
