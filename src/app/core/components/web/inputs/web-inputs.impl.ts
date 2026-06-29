import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  output,
  signal,
} from "@angular/core";
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Select } from "primeng/select";
import { PlatformService } from "src/app/core/services/platform.service";
import { IonInputCheckbox } from "../../mobile/inputs/ion-input-checkbox";
import { IonInputCurrency } from "../../mobile/inputs/ion-input-currency";
import { IonInputDate } from "../../mobile/inputs/ion-input-date";
import { IonInputFile } from "../../mobile/inputs/ion-input-file";
import { IonInputMultiselect } from "../../mobile/inputs/ion-input-multiselect";
import { IonInputNumber } from "../../mobile/inputs/ion-input-number";
import { IonInputPassword } from "../../mobile/inputs/ion-input-password";
import { IonInputSearch } from "../../mobile/inputs/ion-input-search";
import { IonInputSelect } from "../../mobile/inputs/ion-input-select";
import { IonInputSelectBool } from "../../mobile/inputs/ion-input-select-bool";
import { IonInputText } from "../../mobile/inputs/ion-input-text";
import { IonInputTextarea } from "../../mobile/inputs/ion-input-textarea";
import { IonInputTime } from "../../mobile/inputs/ion-input-time";
import { IonInputToggle } from "../../mobile/inputs/ion-input-toggle";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { BaseInputSignal } from "../../shared/inputs/base/base-input-signal";

@Component({ template: "" })
abstract class BaseWebInput
  extends BaseInputSignal
  implements ControlValueAccessor
{
  protected readonly platform = inject(PlatformService);
  customClass = input<string>("");
  size = input<"small" | "large" | undefined>(undefined);
  fluid = input<boolean>(true);

  inputClasses = computed(() => {
    const classes = [
      "w-full",
      "border-1",
      "surface-border",
      "border-round-md",
      "px-3",
      "py-2",
      "text-color",
      "bg-white",
    ];
    if (this.size() === "small") classes.push("text-sm", "py-2");
    if (this.size() === "large") classes.push("text-lg", "py-3");
    if (this.customClass()) classes.push(this.customClass());
    return classes.join(" ");
  });
}

@Component({ template: "" })
abstract class BaseChoiceInput extends BaseWebInput {
  data = input<any[]>([]);
  options = input<any[]>([]);
  optionLabel = input<string>("label");
  optionValue = input<string>("value");
  filter = input<boolean>(false);
  showClear = input<boolean>(false);
  placeholderSearch = input<string>("");
  loading = input<boolean>(false);

  sourceItems = computed(() =>
    this.data().length ? this.data() : this.options(),
  );

  trackValue(item: any): any {
    return item?.[this.optionValue()] ?? item;
  }

  itemLabel(item: any): string {
    return String(item?.[this.optionLabel()] ?? item ?? "");
  }

  itemValue(item: any): any {
    return item?.[this.optionValue()] ?? item;
  }
}

function provideValueAccessor(type: any) {
  return [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => type),
      multi: true,
    },
  ];
}

