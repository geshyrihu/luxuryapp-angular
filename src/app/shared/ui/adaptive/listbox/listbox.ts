import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppListbox } from "@ui/web/listbox/listbox";
import { MobileListbox } from "@ui/mobile/listbox/listbox";
import { ListboxBase } from "@ui/base/listbox.base";

@Component({
  selector: "lx-listbox",
  standalone: true,
  imports: [AppListbox, MobileListbox],
  template: `
    @if (platform.isMobile()) {
      <ili-listbox [options]="options()" [optionLabel]="optionLabel()" [optionValue]="optionValue()" [multiple]="multiple()" [checkbox]="checkbox()" [filter]="filter()" [style]="style()" [listStyle]="listStyle()" [emptyFilterMessage]="emptyFilterMessage()" [formControlName]="formControlName()" [styleClass]="styleClass()"><ng-content/></ili-listbox>
    } @else {
      <app-listbox [options]="options()" [optionLabel]="optionLabel()" [optionValue]="optionValue()" [multiple]="multiple()" [checkbox]="checkbox()" [filter]="filter()" [style]="style()" [listStyle]="listStyle()" [emptyFilterMessage]="emptyFilterMessage()" [formControlName]="formControlName()" [styleClass]="styleClass()"><ng-content/></app-listbox>
    }
  `,
})
export class LxListbox extends ListboxBase {
  protected platform = inject(PlatformService);
}
