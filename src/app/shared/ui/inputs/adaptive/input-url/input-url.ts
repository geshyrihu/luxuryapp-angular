import { Component, forwardRef, inject, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { WebInputUrl } from "../../web/input-url/input-url";
import { IonInputUrl } from "../../mobile/ion-input-url";

@Component({
  selector: "custom-input-url",
  standalone: true,
  imports: [WebInputUrl, IonInputUrl],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputUrl), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-url
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-url
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
export class InputUrl extends BaseInputSignal {
  protected platform = inject(PlatformService);
}
