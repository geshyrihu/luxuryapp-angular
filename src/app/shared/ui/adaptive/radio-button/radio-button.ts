import { Component, inject, input } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { RadioButtonBase } from "@ui/core/radio-button.base";
import { MobileRadioButton } from "@ui/mobile/radio-button/radio-button";
import { AppRadioButton } from "@ui/web/radio-button/radio-button";

@Component({
  selector: "lux-radio-button",

  imports: [AppRadioButton, MobileRadioButton],
  template: `
    @if (platform.isMobile()) {
      <lux-radio-button-mobile
        [value]="value()"
        [control]="control()"
        [inputId]="inputId()"
        [styleClass]="styleClass()"
      ></lux-radio-button-mobile>
    } @else {
      <lux-radio-button-web
        [value]="value()"
        [control]="control()"
        [inputId]="inputId()"
        [styleClass]="styleClass()"
      ></lux-radio-button-web>
    }
  `,
})
export class LxRadioButton extends RadioButtonBase {
  protected platform = inject(PlatformService);
  value = input<any>(undefined);
  control = input<any>(undefined);
  inputId = input<any>(undefined);
  styleClass = input<string>("");
  customClass = input<string>("");
  disabled = input<boolean>(false);
}
