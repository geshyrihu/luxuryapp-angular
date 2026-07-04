import { CommonModule } from "@angular/common";
import {
  Component,
  DestroyRef,
  OnInit,
  forwardRef,
  inject,
  input,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CheckboxModule } from "primeng/checkbox";
import { RadioButtonModule } from "primeng/radiobutton";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";


import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";

interface RecurrenceFrequency {
  label: string;
  value: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
}

// Definición estricta del formulario
interface IRecurrenceForm {
  frequency: FormControl<string | null>;
  interval: FormControl<number | null>;
  byDay: FormControl<string[] | null>;
  monthlyType: FormControl<string | null>;
  monthDay: FormControl<number | null>;
  monthPosition: FormControl<string | null>;
  monthWeekDay: FormControl<string | null>;
  yearMonth: FormControl<number | null>;
  yearDay: FormControl<number | null>;
}

@Component({
  selector: "app-recurrence-input",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CustomInputNumberSignal,
    CheckboxModule,
    RadioButtonModule,
    CustomInputSelectSignal,
  ],
  templateUrl: "./recurrence-input.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RecurrenceInput),
      multi: true,
    },
  ],
})
export class RecurrenceInput implements OnInit, ControlValueAccessor {
  label = input<string>("Regla de Recurrencia");

  // Uso de FormGroup Tipado
  public recurrenceForm: FormGroup<IRecurrenceForm>;
  private destroyRef = inject(DestroyRef);

  rrulePreview = signal<string>("");

  frequencies: RecurrenceFrequency[] = [
    { label: "Diaria", value: "DAILY" },
    { label: "Semanal", value: "WEEKLY" },
    { label: "Mensual", value: "MONTHLY" },
    { label: "Anual", value: "YEARLY" },
  ];

  frequencyLabels: { [key: string]: string } = {
    DAILY: "día(s)",
    WEEKLY: "semana(s)",
    MONTHLY: "mes(es)",
    YEARLY: "Año(s)",
  };

  weekDays: { label: string; value: string }[] = [
    { label: "Lun", value: "MO" },
    { label: "Mar", value: "TU" },
    { label: "Mió", value: "WE" },
    { label: "Jue", value: "TH" },
    { label: "Vie", value: "FR" },
    { label: "Sáb", value: "SA" },
    { label: "Dom", value: "SU" },
  ];

  monthlyTypes = [
    { label: "Día del mes", value: "dayOfMonth" },
    { label: "Día de la semana", value: "dayOfWeek" },
  ];

  positions = [
    { label: "Primer", value: "1" },
    { label: "Segundo", value: "2" },
    { label: "Tercer", value: "3" },
    { label: "Cuarto", value: "4" },
    { label: "óltimo", value: "-1" },
  ];

  monthNumbers = Array.from({ length: 31 }, (_, i) => ({
    label: `${i + 1}`,
    value: i + 1,
  }));

  months = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  onChange: any = () => {};
  onTouch: any = () => {};

  constructor() {
    this.recurrenceForm = new FormGroup<IRecurrenceForm>({
      frequency: new FormControl(null, Validators.required),
      interval: new FormControl(1, [Validators.required, Validators.min(1)]),
      byDay: new FormControl([]),
      monthlyType: new FormControl("dayOfMonth"),
      monthDay: new FormControl(1),
      monthPosition: new FormControl("1"),
      monthWeekDay: new FormControl("MO"),
      yearMonth: new FormControl(1),
      yearDay: new FormControl(1),
    });
  }

