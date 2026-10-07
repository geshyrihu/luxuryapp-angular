import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { SplitButtonBase } from "@ui/core/split-button.base";
import { MobileSplitButton } from "@ui/mobile/split-button/split-button";
import { AppSplitButton } from "@ui/web/split-button/split-button";

@Component({
  selector: "lux-split-button",

  imports: [AppSplitButton, MobileSplitButton],
  template: `
    @if (platform.isMobile()) {
      <lux-split-button-mobile
        [label]="label()"
        [icon]="icon()"
        [model]="model()"
        [size]="size()"
        [severity]="severity()"
        [disabled]="disabled()"
        (onClick)="onClick.emit($event)"
        [styleClass]="styleClass()"
      ></lux-split-button-mobile>
    } @else {
      <lux-split-button-web
        [label]="label()"
        [icon]="icon()"
        [model]="model()"
        [size]="size()"
        [severity]="severity()"
        [disabled]="disabled()"
        (onClick)="onClick.emit($event)"
        [styleClass]="styleClass()"
      ></lux-split-button-web>
    }
  `,
})
export class LxSplitButton extends SplitButtonBase {
  protected platform = inject(PlatformService);
}
