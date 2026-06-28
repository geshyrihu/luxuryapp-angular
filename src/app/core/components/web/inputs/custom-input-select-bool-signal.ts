import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { SelectModule } from "primeng/select";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-select-signal-bool",
  imports: [BaseInputSignal, ReactiveFormsModule, SelectModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <p-select
          [inputId]="id()"
          [options]="boolOptions()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder() || ' '"
          optionLabel="label"
          optionValue="value"
          [showClear]="showClear()"
          [readonly]="readonly()"
          [class]="getInputStyleClass()"
          fluid
          appendTo="body"
        />
        @if (label()) {
          <label [for]="id()">
            {{ label() }}
            @if (isRequired()) { <span style="color:var(--ds-danger)"> *</span> }
          </label>
        }
      </p-floatlabel>
    </base-input-signal>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputSelectBool),
    multi: true,
  }],
})
export class CustomInputSelectBool extends BaseInputSignal {
  activeLabel = input<string>("Activo");
  inactiveLabel = input<string>("Inactivo");
  showClear = input<boolean>(true);
  size = input<"small" | "large" | undefined>(undefined);
  customClass = input<string>("");
  boolOptions = computed(() => [
    { value: true, label: this.activeLabel() },
    { value: false, label: this.inactiveLabel() },
  ]);
  getInputStyleClass = computed(() => {
    const s = this.size() ?? this.mobileSize();
    if (s === "small") return "p-inputtext-sm";
    if (s === "large") return "p-inputtext-lg";
    return this.customClass();
  });
}

