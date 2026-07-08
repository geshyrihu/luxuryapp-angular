import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputNgSelect } from "../custom-input-ng-select-signal";

@Component({
  selector: "web-input-ng-select",

  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputNgSelect],
  template: `
    <custom-input-ng-select
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
      [options]="options()"
      [bindLabel]="bindLabel()"
      [bindValue]="bindValue()"
      [searchable]="searchable()"
      [clearable]="clearable()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputNgSelect),
      multi: true,
    },
  ],
})
export class WebInputNgSelect extends BaseInputSignal {
  options = input<any[]>([]);
  bindLabel = input<string>("label");
  bindValue = input<string>("value");
  searchable = input<boolean>(true);
  clearable = input<boolean>(true);
  multiple = input<boolean>(false);
}
