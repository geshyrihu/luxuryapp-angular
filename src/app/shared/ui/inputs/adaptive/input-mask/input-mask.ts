import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputMask } from "../../mobile/ion-input-mask";
import { WebInputMask } from "../../web/input-mask/input-mask";

@Component({
  selector: "custom-input-mask-signal",

  imports: [WebInputMask, IonInputMask],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputMask),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-mask
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [customMask]="customMask()"
      />
    } @else {
      <web-input-mask
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
        [customMask]="customMask()"
        [validation]="validation()"
        [dropSpecialCharacters]="dropSpecialCharacters()"
        [size]="size()"
      />
    }
  `,
})
export class InputMask extends BaseInputSignal {
  protected platform = inject(PlatformService);
  customMask = input.required<string>();
  size = input<"small" | "large" | undefined>(undefined);
  validation = input<boolean>(true);
  dropSpecialCharacters = input<boolean>(true);
}
