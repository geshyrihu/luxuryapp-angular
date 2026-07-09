import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ListboxBase } from "@ui/base/listbox.base";
import { ListboxModule } from "primeng/listbox";

@Component({
  selector: "app-listbox",

  imports: [ListboxModule, FormsModule],
  template: `<p-listbox
    [ngModel]="value()"
    (ngModelChange)="value.set($event)"
    [options]="options()"
    [optionLabel]="optionLabel()"
    [optionValue]="optionValue()"
    [multiple]="multiple()"
    [checkbox]="checkbox()"
    [filter]="filter()"
    [style]="style()"
    [listStyle]="listStyle()"
    [emptyFilterMessage]="emptyFilterMessage()"
    [group]="group()"
    [optionGroupLabel]="optionGroupLabel()"
    [optionGroupChildren]="optionGroupChildren()"
    [metaKeySelection]="metaKeySelection()"
    [class]="styleClass()"
    ><ng-content
  /></p-listbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppListbox extends ListboxBase {}
