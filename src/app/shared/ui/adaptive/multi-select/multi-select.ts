import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { MultiSelectBase } from "@ui/core/multi-select.base";
import { MobileMultiSelect } from "@ui/mobile/multi-select/multi-select";
import { AppMultiSelect } from "@ui/web/multi-select/multi-select";

@Component({
  selector: "lux-multi-select",

  imports: [AppMultiSelect, MobileMultiSelect],
  template: `
    @if (platform.isMobile()) {
      <lux-multi-select-mobile
        [options]="options()"
        [placeholder]="placeholder()"
        [optionLabel]="optionLabel()"
        [ngModel]="ngModel()"
        (ngModelChange)="ngModel.set($event)"
        (onChange)="onChange.emit($event)"
        [styleClass]="styleClass()"
        ><ng-content
      /></lux-multi-select-mobile>
    } @else {
      <lux-multi-select-web
        [options]="options()"
        [placeholder]="placeholder()"
        [optionLabel]="optionLabel()"
        [ngModel]="ngModel()"
        (ngModelChange)="ngModel.set($event)"
        (onChange)="onChange.emit($event)"
        [styleClass]="styleClass()"
        ><ng-content
      /></lux-multi-select-web>
    }
  `,
})
export class LxMultiSelect extends MultiSelectBase {
  protected platform = inject(PlatformService);
}
