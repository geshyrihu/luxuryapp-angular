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
import { IonInputTextarea } from "../../mobile/ion-input-textarea";
import { WebInputTextarea } from "../../web/input-textarea/input-textarea";

/**
 * 🔀 INPUT TEXTAREA — adaptativo. `<custom-input-textarea-signal>` →
 * web `<web-input-textarea>` (PrimeNG) o móvil `<ion-input-textarea>` (Ionic).
 */
@Component({
  selector: "custom-input-textarea-signal",

  imports: [WebInputTextarea, IonInputTextarea],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextarea),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  template: `
    @if (platform.isMobile()) {
      <ion-input-textarea
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [rows]="rows()"
        [maxLength]="maxLength()"
      />
    } @else {
      <web-input-textarea
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [description]="description()"
        [hidden]="hidden()"
        [onlyInput]="onlyInput()"
        [noMargin]="noMargin()"
        [rows]="rows()"
        [cols]="cols()"
        [maxLength]="maxLength()"
        [disableResize]="disableResize()"
        [customClass]="customClass()"
        [fluid]="fluid()"
      />
    }
  `,
})
export class InputTextarea extends BaseInputSignal {
  protected platform = inject(PlatformService);
  rows = input<number>(5);
  cols = input<number>(30);
  maxLength = input<number | undefined>(undefined);
  disableResize = input<boolean>(false);
  customClass = input<string>("");
  fluid = input<boolean>(true);
}
