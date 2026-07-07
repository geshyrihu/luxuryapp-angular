import { Component, forwardRef, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputPassword } from "../../mobile/ion-input-password";
import { WebInputPassword } from "../../web/input-password/input-password";

@Component({
  selector: "custom-input-password-signal",
  standalone: true,
  imports: [WebInputPassword, IonInputPassword],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPassword),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-password
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-password
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [customClass]="customClass()"
        [size]="size()"
        [showStrengthIndicator]="showStrengthIndicator()"
        [promptLabel]="promptLabel()"
        [weakLabel]="weakLabel()"
        [mediumLabel]="mediumLabel()"
        [strongLabel]="strongLabel()"
      />
    }
  `,
})
export class InputPassword extends BaseInputSignal {
  protected platform = inject(PlatformService);

  customClass = input<string>("");
  showStrengthIndicator = input<boolean>(false);
  size = input<"small" | "large" | undefined>(undefined);
  promptLabel = input<string>("Ingresa una contraseña");
  weakLabel = input<string>("Débil");
  mediumLabel = input<string>("Media");
  strongLabel = input<string>("Fuerte");
}
