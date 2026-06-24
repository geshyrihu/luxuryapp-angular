import { Component, forwardRef, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { TextareaModule } from "primeng/textarea";
import { BaseInputSignal } from "../base/base-input-signal";
import { IonInputTextarea } from "../mobile/ion-input-textarea";

@Component({
  selector: "custom-input-textarea-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, TextareaModule, IonInputTextarea],
  template: `
    @if (platform.isMobile()) {
      <ion-input-textarea
        [control]="control()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [rows]="rows()"
        [customClass]="customClass()"
      />
    } @else {
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
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputTextAreaSignal),
      multi: true,
    },
  ],
})
export class CustomInputTextAreaSignal extends BaseInputSignal {

  rows = input<number>(5);
  cols = input<number>(30);
  maxLength = input<number | undefined>(undefined);
  disableResize = input<boolean>(false);
  customClass = input<string>("");
  fluid = input<boolean>(true);
}
