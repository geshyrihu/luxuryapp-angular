import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputCheckbox } from "../../mobile/ion-input-checkbox";
import { WebInputCheck } from "../../web/input-check/input-check";

/**
 * 🔀 INPUT CHECK — adaptativo. `<custom-input-check-signal>` →
 * web `<web-input-check>` (PrimeNG) o móvil `<ion-input-checkbox>` (Ionic).
 */
@Component({
  selector: "custom-input-check-signal",

  imports: [WebInputCheck, IonInputCheckbox],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheck),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-checkbox
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        (checkChange)="checkChange.emit($event)"
      />
    } @else {
      <web-input-check
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [description]="description()"
        [hidden]="hidden()"
        (checkChange)="checkChange.emit($event)"
      />
    }
  `,
})
export class InputCheck extends BaseInputSignal {
  protected platform = inject(PlatformService);
  checkChange = output<boolean>();
}