@Component({
  selector: "custom-input-text-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputText],
  template: `
    @if (platform.isMobile()) {
      <ion-input-text
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [hidden]="hidden()"
        [description]="description()"
        [onlyInput]="onlyInput()"
        [customClass]="customClass()"
        [type]="type()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [hidden]="hidden()"
        [description]="description()"
        [onlyInput]="onlyInput()"
        [hostClass]="customClass()"
      >
        <input
          [type]="type()"
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [readOnly]="readonly()"
          [class]="inputClasses()"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputTextSignal),
})
export class CustomInputTextSignal extends BaseWebInput {
  type = input<string>("text");
}

@Component({
  selector: "custom-input-password-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputPassword,
    AppIcon,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-password
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [hidden]="hidden()"
        [description]="description()"
        [onlyInput]="onlyInput()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [hidden]="hidden()"
        [description]="description()"
        [onlyInput]="onlyInput()"
        [hostClass]="customClass()"
      >
        <div class="relative">
          <input
            [type]="showPassword() ? 'text' : 'password'"
            [id]="id()"
            [formControl]="control() || internalControl"
            [placeholder]="placeholder()"
            [readOnly]="readonly()"
            [class]="inputClasses()"
          />
          <button
            type="button"
            class="absolute right-0 top-0 h-full px-3 border-none bg-transparent text-500"
            (click)="showPassword.set(!showPassword())"
          >
            <app-icon
              [icon]="
                showPassword() ? 'mdi:eye-off-outline' : 'mdi:eye-outline'
              "
            />
          </button>
        </div>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputPassword),
})
export class CustomInputPassword extends BaseWebInput {
  showPassword = signal(false);
  showStrengthIndicator = input<boolean>(false);
}

@Component({
  selector: "custom-input-number-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputNumber],
  template: `
    @if (platform.isMobile()) {
      <ion-input-number
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hidden]="hidden()"
        [description]="description()"
        [onlyInput]="onlyInput()"
        [hostClass]="customClass()"
      >
        <input
          type="number"
          inputmode="decimal"
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [min]="min()"
          [max]="max()"
          [step]="step()"
          [class]="inputClasses()"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputNumberSignal),
})
export class CustomInputNumberSignal extends BaseWebInput {
  min = input<number | undefined>(undefined);
  max = input<number | undefined>(undefined);
  step = input<number>(1);
  showButtons = input<boolean>(false);
  useGrouping = input<boolean>(true);
  minFractionDigits = input<number | undefined>(undefined);
  maxFractionDigits = input<number | undefined>(undefined);
}

@Component({
  selector: "custom-input-decimal-signal",
  standalone: true,
  imports: [CustomInputNumberSignal],
  template: `<custom-input-number-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [min]="min()"
    [max]="max()"
    [step]="step()"
    [customClass]="customClass()"
  />`,
  providers: provideValueAccessor(CustomInputDecimal),
})
export class CustomInputDecimal extends CustomInputNumberSignal {
  override step = input<number>(0.01);
}

@Component({
  selector: "custom-input-currency-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputCurrency,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-currency
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [prefix]="prefix()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <div class="flex align-items-center gap-2">
          <span class="text-600 font-medium">{{ prefix() }}</span>
          <input
            type="number"
            step="0.01"
            inputmode="decimal"
            [id]="id()"
            [formControl]="control() || internalControl"
            [placeholder]="placeholder()"
            [class]="inputClasses()"
          />
        </div>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputCurrencySignal),
})
export class CustomInputCurrencySignal extends BaseWebInput {
  prefix = input<string>("$");
  useGrouping = input<boolean>(true);
  minFractionDigits = input<number | undefined>(undefined);
  maxFractionDigits = input<number | undefined>(undefined);
}

@Component({
  selector: "custom-input-date-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputDate],
  template: `
    @if (platform.isMobile()) {
      <ion-input-date
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <input
          type="date"
          [id]="id()"
          [formControl]="control() || internalControl"
          [class]="inputClasses()"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputDateSignal),
})
export class CustomInputDateSignal extends BaseWebInput {
  mode = input<"single" | "multiple" | "range">("single");
  disable = input<any[] | null | undefined>(undefined);
}

@Component({
  selector: "custom-input-time-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputTime],
  template: `
    @if (platform.isMobile()) {
      <ion-input-time
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <input
          type="time"
          [id]="id()"
          [formControl]="control() || internalControl"
          [class]="inputClasses()"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputTime),
})
export class CustomInputTime extends BaseWebInput {}

@Component({
  selector: "custom-input-hour-signal",
  standalone: true,
  imports: [CustomInputTime],
  template: `<custom-input-time-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [customClass]="customClass()"
  />`,
  providers: provideValueAccessor(CustomInputHour),
})
export class CustomInputHour extends CustomInputTime {}

