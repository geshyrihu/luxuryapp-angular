import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";

/**
 * 📄 WEB INPUT TEXTAREA (PrimeNG) — interno del delegador `custom-input-textarea-signal`.
 */
@Component({
  selector: "web-input-textarea",

  imports: [CommonModule, BaseInputSignal, ReactiveFormsModule],
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
      [onlyInput]="onlyInput()"
      [noMargin]="noMargin()"
    >
      <textarea
        class="form-control"
        [id]="id()"
        [formControl]="control() || internalControl"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [rows]="rows()"
        [cols]="cols()"
        [maxlength]="maxLength()"
        [style]="{ resize: disableResize() ? 'none' : 'vertical' }"
        [ngClass]="customClass()"
      ></textarea>
    </base-input-signal>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
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
