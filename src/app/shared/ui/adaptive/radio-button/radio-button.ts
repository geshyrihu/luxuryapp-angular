import { Component, inject } from "@angular/core";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { MobileRadioButton } from "@ui/mobile/radio-button/radio-button";
import { AppRadioButton } from "@ui/web/radio-button/radio-button";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-radio-button",

  imports: [AppRadioButton, MobileRadioButton],
  template: `
    @if (platform.isMobile()) {
      <ili-radio-button
        [value]="value()"
        [formControl]="formControl()"
        [inputId]="inputId()"
        [styleClass]="styleClass()"
      ></ili-radio-button>
    } @else {
      <app-radio-button
        [value]="value()"
        [formControl]="formControl()"
        [inputId]="inputId()"
        [styleClass]="styleClass()"
      ></app-radio-button>
    }
  `,
})
export class LxRadioButton extends RadioButtonBase {
  protected platform = inject(PlatformService);
}
