import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { LuxInputDateSignal } from "@ui/inputs/web/lux-input-date-signal";
import { LuxInputDecimal } from "@ui/inputs/web/lux-input-decimal-signal";
import { LuxInputNumberSignal } from "@ui/inputs/web/lux-input-number-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxInputTextSignal } from "@ui/inputs/web/lux-input-text-signal";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/lux-input-textarea-signal";
import {
  IncidenciaNominaCreateDTO,
  TIPO_INCAPACIDAD_OPTIONS,
  TIPO_INCIDENCIA_OPTIONS,
} from "../../interfaces/incidencia-nomina.interface";

@Component({
  selector: "app-modal-incidencia-add",
  imports: [
    ReactiveFormsModule,
    InputAutocomplete,
    LuxInputSelectSignal,
    LuxInputDateSignal,
    LuxInputNumberSignal,
    LuxInputDecimal,
    LuxInputTextSignal,
    LuxInputTextAreaSignal,
    ButtonWeb,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./modal-incidencia-add.html",
})
export default class ModalIncidenciaAdd implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);

  employees = signal<SelectItemDto[]>([]);
  readonly tipoIncidenciaOptions: SelectItemDto[] = TIPO_INCIDENCIA_OPTIONS;
  readonly tipoIncapacidadOptions: SelectItemDto[] = TIPO_INCAPACIDAD_OPTIONS;

  submitting = signal(false);

  form = this.fb.nonNullable.group({
    employeeId: [""],
    employeeName: ["", Validators.required],
    periodoNominaId: ["", Validators.required],
    tipoIncidencia: [0, Validators.required],
    fecha: ["", Validators.required],
    diasAfectados: [1, [Validators.required, Validators.min(0)]],
    minutosRetardo: [0, [Validators.required, Validators.min(0)]],
    numeroFolioImss: [""],
    tipoIncapacidad: [null as number | null],
    porcentajePagoImss: [null as number | null],
    observaciones: [""],
  });

  readonly tipoIncidencia = computed(
    () => this.form.controls["tipoIncidencia"].value,
  );

  readonly esRetardo = computed(() => [1, 2].includes(this.tipoIncidencia()));
  readonly esIncapacidad = computed(() => this.tipoIncidencia() === 3);

  async ngOnInit(): Promise<void> {
    const periodoId: string = this.config.data?.periodoNominaId ?? "";
    const employeeId: string = this.config.data?.employeeId ?? "";
    this.form.patchValue({ periodoNominaId: periodoId, employeeId });

    const customerId = this.customerIdS.customerId();
    const employees = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.SelectItems.employeesByCustomer(customerId),
    );
    this.employees.set(employees ?? []);

    if (employeeId) {
      const selected = this.employees().find(
        (item) => item.value === employeeId,
      );
      if (selected) {
        this.form.patchValue({
          employeeName: selected.label ?? "",
        });
      }
    }
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
      endpoint: Endpoints.HR.Nomina.Incidencias.create,
      method: "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (v) => {
        return {
          employeeId: v.employeeId,
          periodoNominaId: v.periodoNominaId,
          tipoIncidencia: v.tipoIncidencia,
          fecha: v.fecha,
          diasAfectados: v.diasAfectados,
          minutosRetardo: v.minutosRetardo,
          numeroFolioImss: v.numeroFolioImss || undefined,
          tipoIncapacidad: v.tipoIncapacidad ?? undefined,
          porcentajePagoImss: v.porcentajePagoImss ?? undefined,
          observaciones: v.observaciones || undefined,
        } as IncidenciaNominaCreateDTO;
      },
    });
  }
}