  ngOnInit(): void {
    this.recurrenceForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.generateRRule();
        this.onTouch();
      });
  }

  writeValue(rruleString: string): void {
    if (rruleString) {
      this.parseRRule(rruleString);
    } else {
      this.recurrenceForm.reset({
        frequency: null,
        interval: 1,
        byDay: [],
        monthlyType: "dayOfMonth",
        monthDay: 1,
        monthPosition: "1",
        monthWeekDay: "MO",
        yearMonth: 1,
        yearDay: 1,
      });
      this.rrulePreview.set("");
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.recurrenceForm.disable();
    } else {
      this.recurrenceForm.enable();
    }
  }

  onFrequencyChange(event: any): void {
    const selectedFrequency = event.value;
    if (selectedFrequency !== "WEEKLY") {
      this.recurrenceForm.controls.byDay.setValue([]);
    }
  }

  generateRRule(): void {
    // Usamos getRawValue() o accedemos a los controles, pero value es suficiente aquó
    const val = this.recurrenceForm.value;
    const frequency = val.frequency;

    if (!frequency) {
      this.onChange("");
      this.rrulePreview.set("");
      return;
    }

    let rrule = `FREQ=${frequency}`;

    if (val.interval && val.interval > 1) {
      rrule += `;INTERVAL=${val.interval}`;
    }

    switch (frequency) {
      case "WEEKLY":
        if (val.byDay && val.byDay.length > 0) {
          rrule += `;BYDAY=${val.byDay.join(",")}`;
        }
        break;

      case "MONTHLY":
        if (val.monthlyType === "dayOfMonth") {
          rrule += `;BYMONTHDAY=${val.monthDay}`;
        } else {
          rrule += `;BYDAY=${val.monthPosition}${val.monthWeekDay}`;
        }
        break;

      case "YEARLY":
        rrule += `;BYMONTH=${val.yearMonth};BYMONTHDAY=${val.yearDay}`;
        break;
    }

    this.rrulePreview.set(rrule);
    this.onChange(rrule);
  }

  parseRRule(rruleString: string): void {
    const parts = rruleString.split(";");
    const rrule: { [key: string]: string } = {};
    parts.forEach((part) => {
      const [key, value] = part.split("=");
      rrule[key] = value;
    });

    // Construimos el objeto Partial<IRecurrenceForm> (valores crudos)
    const formValue: any = {
      frequency: rrule["FREQ"] || null,
      interval: rrule["INTERVAL"] ? parseInt(rrule["INTERVAL"], 10) : 1,
      byDay: [],
      monthlyType: "dayOfMonth",
      monthDay: 1,
      monthPosition: "1",
      monthWeekDay: "MO",
      yearMonth: 1,
      yearDay: 1,
    };

    if (rrule["BYDAY"] && rrule["FREQ"] === "WEEKLY") {
      formValue.byDay = rrule["BYDAY"].split(",");
    }

    if (rrule["FREQ"] === "MONTHLY") {
      if (rrule["BYMONTHDAY"]) {
        formValue.monthlyType = "dayOfMonth";
        formValue.monthDay = parseInt(rrule["BYMONTHDAY"], 10);
      } else if (rrule["BYDAY"]) {
        formValue.monthlyType = "dayOfWeek";
        const byDayMatch = rrule["BYDAY"].match(/^(-?\d+)([A-Z]{2})$/);
        if (byDayMatch) {
          formValue.monthPosition = byDayMatch[1];
          formValue.monthWeekDay = byDayMatch[2];
        }
      }
    }

    if (rrule["FREQ"] === "YEARLY") {
      if (rrule["BYMONTH"]) {
        formValue.yearMonth = parseInt(rrule["BYMONTH"], 10);
      }
      if (rrule["BYMONTHDAY"]) {
        formValue.yearDay = parseInt(rrule["BYMONTHDAY"], 10);
      }
    }

    this.recurrenceForm.patchValue(formValue, { emitEvent: false });
    this.generateRRule();
  }

  // Getter tipado para usar en el template loop si es necesario,
  // aunque en el template usaremos recurrenceForm.controls.byDay
  getByDayControl(): FormControl<string[] | null> {
    return this.recurrenceForm.controls.byDay;
  }

  get selectedFrequency(): string | null {
    return this.recurrenceForm.controls.frequency.value;
  }

  get isWeekly(): boolean {
    return this.selectedFrequency === "WEEKLY";
  }

  get isMonthly(): boolean {
    return this.selectedFrequency === "MONTHLY";
  }

  get isYearly(): boolean {
    return this.selectedFrequency === "YEARLY";
  }

  get monthlyType(): string | null {
    return this.recurrenceForm.controls.monthlyType.value;
  }

  get currentFrequencyLabel(): string {
    const freq = this.recurrenceForm.controls.frequency.value;
    return freq ? this.frequencyLabels[freq] || "" : "";
  }
}
