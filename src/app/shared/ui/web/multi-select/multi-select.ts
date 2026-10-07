import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultiSelectBase } from "@ui/core/multi-select.base";
import { LuxInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";

@Component({
  selector: "lux-multi-select-web",

  imports: [FormsModule, LuxInputMultiselectSignal],
  template: `
    <lux-input-multiselect-signal
      [options]="options() ?? []"
      [optionLabel]="optionLabel() ?? 'label'"
      [placeholder]="placeholder()"
      [ngModel]="ngModel()"
      (ngModelChange)="onModelChange($event)"
      [customClass]="styleClass()"
      [onlyInput]="true"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppMultiSelect extends MultiSelectBase {
  protected onModelChange(value: unknown): void {
    this.ngModel.set(value);
    this.onChange.emit({ value });
  }
}
