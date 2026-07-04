import { Component, inject, OnInit, signal } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";

interface IInspeccionsForm {
  id: FormControl<string | null>;
  name: FormControl<string | null>;
  departamentId: FormControl<number | null>;
  customerId: FormControl<string | null>;
  departament: FormControl<string | null>;
  frequency: FormControl<string | null>;
  isActive: FormControl<boolean | null>;
  dayOfMonth: FormControl<number | null>;
  weeklyDays: FormArray<FormControl<number | null>>;
}

@Component({
  selector: "app-inspecciones-form",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputCheckSignal,
    CustomInputNumberSignal,
    WebButtonLabelSave,
  ],
  templateUrl: "./inspecciones-form.html",
})
export class InspeccionesForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private customerService = inject(CustomerIdService);

  submitting = signal(false);
  cb_departament = signal<ISelectItem[]>([]);

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
      departament: new FormControl<string>(""),
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
    { label: "Miórcoles", value: 3, key: "day_3" },
    { label: "Jueves", value: 4, key: "day_4" },
    { label: "Viernes", value: 5, key: "day_5" },
    { label: "Síbado", value: 6, key: "day_6" },
    { label: "Domingo", value: 0, key: "day_0" },
  ];

  ngOnInit(): void {
    // Initialize daysForm
    this.weekDays.forEach((day) => {
      this.daysForm.addControl(day.key, new FormControl(false));
    });

    // Sync daysForm -> weeklyDays FormArray
    this.daysForm.valueChanges.subscribe((val) => {
      this.weeklyDays.clear();
      this.weekDays.forEach((day) => {
        if (val[day.key]) {
          this.weeklyDays.push(new FormControl(day.value));
        }
      });
      this.form.updateValueAndValidity(); // Trigget main form validation
    });

    this.id = this.config.data.id || "";
    this.form.patchValue({ id: this.id });

    if (this.id !== "") this.onLoadData();
    this.onLoadSelectItem();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Inspections.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);

        this.weeklyDays.clear();
        // Reset days form
        this.daysForm.reset();

        if (result.frequency === "weekly" && result.weeklyDays?.length) {
          // Populate FormArray
          result.weeklyDays.forEach((day: number) => {
            this.weeklyDays.push(new FormControl(day));
            // Populate Checkboxes
            const dayObj = this.weekDays.find((d) => d.value === day);
            if (dayObj) {
              this.daysForm.controls[dayObj.key].setValue(true, {
                emitEvent: false,
              });
            }
          });
        }

        this.onValidateFrequency(result.frequency);
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
