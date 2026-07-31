import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { InspectionEdit } from "../models/inspection.model";

interface IInspeccionsForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  departamentId: FormControl<number | null>;
  customerId: FormControl<string | null>;
  departament: FormControl<number | null>;  // Valor numérico del enum
  frequency: FormControl<string | null>;
  isActive: FormControl<boolean | null>;
  dayOfMonth: FormControl<number | null>;
  weeklyDays: FormArray<FormControl<number | null>>;
}

@Component({
  selector: "app-inspecciones-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./inspecciones-form.html",
})
export class InspeccionesForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private customerService = inject(CustomerIdService);
  private destroyRef = inject(DestroyRef);

  // Error signal para mostrar errores de carga
  loadError = signal<string | null>(null);

  submitting = signal(false);
  cb_departament = signal<SelectItemDto[]>([]);

  frequencyOptions = [
    { label: "Diaria", value: "daily" },
    { label: "Semanal", value: "weekly" },
    { label: "Mensual", value: "monthly" },
  ];
  activeStatusOptions = [
    { label: "Activa", value: true },
    { label: "Inactiva", value: false },
  ];

  id: string = "";

  // Definición estricta del formulario
  form: FormGroup<IInspeccionsForm> = new FormGroup<IInspeccionsForm>(
    {
      id: new FormControl<string | null>({ value: "", disabled: true }),
      name: new FormControl<string>("", Validators.required),
      departamentId: new FormControl<number>(0),
      customerId: new FormControl<string>(
        this.customerService.customerId(),
        Validators.required,
      ),
      departament: new FormControl<number>(0),
      frequency: new FormControl<string>("", Validators.required),
      isActive: new FormControl<boolean>(true, Validators.required),
      dayOfMonth: new FormControl<number | null>(null),
      weeklyDays: new FormArray<FormControl<number | null>>([]),
    },
    { validators: this.weeklyDaysValidator },
  );

  // Auxiliar form for checkboxes
  daysForm = new FormGroup({});

  get weeklyDays(): FormArray<FormControl<number | null>> {
    return this.form.controls.weeklyDays;
  }

  selectedFrequency = signal<string | null>(null);

  weekDays = [
    { label: "Lunes", value: 1, key: "day_1" },
    { label: "Martes", value: 2, key: "day_2" },
    { label: "Miércoles", value: 3, key: "day_3" },
    { label: "Jueves", value: 4, key: "day_4" },
    { label: "Viernes", value: 5, key: "day_5" },
    { label: "Sábado", value: 6, key: "day_6" },
    { label: "Domingo", value: 0, key: "day_0" },
  ];

  ngOnInit(): void {
    // Initialize daysForm
    this.weekDays.forEach((day) => {
      this.daysForm.addControl(day.key, new FormControl(false));
    });

    // Sync daysForm -> weeklyDays FormArray con auto-cleanup
    this.daysForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((val) => {
        this.weeklyDays.clear();
        this.weekDays.forEach((day) => {
          if (val[day.key]) {
            this.weeklyDays.push(new FormControl(day.value));
          }
        });
        this.form.updateValueAndValidity();
      });

    this.id = this.config.data.id || "";
    this.form.patchValue({ id: this.id });

    if (this.id !== "") this.onLoadData();
    this.onLoadSelectItem();
  }

  onLoadData() {
    this.loadError.set(null);

    this.apiResponseS
      .onGetItem<InspectionEdit>(Endpoints.Inspections.getById(this.id))
      .then((result: InspectionEdit) => {
        try {
          // Validar que result tiene estructura mínima requerida
          if (!result || !result.name) {
            this.loadError.set("Error: Datos de inspección incompletos");
            return;
          }

          // Patch values con validación de nulabilidad
          this.form.patchValue({
            id: result.id ?? "",
            name: result.name ?? "",
            customerId: result.customerId ?? "",
            departament: result.departament ?? 0,  // Valor numérico del enum
            frequency: result.frequency ?? "daily",
            isActive: result.isActive ?? true,
            dayOfMonth: result.dayOfMonth ?? null,
          });

          // Limpiar y sincronizar días semanales con seguridad
          this.weeklyDays.clear();
          this.daysForm.reset({ emitEvent: false });

          // Sincronizar solo si frequency es "weekly" Y weeklyDays existe y es array
          if (
            result.frequency === "weekly" &&
            result.weeklyDays &&
            Array.isArray(result.weeklyDays) &&
            result.weeklyDays.length > 0
          ) {
            result.weeklyDays.forEach((day: number) => {
              // Validar que day es número válido (0-6)
              if (typeof day === "number" && day >= 0 && day <= 6) {
                this.weeklyDays.push(new FormControl(day));

                // Sincronizar checkbox correspondiente
                const dayObj = this.weekDays.find((d) => d.value === day);
                if (dayObj && this.daysForm.controls[dayObj.key]) {
                  this.daysForm.controls[dayObj.key].setValue(true, {
                    emitEvent: false,
                  });
                }
              }
            });
          }

          // Sincronizar solo si frequency es "monthly" Y dayOfMonth existe
          if (result.frequency === "monthly" && result.dayOfMonth) {
            // dayOfMonth ya fue patchado arriba
            this.weeklyDays.clear();
            this.daysForm.reset({ emitEvent: false });
          }

          // Validar y actualizar validadores según frequency
          this.onValidateFrequency(result.frequency);
        } catch (error) {
          console.error("Error al cargar inspección:", error);
          this.loadError.set("Error al procesar datos de inspección");
        }
      })
      .catch((error) => {
        console.error("Error al obtener inspección:", error);
        this.loadError.set("Error al cargar la inspección");
      });
  }

  onValidateFrequency(frequency: string) {
    if (frequency !== "weekly") {
      this.weeklyDays.clear();
      this.daysForm.reset({ emitEvent: false });
    }
    this.selectedFrequency.set(frequency);

    const dayOfMonthControl = this.form.controls.dayOfMonth;
    if (frequency === "monthly") {
      dayOfMonthControl.setValidators([Validators.required]);
    } else {
      dayOfMonthControl.clearValidators();
      dayOfMonthControl.reset();
    }
    dayOfMonthControl.updateValueAndValidity();
  }

  onFrequencyChange(value: string): void {
    this.onValidateFrequency(value);
    this.form.updateValueAndValidity();
  }

  onSubmit() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Inspections.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }

  weeklyDaysValidator(control: AbstractControl): ValidationErrors | null {
    const frequency = control.get("frequency")?.value;
    const weeklyDays = control.get("weeklyDays") as FormArray;

    if (frequency === "weekly" && weeklyDays?.length === 0) {
      return { requiredWeeklyDays: true };
    }
    return null;
  }

  onLoadSelectItem() {
    this.apiResponseS
      .onGetEnumSelectItem(Endpoints.EnumSelectItems.departament)
      .then((result: any) => {
        this.cb_departament.set(result);
      });
  }

  getDayControl(key: string): FormControl {
    return this.daysForm.get(key) as FormControl;
  }
}
