import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputUrl } from "../custom-input-url-signal";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-url",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputUrl],
  template: `
    <custom-input-url
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
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputUrl),
      multi: true,
    },
  ],
})
export class WebInputUrl extends BaseInputSignal {
  customClass = input<string>("");
}
