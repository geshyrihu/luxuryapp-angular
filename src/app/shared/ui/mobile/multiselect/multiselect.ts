import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { MultiselectBase } from "@ui/base/multiselect.base";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "ili-multiselect",
  standalone: true,
  imports: [MultiSelectModule],
  template: `<p-multiSelect [options]="options()" [placeholder]="placeholder()" [optionLabel]="optionLabel()" [ngModel]="ngModel()" (ngModelChange)="ngModel.set($event)" (onChange)="onChange.emit($event)" [class]="styleClass()"><ng-content/></p-multiSelect>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileMultiselect extends MultiselectBase {}
