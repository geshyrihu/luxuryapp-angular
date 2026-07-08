import { Component, forwardRef, inject, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { WebInputPhonePrefix } from "../../web/input-phone-prefix/input-phone-prefix";
import { IonInputPhonePrefix } from "../../mobile/ion-input-phone-prefix";

@Component({
  selector: "custom-input-phone-prefix",
  standalone: true,
  imports: [WebInputPhonePrefix, IonInputPhonePrefix],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputPhonePrefix), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-phone-prefix
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [prefixes]="prefixList()"
        [selectedPrefix]="countryCode()"
      />
    } @else {
      <web-input-phone-prefix
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
        [prefixList]="prefixList()"
        [countryCode]="countryCode()"
      />
    }
  `,
})
export class InputPhonePrefix extends BaseInputSignal {
  protected platform = inject(PlatformService);
  prefixList = input<any[]>([]);
  countryCode = input<string>("+52");
}
