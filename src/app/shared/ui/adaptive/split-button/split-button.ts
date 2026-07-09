import { Component, inject } from "@angular/core";
import { SplitButtonBase } from "@ui/base/split-button.base";
import { MobileSplitButton } from "@ui/mobile/split-button/split-button";
import { AppSplitButton } from "@ui/web/split-button/split-button";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-split-button",

  imports: [AppSplitButton, MobileSplitButton],
  template: `
    @if (platform.isMobile()) {
      <ili-split-button
        [label]="label()"
        [icon]="icon()"
        [model]="model()"
        [size]="size()"
        [severity]="severity()"
        [disabled]="disabled()"
        (onClick)="onClick.emit($event)"
        [styleClass]="styleClass()"
      ></ili-split-button>
    } @else {
      <app-split-button
        [label]="label()"
        [icon]="icon()"
        [model]="model()"
        [size]="size()"
        [severity]="severity()"
        [disabled]="disabled()"
        (onClick)="onClick.emit($event)"
        [styleClass]="styleClass()"
      ></app-split-button>
    }
  `,
})
export class LxSplitButton extends SplitButtonBase {
  protected platform = inject(PlatformService);
}
