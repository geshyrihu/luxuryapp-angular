import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppRadiobutton } from "@ui/web/radiobutton/radiobutton";
import { MobileRadiobutton } from "@ui/mobile/radiobutton/radiobutton";
import { RadiobuttonBase } from "@ui/base/radiobutton.base";

@Component({
  selector: "lx-radiobutton",
  standalone: true,
  imports: [AppRadiobutton, MobileRadiobutton],
  template: `
    @if (platform.isMobile()) {
      <ili-radiobutton [value]="value()" [formControl]="formControl()" [inputId]="inputId()" [styleClass]="styleClass()"></ili-${c.folder}>
    } @else {
      <app-radiobutton [value]="value()" [formControl]="formControl()" [inputId]="inputId()" [styleClass]="styleClass()"></app-${c.folder}>
    }
  `,
})
export class LxRadiobutton extends RadiobuttonBase {
  protected platform = inject(PlatformService);
}
