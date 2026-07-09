import { Component, forwardRef, inject } from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { ListboxBase } from "@ui/base/listbox.base";
import { MobileListbox } from "@ui/mobile/listbox/listbox";
import { AppListbox } from "@ui/web/listbox/listbox";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-listbox",

  imports: [AppListbox, MobileListbox],
  template: `
    @if (platform.isMobile()) {
      <ili-listbox
        [value]="value()"
        (valueChange)="onValueChange($event)"
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
        [styleClass]="styleClass()"
        ><ng-content
      /></ili-listbox>
    } @else {
      <app-listbox
        [value]="value()"
        (valueChange)="onValueChange($event)"
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
        [styleClass]="styleClass()"
        ><ng-content
      /></app-listbox>
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LxListbox),
      multi: true,
    },
  ],
})
export class LxListbox extends ListboxBase {
  protected platform = inject(PlatformService);

  private _writing = false;

  onValueChange(val: any): void {
    this.value.set(val);
    if (!this._writing) {
      this.onChangeCva(val);
      this.onTouchCva();
    }
  }

  override writeValue(val: any): void {
    this._writing = true;
    this.value.set(val);
    this._writing = false;
  }
}
