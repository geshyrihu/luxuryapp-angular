import { Component, computed, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { PasswordModule } from "primeng/password";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-password-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, PasswordModule, FloatLabelModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <p-floatlabel variant="on" class="w-full">
        <p-password
          [inputId]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
          [feedback]="showStrengthIndicator()"
          [toggleMask]="true"
          [promptLabel]="promptLabel()"
          [weakLabel]="weakLabel()"
          [mediumLabel]="mediumLabel()"
          [strongLabel]="strongLabel()"
          [inputStyleClass]="inputStyleClass()"
          [invalid]="isInvalid()"
          fluid
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
    useExisting: forwardRef(() => CustomInputPassword),
    multi: true,
  }],
})
export class CustomInputPassword extends BaseInputSignal {
  customClass = input<string>("");
  showStrengthIndicator = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);
  promptLabel = input<string>("Ingresa una contraseña");
  weakLabel = input<string>("Débil");
  mediumLabel = input<string>("Media");
  strongLabel = input<string>("Fuerte");
  inputStyleClass = computed(() => {
    let classes = this.customClass();
    const s = this.size() ?? this.mobileSize();
    if (s === "small") classes += " p-inputtext-sm";
    if (s === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
