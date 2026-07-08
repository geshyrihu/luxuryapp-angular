import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { PasswordModule } from "primeng/password";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-password",

  imports: [BaseInputSignal, ReactiveFormsModule, PasswordModule],
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
      <p-password
        [inputId]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
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
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputPassword),
      multi: true,
    },
  ],
})
export class WebInputPassword extends BaseInputSignal {
  customClass = input<string>("");
  showStrengthIndicator = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);

  promptLabel = input<string>("Ingresa una contraseña");
  weakLabel = input<string>("Débil");
  mediumLabel = input<string>("Media");
  strongLabel = input<string>("Fuerte");

  inputStyleClass = computed(() => {
    let classes = this.customClass();
    if (this.size() === "small") classes += " p-inputtext-sm";
    if (this.size() === "large") classes += " p-inputtext-lg";
    return classes.trim();
  });
}
