import { ChangeDetectionStrategy, Component, forwardRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-time",

  imports: [BaseInputSignal, ReactiveFormsModule],
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
        class="form-control"
        type="time"
        [id]="id()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        
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
