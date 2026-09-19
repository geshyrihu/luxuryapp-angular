import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-select-bool",

  imports: [BaseInputSignal, ReactiveFormsModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          [id]="id()"
          [formControl]="control() || internalControl"
          [disabled]="disabled()"
        />
        <label class="form-check-label" [for]="id()">{{ (control() || internalControl).value ? activeLabel() : inactiveLabel() }}</label>
      </div>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputSelectBool),
      multi: true,
    },
  ],
})
export class WebInputSelectBool extends BaseInputSignal {
  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);

  boolOptions = computed(() => [
    { value: true, label: this.activeLabel() },
    { value: false, label: this.inactiveLabel() },
  ]);

  getInputStyleClass = computed(() => {
    if (this.size() === "small") return "form-control-sm";
    if (this.size() === "large") return "form-control-lg";
    return "";
  });
}
