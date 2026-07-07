import { Component, forwardRef, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-time",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, InputTextModule],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
      [required]="requiredInput()"
    >
      <input
        [formControl]="control() || internalControl"
        pInputText
        fluid
        type="time"
        [id]="id()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        fluid
        appendTo="body"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputTime),
      multi: true,
    },
  ],
})
export class WebInputTime extends BaseInputSignal {}
