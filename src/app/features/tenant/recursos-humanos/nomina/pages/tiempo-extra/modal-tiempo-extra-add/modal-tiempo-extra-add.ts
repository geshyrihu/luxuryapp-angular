import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  TiempoExtraCreateDTO,
  TiempoExtraDTO,
  TiempoExtraUpdateDTO,
} from "../../../interfaces/tiempo-extra.interface";

@Component({
  selector: "app-modal-tiempo-extra-add",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputDateSignal,
    CustomInputDecimal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
  templateUrl: "./modal-tiempo-extra-add.html",
})
export default class ModalTiempoExtraAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  submitting = signal(false);
  item = signal<TiempoExtraDTO | null>(null);
  employees = signal<ISelectItem[]>([]);

  form = this.fb.nonNullable.group({
    employeeId: ["", Validators.required],
    employeeName: ["", Validators.required],
    fecha:         ["", Validators.required],
    horasSimples:  [0, [Validators.required, Validators.min(0), Validators.max(9)]],
    horasDobles:   [0, [Validators.required, Validators.min(0)]],
    observaciones: [""],
  });

  readonly horasSimples = computed(() => Number(this.form.controls["horasSimples"].value) || 0);
  readonly horasDobles  = computed(() => Number(this.form.controls["horasDobles"].value)  || 0);

  async ngOnInit(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const employees = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.employees.set(employees ?? []);

    const data: TiempoExtraDTO | undefined = this.config.data?.item;
    if (data) {
      this.item.set(data);
      this.form.patchValue({
        employeeId: data.employeeId,
        employeeName: data.nombreEmpleado,
        fecha:         data.fecha.substring(0, 10),
        horasSimples:  data.horasSimples,
        horasDobles:   data.horasDobles,
        observaciones: data.observaciones,
      });
    } else {
      const employeeId: string = this.config.data?.employeeId ?? "";
      if (employeeId) {
        this.form.patchValue({ employeeId });
        const selected = this.employees().find((item) => item.value === employeeId);
        if (selected) {
          this.form.patchValue({ employeeName: selected.label ?? "" });
        }
      }
    }
  }

  saveEmployee = (item: ISelectItem) => {
    this.form.patchValue({
      employeeId: item?.value || "",
      employeeName: item?.label || "",
    });
  };

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;
    const v = this.form.getRawValue();
    const existing = this.item();

    this.submitting.set(true);
    if (!existing) {
      const periodoNominaId: string = this.config.data?.periodoNominaId ?? "";
      const dto: TiempoExtraCreateDTO = {
        periodoNominaId,
        employeeId: v.employeeId,
        fecha:         v.fecha,
        horasSimples:  v.horasSimples,
        horasDobles:   v.horasDobles,
        observaciones: v.observaciones || undefined,
      };
      const result = await this.apiResponseS.onPost(
        Endpoints.HR.Nomina.TiempoExtra.create,
        dto,
      );
      if (result) this.ref.close(true);
    } else {
      const dto: TiempoExtraUpdateDTO = {
        fecha:         v.fecha,
        horasSimples:  v.horasSimples,
        horasDobles:   v.horasDobles,
        observaciones: v.observaciones || undefined,
      };
      const result = await this.apiResponseS.onPut(
        Endpoints.HR.Nomina.TiempoExtra.update(existing.id),
        dto,
      );
      if (result) this.ref.close(true);
    }
    this.submitting.set(false);
  }
}