@Component({
  selector: "custom-input-month-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [required]="requiredInput()"
      [hostClass]="customClass()"
    >
      <input
        type="month"
        [id]="id()"
        [formControl]="control() || internalControl"
        [class]="inputClasses()"
      />
    </base-input-signal>
  `,
  providers: provideValueAccessor(CustomInputMonth),
})
export class CustomInputMonth extends BaseWebInput {}

@Component({
  selector: "custom-input-date-time-native",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [required]="requiredInput()"
      [hostClass]="customClass()"
    >
      <input
        type="datetime-local"
        [id]="id()"
        [formControl]="control() || internalControl"
        [class]="inputClasses()"
      />
    </base-input-signal>
  `,
  providers: provideValueAccessor(CustomInputDateTimeNative),
})
export class CustomInputDateTimeNative extends BaseWebInput {}

@Component({
  selector: "custom-input-date-time-signal",
  standalone: true,
  imports: [CustomInputDateTimeNative],
  template: `<custom-input-date-time-native
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [required]="requiredInput()"
    [customClass]="customClass()"
  />`,
  providers: provideValueAccessor(CustomInputDateTimeSignal),
})
export class CustomInputDateTimeSignal extends CustomInputDateTimeNative {}

@Component({
  selector: "custom-input-textarea-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputTextarea,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-textarea
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [rows]="rows()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <textarea
          [id]="id()"
          [rows]="numericRows()"
          [maxlength]="maxLength()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [class]="inputClasses()"
        ></textarea>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputTextAreaSignal),
})
export class CustomInputTextAreaSignal extends BaseWebInput {
  rows = input<number | string>(3);
  maxLength = input<number | undefined>(undefined);

  numericRows = computed(() => Number(this.rows() || 3));
}

@Component({
  selector: "custom-input-select-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputSelect,
    Select,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-select
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [data]="sourceItems()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [customClass]="customClass()"
        (selectionChange)="emitSelection($event)"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <p-select
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [options]="sourceItems()"
          [optionLabel]="optionLabel()"
          [optionValue]="optionValue()"
          [placeholder]="placeholder() || 'Selecciona una opcion'"
          [filter]="filter()"
          [filterBy]="resolvedFilterBy()"
          [filterPlaceholder]="resolvedFilterPlaceholder()"
          [showClear]="showClear()"
          [loading]="loading()"
          [readonly]="readonly()"
          [fluid]="fluid()"
          [size]="size()"
          styleClass="w-full"
          (onChange)="emitSelection($event)"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputSelectSignal),
})
export class CustomInputSelectSignal extends BaseChoiceInput {
  selectionChange = output<any>();
  filterBy = input<string>("");

  protected resolvedFilterBy = computed(
    () => this.filterBy() || this.optionLabel(),
  );
  protected resolvedFilterPlaceholder = computed(
    () => this.placeholderSearch() || "Buscar...",
  );

  protected emitSelection(event: any): void {
    this.selectionChange.emit(
      event?.detail?.value ? { value: event.detail.value } : event,
    );
  }
}

@Component({
  selector: "custom-input-ng-select-signal",
  standalone: true,
  imports: [CustomInputSelectSignal],
  template: `<custom-input-select-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [data]="sourceItems()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [filter]="filter()"
    [filterBy]="filterBy()"
    [showClear]="showClear()"
    [placeholderSearch]="placeholderSearch()"
    [loading]="loading()"
    [customClass]="customClass()"
    (selectionChange)="selectionChange.emit($event)"
  />`,
  providers: provideValueAccessor(CustomInputNgSelect),
})
export class CustomInputNgSelect extends CustomInputSelectSignal {}

@Component({
  selector: "custom-input-select-prefix-signal",
  standalone: true,
  imports: [CustomInputSelectSignal],
  template: `<custom-input-select-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [data]="sourceItems()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [filter]="filter()"
    [filterBy]="filterBy()"
    [showClear]="showClear()"
    [placeholderSearch]="placeholderSearch()"
    [loading]="loading()"
    [customClass]="customClass()"
    (selectionChange)="selectionChange.emit($event)"
  />`,
  providers: provideValueAccessor(CustomInputSelectPrefix),
})
export class CustomInputSelectPrefix extends CustomInputSelectSignal {}

