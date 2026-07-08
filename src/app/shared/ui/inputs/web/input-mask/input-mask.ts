import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputMaskSignal } from "../custom-input-mask-signal";

@Component({
  selector: "web-input-mask",

  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputMaskSignal],
  template: `
    <custom-input-mask-signal
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
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputMask),
      multi: true,
    },
  ],
})
export class WebInputMask extends BaseInputSignal {
  customMask = input.required<string>();
  size = input<"small" | "large" | undefined>(undefined);
  validation = input<boolean>(true);
  dropSpecialCharacters = input<boolean>(true);
}
