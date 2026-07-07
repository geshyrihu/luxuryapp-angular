import { Component, forwardRef, input, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TextareaModule } from "primeng/textarea";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * 📄 WEB INPUT TEXTAREA (PrimeNG) — interno del delegador `custom-input-textarea-signal`.
 */
@Component({
  selector: "web-input-textarea",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, TextareaModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [required]="requiredInput()"
      [description]="description()"
      [hidden]="hidden()"
    >
      <textarea
        pTextarea
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [rows]="rows()"
        [cols]="cols()"
        [maxlength]="maxLength()"
        [autoResize]="!disableResize()"
        [style]="{ resize: disableResize() ? 'none' : 'vertical' }"
        [class]="customClass()"
        [invalid]="isInvalid()"
        [fluid]="fluid()"
      ></textarea>
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputTextarea),
      multi: true,
    },
  ],
})
export class WebInputTextarea extends BaseInputSignal {
  rows = input<number>(5);
  cols = input<number>(30);
  maxLength = input<number | undefined>(undefined);
  disableResize = input<boolean>(false);
  customClass = input<string>("");
  fluid = input<boolean>(true);
}