@Component({
  selector: "custom-input-multiselect-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputMultiselect,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-multiselect
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [options]="sourceItems()"
        [optionLabel]="optionLabel()"
        [optionValue]="optionValue()"
        [customClass]="customClass()"
        (selectionChange)="selectionChange.emit({ value: $event })"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <select
          multiple
          [id]="id()"
          [formControl]="control() || internalControl"
          [class]="inputClasses()"
          (change)="
            selectionChange.emit({
              value: control()?.value ?? internalControl.value,
            })
          "
        >
          @for (item of sourceItems(); track trackValue(item)) {
            <option [value]="itemValue(item)">{{ itemLabel(item) }}</option>
          }
        </select>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputMultiselectSignal),
})
export class CustomInputMultiselectSignal extends BaseChoiceInput {
  selectionChange = output<any>();
}

@Component({
  selector: "custom-input-select-bool-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputSelectBool,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-select-bool
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [activeLabel]="activeLabel()"
        [inactiveLabel]="inactiveLabel()"
        [customClass]="customClass()"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <select
          [id]="id()"
          [formControl]="control() || internalControl"
          [class]="inputClasses()"
        >
          <option [ngValue]="true">{{ activeLabel() }}</option>
          <option [ngValue]="false">{{ inactiveLabel() }}</option>
        </select>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputSelectBool),
})
export class CustomInputSelectBool extends BaseWebInput {
  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
}

@Component({
  selector: "custom-input-check-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputCheckbox,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-checkbox
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [customClass]="customClass()"
        (checkChange)="checkChange.emit($event)"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <label class="flex align-items-center gap-2">
          <input
            type="checkbox"
            [id]="id()"
            [formControl]="control() || internalControl"
            (change)="checkChange.emit($any($event.target).checked)"
          />
          <span>{{ placeholder() }}</span>
        </label>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputCheckSignal),
})
export class CustomInputCheckSignal extends BaseWebInput {
  checkChange = output<boolean>();
}

@Component({
  selector: "custom-input-switch-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputToggle],
  template: `
    @if (platform.isMobile()) {
      <ion-input-toggle
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [customClass]="customClass()"
        (toggleChange)="toggleChange.emit($event)"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <label class="flex align-items-center gap-2">
          <input
            type="checkbox"
            [id]="id()"
            [formControl]="control() || internalControl"
            (change)="toggleChange.emit($any($event.target).checked)"
          />
          <span>{{ placeholder() }}</span>
        </label>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputSwitch),
})
export class CustomInputSwitch extends BaseWebInput {
  toggleChange = output<boolean>();
}

@Component({
  selector: "custom-search-input-signal",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseInputSignal,
    IonInputSearch,
    AppIcon,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-search
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [required]="requiredInput()"
        [debounce]="debounce()"
        (searchChange)="searchChange.emit($event)"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [onlyInput]="true"
        [hostClass]="customClass()"
      >
        <div
          class="flex align-items-center gap-2 border-1 surface-border border-round-md px-3 py-2 bg-white"
        >
          <app-icon icon="mdi:magnify" />
          <input
            type="search"
            [id]="id()"
            [formControl]="control() || internalControl"
            [placeholder]="placeholder() || 'Buscar...'"
            class="w-full border-none outline-none"
            (input)="searchChange.emit($any($event.target).value)"
          />
        </div>
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomSearchInput),
})
export class CustomSearchInput extends BaseWebInput {
  debounce = input<number>(300);
  searchChange = output<any>();
}

@Component({
  selector: "custom-input-file-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, IonInputFile],
  template: `
    @if (platform.isMobile()) {
      <ion-input-file
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [accept]="accept()"
        [chooseLabel]="chooseLabel()"
        [customClass]="customClass()"
        (fileSelected)="fileSelected.emit($event)"
        (uploadError)="uploadError.emit($event)"
      />
    } @else {
      <base-input-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [required]="requiredInput()"
        [hostClass]="customClass()"
      >
        <input
          type="file"
          [id]="id()"
          [accept]="accept()"
          [class]="inputClasses()"
          (change)="onFileSelected($event)"
        />
      </base-input-signal>
    }
  `,
  providers: provideValueAccessor(CustomInputFile),
})
export class CustomInputFile extends BaseWebInput {
  accept = input<string>("");
  chooseLabel = input<string>("Seleccionar archivo");
  maxFileSize = input<number>(10_000_000);
  fileSelected = output<File | null>();
  uploadError = output<any>();

  protected onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    if (file && file.size > this.maxFileSize()) {
      this.uploadError.emit({ message: "Archivo demasiado grande." });
      return;
    }
    this.fileSelected.emit(file);
    (this.control() || this.internalControl).setValue(file);
  }
}

@Component({
  selector: "custom-input-img-signal",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="flex flex-column gap-3">
      @if (label()) {
        <label class="block text-sm font-semibold text-700">{{
          label()
        }}</label>
      }
      <div
        class="border-1 surface-border border-round-xl p-3 flex flex-column align-items-center gap-3"
      >
        <div
          class="border-round-xl overflow-hidden surface-100 flex align-items-center justify-content-center"
          [style.width]="contentWidth()"
          [style.height]="contentHeight()"
        >
          @if (previewUrl()) {
            <img
              [src]="previewUrl()"
              alt="preview"
              class="w-full h-full object-cover"
            />
          } @else {
            <app-icon icon="mdi:image-outline" class="text-5xl text-400" />
          }
        </div>
        <input
          type="file"
          accept="image/*"
          (change)="onImageSelected($event)"
        />
      </div>
    </div>
  `,
})
export class CustomInputImg {
  control = input<FormControl<any> | null>(null);
  label = input<string>("");
  urlImgCurrent = input<string | null | undefined>(undefined);
  horizontal = input<boolean>(false);
  contentHeight = input<string | number>("12rem");
  contentWidth = input<string | number>("12rem");
  requiredInput = input<boolean>(false, { alias: "required" });
  fileSelected = output<File | null>();
  previewUrl = signal<string | null>(null);

