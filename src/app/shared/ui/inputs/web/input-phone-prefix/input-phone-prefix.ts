import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { PhonePrefix } from "src/app/core/data/phone-prefixes.data";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputPhonePrefix } from "../custom-input-phone-prefix";

@Component({
  selector: "web-input-phone-prefix",

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
