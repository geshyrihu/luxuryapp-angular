import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MultiSelectBase } from "@ui/base/multi-select.base";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-multi-select",

  imports: [FormsModule, MultiSelectModule],
  template: `<p-multiselect
    [options]="options()"
    [placeholder]="placeholder()"
    [optionLabel]="optionLabel()"
    [ngModel]="ngModel()"
    (ngModelChange)="ngModel.set($event)"
    (onChange)="onChange.emit($event)"
    [class]="styleClass()"
    ><ng-content
  /></p-multiselect>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppMultiSelect extends MultiSelectBase {}
