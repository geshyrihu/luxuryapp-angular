import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputDecimal } from "src/app/core/components/inputs/web/custom-input-decimal-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IncidenciaNominaCreateDTO,
  TIPO_INCAPACIDAD_OPTIONS,
  TIPO_INCIDENCIA_OPTIONS,
} from "../../../interfaces/incidencia-nomina.interface";

@Component({
  selector: "app-modal-incidencia-add",
  imports: [
    ReactiveFormsModule,
    CustomInputAutoComplete,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomInputDecimal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
  templateUrl: "./modal-incidencia-add.html",
})
export default class ModalIncidenciaAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  employees = signal<ISelectItem[]>([]);
  readonly tipoIncidenciaOptions: ISelectItem[] = TIPO_INCIDENCIA_OPTIONS;
  readonly tipoIncapacidadOptions: ISelectItem[] = TIPO_INCAPACIDAD_OPTIONS;

  submitting = signal(false);

  form = this.fb.nonNullable.group({
    employeeId:         [""],
    employeeName:       ["", Validators.required],
    periodoNominaId:    ["", Validators.required],
    tipoIncidencia:     [0, Validators.required],
    fecha:              ["", Validators.required],
    diasAfectados:      [1, [Validators.required, Validators.min(0)]],
    minutosRetardo:     [0, [Validators.required, Validators.min(0)]],
    numeroFolioImss:    [""],
    tipoIncapacidad:    [null as number | null],
    porcentajePagoImss: [null as number | null],
    observaciones:      [""],
  });

  readonly tipoIncidencia = computed(() => this.form.controls["tipoIncidencia"].value);

  readonly esRetardo    = computed(() => [1, 2].includes(this.tipoIncidencia()));
  readonly esIncapacidad = computed(() => this.tipoIncidencia() === 3);

  async ngOnInit(): Promise<void> {
    const periodoId: string = this.config.data?.periodoNominaId ?? "";
    const employeeId: string = this.config.data?.employeeId ?? "";
    this.form.patchValue({ periodoNominaId: periodoId, employeeId });

    const customerId = this.customerIdS.customerId();
    const employees = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.employees.set(employees ?? []);

    if (employeeId) {
      const selected = this.employees().find((item) => item.value === employeeId);
      if (selected) {
        this.form.patchValue({
          employeeName: selected.label ?? "",
        });
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
    const dto: IncidenciaNominaCreateDTO = {
      employeeId:      v.employeeId,
      periodoNominaId: v.periodoNominaId,
      tipoIncidencia:  v.tipoIncidencia,
      fecha:           v.fecha,
      diasAfectados:   v.diasAfectados,
      minutosRetardo:  v.minutosRetardo,
      numeroFolioImss: v.numeroFolioImss || undefined,
      tipoIncapacidad: v.tipoIncapacidad ?? undefined,
      porcentajePagoImss: v.porcentajePagoImss ?? undefined,
      observaciones:   v.observaciones || undefined,
    };
    this.submitting.set(true);
    const result = await this.apiResponseS.onPost(
      Endpoints.HR.Nomina.Incidencias.create,
      dto,
    );
    this.submitting.set(false);
    if (result) this.ref.close(true);
  }
}
