import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppInputnumber } from "@ui/web/inputnumber/inputnumber";
import { MobileInputnumber } from "@ui/mobile/inputnumber/inputnumber";
import { InputnumberBase } from "@ui/base/inputnumber.base";

@Component({
  selector: "lx-inputnumber",
  standalone: true,
  imports: [AppInputnumber, MobileInputnumber],
  template: `
    @if (platform.isMobile()) {
      <ili-inputnumber [placeholder]="placeholder()" [min]="min()" [max]="max()" [mode]="mode()" [value]="value()" (valueChange)="value.set($event)" [styleClass]="styleClass()"></ili-${c.folder}>
    } @else {
      <app-inputnumber [placeholder]="placeholder()" [min]="min()" [max]="max()" [mode]="mode()" [value]="value()" (valueChange)="value.set($event)" [styleClass]="styleClass()"></app-${c.folder}>
    }
  `,
})
export class LxInputnumber extends InputnumberBase {
  protected platform = inject(PlatformService);
}
