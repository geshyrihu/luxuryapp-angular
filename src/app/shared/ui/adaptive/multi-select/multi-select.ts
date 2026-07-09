import { Component, inject } from "@angular/core";
import { MultiSelectBase } from "@ui/base/multi-select.base";
import { MobileMultiSelect } from "@ui/mobile/multi-select/multi-select";
import { AppMultiSelect } from "@ui/web/multi-select/multi-select";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-multi-select",

  imports: [AppMultiSelect, MobileMultiSelect],
  template: `
    @if (platform.isMobile()) {
      <ili-multi-select
        [options]="options()"
        [placeholder]="placeholder()"
        [optionLabel]="optionLabel()"
        [ngModel]="ngModel()"
        (ngModelChange)="ngModel.set($event)"
        (onChange)="onChange.emit($event)"
        [styleClass]="styleClass()"
        ><ng-content
      /></ili-multi-select>
    } @else {
      <app-multi-select
        [options]="options()"
        [placeholder]="placeholder()"
        [optionLabel]="optionLabel()"
        [ngModel]="ngModel()"
        (ngModelChange)="ngModel.set($event)"
        (onChange)="onChange.emit($event)"
        [styleClass]="styleClass()"
        ><ng-content
      /></app-multi-select>
    }
  `,
})
export class LxMultiSelect extends MultiSelectBase {
  protected platform = inject(PlatformService);
}
