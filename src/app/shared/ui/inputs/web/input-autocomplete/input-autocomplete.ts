import { Component, forwardRef, input, output, ChangeDetectionStrategy } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { CustomInputAutoComplete } from "../custom-input-autocomplete-signal";
import { BaseInputSignal } from "../../base/base-input-signal";

@Component({
  selector: "web-input-autocomplete",
  standalone: true,
  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputAutoComplete],
  template: `
    <custom-input-autocomplete-signal
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
      [onlyInput]="onlyInput()"
      [forceSelection]="forceSelection()"
      [dropdown]="dropdown()"
      [data]="data()"
      [optionLabel]="field()"
      (propagar)="propagar.emit($event)"
      (completeMethod)="completeMethod.emit($event)"
      (cleared)="cleared.emit()"
    />
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputAutocomplete),
      multi: true,
    },
  ],
})
export class WebInputAutocomplete extends BaseInputSignal {
  data = input<any[]>([]);
  field = input<string>("label");
  forceSelection = input<boolean>(true);
  dropdown = input<boolean>(false);
  virtualScroll = input<boolean>(false);
  virtualScrollItemSize = input<number>(28);

  propagar = output<any>();
  completeMethod = output<any>();
  cleared = output<void>();
}
