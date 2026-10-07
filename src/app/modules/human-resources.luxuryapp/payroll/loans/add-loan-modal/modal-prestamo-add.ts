import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DynamicDialogRef } from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import {
  NUMERO_PAGOS_OPTIONS,
  PrestamoEmpleadoCreateDTO,
} from "../../interfaces/prestamo-empleado.interface";

@Component({
  selector: "app-modal-prestamo-add",
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
    LuxInputDecimal,
    LuxInputSelectSignal,
    LuxInputTextSignal,
    LuxInputTextAreaSignal,
    ButtonWeb,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./modal-prestamo-add.html",
})
export default class ModalPrestamoAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  employees = signal<SelectItemDto[]>([]);
  readonly numeroPagosOptions: SelectItemDto[] = NUMERO_PAGOS_OPTIONS;
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
    const employees = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.employees.set(employees ?? []);
  }

  saveEmployee = (item: SelectItemDto) => {
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
