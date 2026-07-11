import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputSelectPrefix } from "../custom-input-select-prefix-signal";

@Component({
  selector: "web-input-select-prefix",

  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputSelectPrefix],
  template: `
    <web-custom-input-select-signal-prefix
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
      [data]="items()"
      (propagar)="propagar.emit($event)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputSelectPrefix),
      multi: true,
    },
  ],
})
export class WebInputSelectPrefix extends BaseInputSignal {
  items = input<any[]>([]);
  prefixField = input<string>("label");

  propagar = output<any>();
}
