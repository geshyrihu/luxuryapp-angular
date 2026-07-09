import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { ListboxBase } from "@ui/base/listbox.base";
import { ListboxModule } from "primeng/listbox";

@Component({
  selector: "app-listbox",
  standalone: true,
  imports: [ListboxModule],
  template: `<p-listbox [options]="options()" [optionLabel]="optionLabel()" [optionValue]="optionValue()" [multiple]="multiple()" [checkbox]="checkbox()" [filter]="filter()" [style]="style()" [listStyle]="listStyle()" [emptyFilterMessage]="emptyFilterMessage()" [formControlName]="formControlName()" [class]="styleClass()"><ng-content/></p-listbox>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppListbox extends ListboxBase {}