  constructor() {
    effect(() => this.previewUrl.set(this.urlImgCurrent() ?? null));
  }

  protected onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.fileSelected.emit(file);
    this.control()?.setValue(file);
    if (file) {
      this.previewUrl.set(URL.createObjectURL(file));
    }
  }
}

@Component({
  selector: "custom-input-mask-signal",
  standalone: true,
  imports: [CustomInputTextSignal],
  template: `
    <custom-input-text-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [required]="requiredInput()"
      [customClass]="customClass()"
      [type]="type()"
    />
  `,
  providers: provideValueAccessor(CustomInputMaskSignal),
})
export class CustomInputMaskSignal extends CustomInputTextSignal {
  customMask = input<string>("");
  validation = input<boolean>(true);
  dropSpecialCharacters = input<boolean>(true);
}

@Component({
  selector: "custom-input-phone-prefix",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [hostClass]="customClass()"
    >
      <select
        [id]="id()"
        [formControl]="control() || internalControl"
        [class]="inputClasses()"
      >
        @for (item of prefixes(); track item.value) {
          <option [value]="item.value">{{ item.label }}</option>
        }
      </select>
    </base-input-signal>
  `,
  providers: provideValueAccessor(CustomInputPhonePrefix),
})
export class CustomInputPhonePrefix extends BaseWebInput {
  prefixes = input<{ label: string; value: string }[]>([
    { label: "+52", value: "+52" },
    { label: "+1", value: "+1" },
    { label: "+34", value: "+34" },
  ]);
}

@Component({
  selector: "custom-input-url-signal",
  standalone: true,
  imports: [CustomInputTextSignal],
  template: `<custom-input-text-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [customClass]="customClass()"
    type="url"
  />`,
  providers: provideValueAccessor(CustomInputUrl),
})
export class CustomInputUrl extends CustomInputTextSignal {}

@Component({
  selector: "custom-input-autocomplete-signal",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, BaseInputSignal, AppIcon],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [required]="requiredInput()"
      [hostClass]="customClass()"
    >
      <input
        [attr.list]="listId()"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder() || 'Escribe para buscar'"
        [class]="inputClasses()"
        (change)="onAutocompleteChange($any($event.target).value)"
      />
      <datalist [id]="listId()">
        @for (item of sourceItems(); track trackValue(item)) {
          <option [value]="itemLabel(item)"></option>
        }
      </datalist>
    </base-input-signal>
  `,
  providers: provideValueAccessor(CustomInputAutoComplete),
})
export class CustomInputAutoComplete extends BaseChoiceInput {
  propagar = output<any>();

