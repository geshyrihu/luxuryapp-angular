import { Component, forwardRef, inject, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { WebInputMonth } from "../../web/input-month/input-month";
import { IonInputMonth } from "../../mobile/ion-input-month";

@Component({
  selector: "custom-input-month",
  standalone: true,
  imports: [WebInputMonth, IonInputMonth],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputMonth), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-month
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-month
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
      />
    }
  `,
})
export class InputMonth extends BaseInputSignal {
  protected platform = inject(PlatformService);
}
