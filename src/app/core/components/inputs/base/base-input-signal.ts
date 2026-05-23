import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  HostBinding,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { ValidationErrorsCustomInput } from "./validation-errors-custom-input";

/**
 * 🧱 BASE INPUT SIGNAL - El cimiento de tus formularios (Web/PrimeNG)
 * -------------------------------------------------------------------------
 * Componente base para inputs reactivos PrimeNG.
 * Layout con label, field-content y errores de validación.
 * Para inputs Ionic usar: BaseIonicInput
 */
@Component({
  selector: "base-input-signal",
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ValidationErrorsCustomInput,
  ],
  template: `
    @if (!hidden()) {
      @if (onlyInput()) {
        <div class="fluid">
          <ng-content></ng-content>
        </div>
      } @else {
        <div class="field" [class.field-horizontal]="horizontal()" [class.mb-0]="noMargin()">
          @if (label()) {
            <label [for]="id()" class="field-label">
              {{ label() }}
              @if (isRequired()) {
                <span class="text-red-400">*</span>
              }
            </label>
          }
          <div class="field-content">
            <ng-content></ng-content>
            @if (description()) {
            <small class="block mt-1 text-500 line-height-2 italic px-1">
              <i class="pi pi-info-circle mr-1 text-xs"></i>
              {{ description() }}
            </small>
            }
            <app-validation-errors-custom-input
              [control]="control() || internalControl"
              [placeholder]="placeholder() || label()"
            />
          </div>
        </div>
      }
    }
  `,
  styles: [
    `
      .field {
        margin-bottom: 1rem;
      }
      .field.mb-0 {
        margin-bottom: 0 !important;
      }
      .field-horizontal {
        display: grid;
        grid-template-columns: 1fr 3fr;
        gap: 1rem;
        align-items: start;
      }
      .field-label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
      }
      .field-horizontal .field-label {
        margin-bottom: 0;
        padding-top: 0.5rem;
      }
      .field-content {
        width: 100%;
      }
      .fluid {
        width: 100%;
      }
      @media (max-width: 768px) {
        .field-horizontal {
          grid-template-columns: 1fr;
        }
      }
    `,
  ],
})
export class BaseInputSignal implements ControlValueAccessor, OnInit {
  control = input<AbstractControl | any>();
  id = input<string>(`input-${Math.random().toString(36).substring(2, 9)}`);
  label = input<string | null>("");
  placeholder = input<string>("");
  horizontal = input<boolean>(true);
  readonly = input<boolean>(false);
  disabled = input<boolean>(false);
  hidden = input<boolean>(false);
  requiredInput = input<boolean>(false, { alias: "required" });
  onlyInput = input<boolean>(false);
  noMargin = input<boolean>(false);
  description = input<string>("");

  @HostBinding("style.display") get display() {
    return this.hidden() ? "none" : null;
  }

  internalControl: FormControl = new FormControl();

  constructor() {
    effect(() => {
      const isDisabled = this.disabled();
      const ctrl = this.control() || this.internalControl;
      if (ctrl) {
        if (isDisabled) {
          ctrl.disable({ emitEvent: false });
        } else {
          ctrl.enable({ emitEvent: false });
        }
      }
    });
  }

  private readonly destroyRef = inject(DestroyRef);

  isRequired = computed(() => {
    if (this.requiredInput()) return true;
    const ctrl = this.control() || this.internalControl;
    if (ctrl && ctrl.validator) {
      const validator = ctrl.validator({} as AbstractControl);
      return !!(validator && validator["required"]);
    }
    return false;
  });

  isInvalid(): boolean {
    const ctrl = this.control() || this.internalControl;
    return ctrl ? ctrl.invalid && (ctrl.dirty || ctrl.touched) : false;
  }

  ngOnInit(): void {
    if (!this.control()) {
      this.internalControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this.onChange(value);
        });
    }
  }

  onChange: (value: any) => void = () => {};
  onTouch: () => void = () => {};

  writeValue(value: any): void {
    const ctrl = this.control() || this.internalControl;
    if (ctrl && ctrl.value !== value) {
      ctrl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.internalControl.disable();
    } else {
      this.internalControl.enable();
    }
  }
}