  listId = computed(() => `${this.id() || "autocomplete"}-list`);

  protected onAutocompleteChange(value: string): void {
    const match =
      this.sourceItems().find((item) => this.itemLabel(item) === value) ??
      value;
    this.propagar.emit(match);
  }
}

@Component({
  selector: "custom-input-remote-autocomplete-signal",
  standalone: true,
  imports: [CustomInputAutoComplete],
  template: `<custom-input-autocomplete-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [data]="sourceItems()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [customClass]="customClass()"
    (propagar)="propagar.emit($event)"
  />`,
  providers: provideValueAccessor(CustomInputRemoteAutocomplete),
})
export class CustomInputRemoteAutocomplete extends CustomInputAutoComplete {}

@Component({
  selector: "custom-input-autocomplete-multiple-signal",
  standalone: true,
  imports: [CustomInputMultiselectSignal],
  template: `<custom-input-multiselect-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [data]="sourceItems()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [customClass]="customClass()"
    (selectionChange)="propagar.emit($event.value)"
  />`,
  providers: provideValueAccessor(CustomInputAutoMultiple),
})
export class CustomInputAutoMultiple extends BaseChoiceInput {
  propagar = output<any>();
}

@Component({
  selector: "custom-input-transfer-list-signal",
  standalone: true,
  imports: [CustomInputMultiselectSignal],
  template: `<custom-input-multiselect-signal
    [control]="control()"
    [id]="id()"
    [label]="label()"
    [placeholder]="placeholder()"
    [required]="requiredInput()"
    [data]="sourceItems()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [customClass]="customClass()"
    (selectionChange)="selectionChange.emit($event)"
  />`,
  providers: provideValueAccessor(CustomInputTransferList),
})
export class CustomInputTransferList extends BaseChoiceInput {
  selectionChange = output<any>();
}

@Component({
  selector: "subir-pdf",
  standalone: true,
  imports: [CommonModule, CustomInputFile, AppIcon],
  template: `
    <div class="p-4 flex flex-column gap-4">
      <div>
        <h3 class="m-0 text-xl font-semibold">Cargar documento PDF</h3>
        @if (pathUrl()) {
          <small class="text-600">Destino: {{ pathUrl() }}</small>
        }
      </div>

      <custom-input-file-signal
        label="Documento"
        accept=".pdf,application/pdf"
        chooseLabel="Seleccionar PDF"
        (fileSelected)="selectedFile = $event"
      />

      @if (selectedFile) {
        <div
          class="surface-100 border-round-lg p-3 flex align-items-center gap-2"
        >
          <app-icon icon="mdi:file-pdf-box" />
          <span>{{ selectedFile.name }}</span>
        </div>
      }

      <div class="flex justify-content-end gap-2">
        <button
          type="button"
          class="btn btn-ghost-secondary btn-sm"
          (click)="close(false)"
        >
          Cancelar
        </button>
        <button
          type="button"
          class="btn btn-outline-success btn-sm"
          [disabled]="!selectedFile"
          (click)="close(true)"
        >
          Guardar
        </button>
      </div>
    </div>
  `,
})
export class SubirPdf {
  private readonly config = inject(DynamicDialogConfig, { optional: true });
  private readonly ref = inject(DynamicDialogRef, { optional: true });

  selectedFile: File | null = null;

  pathUrl = computed(() => this.config?.data?.pathUrl ?? "");

  close(saved: boolean): void {
    this.ref?.close(saved);
  }
}
