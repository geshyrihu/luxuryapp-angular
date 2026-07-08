import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputPhonePrefix } from "../custom-input-phone-prefix";
import { BaseInputSignal } from "../../base/base-input-signal";
import { PhonePrefix } from "src/app/core/data/phone-prefixes.data";

@Component({
  selector: "web-input-phone-prefix",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputPhonePrefix],
  template: `
    <custom-input-phone-prefix
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputPhonePrefix),
      multi: true,
    },
  ],
})
export class WebInputPhonePrefix extends BaseInputSignal {
  prefixList = input<PhonePrefix[]>([]);
  countryCode = input<string>("");
}
