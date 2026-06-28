import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { TextareaModule } from "primeng/textarea";
import { BaseInputSignal } from "../../inputs/base/base-input-signal";

@Component({
  selector: "custom-input-textarea-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, TextareaModule, FloatLabelModule],
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
      <p-floatlabel variant="on" class="w-full">
        <textarea
          pTextarea
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="' '"
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
        @if (label()) {
          <label [for]="id()">
            {{ label() }}
            @if (isRequired()) { <span style="color:var(--ds-danger)"> *</span> }
          </label>
        }
      </p-floatlabel>
    </base-input-signal>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomInputTextAreaSignal),
    multi: true,
  }],
})
export class CustomInputTextAreaSignal extends BaseInputSignal {
  rows = input<number>(5);
  cols = input<number>(30);
  maxLength = input<number | undefined>(undefined);
  disableResize = input<boolean>(false);
  customClass = input<string>("");
  fluid = input<boolean>(true);
}

