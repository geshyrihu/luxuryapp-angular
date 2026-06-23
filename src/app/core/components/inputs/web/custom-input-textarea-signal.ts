import { Component, forwardRef, inject, input } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonTextarea } from "@ionic/angular/standalone";
import { TextareaModule } from "primeng/textarea";
import { BaseInputSignal } from "../base/base-input-signal";

@Component({
  selector: "custom-input-textarea-signal",
  imports: [BaseInputSignal, ReactiveFormsModule, TextareaModule, IonTextarea],
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
      @if (platform.isMobile()) {
        <ion-textarea
          [id]="id()"
          [formControl]="control() || internalControl"
          [placeholder]="placeholder()"
          [readonly]="readonly()"
          [rows]="rows()"
          [maxlength]="maxLength()"
          [autoGrow]="!disableResize()"
        />
      } @else {
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
      }
    </base-input-signal>
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
