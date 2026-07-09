import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppMultiselect } from "@ui/web/multiselect/multiselect";
import { MobileMultiselect } from "@ui/mobile/multiselect/multiselect";
import { MultiselectBase } from "@ui/base/multiselect.base";

@Component({
  selector: "lx-multiselect",
  standalone: true,
  imports: [AppMultiselect, MobileMultiselect],
  template: `
    @if (platform.isMobile()) {
      <ili-multiselect [options]="options()" [placeholder]="placeholder()" [optionLabel]="optionLabel()" [ngModel]="ngModel()" (ngModelChange)="ngModel.set($event)" (onChange)="onChange.emit($event)" [styleClass]="styleClass()"><ng-content/></ili-${c.folder}>
    } @else {
      <app-multiselect [options]="options()" [placeholder]="placeholder()" [optionLabel]="optionLabel()" [ngModel]="ngModel()" (ngModelChange)="ngModel.set($event)" (onChange)="onChange.emit($event)" [styleClass]="styleClass()"><ng-content/></app-${c.folder}>
    }
  `,
})
export class LxMultiselect extends MultiselectBase {
  protected platform = inject(PlatformService);
}
