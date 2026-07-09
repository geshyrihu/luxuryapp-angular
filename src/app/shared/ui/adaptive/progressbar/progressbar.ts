import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppProgressbar } from "@ui/web/progressbar/progressbar";
import { MobileProgressbar } from "@ui/mobile/progressbar/progressbar";
import { ProgressbarBase } from "@ui/base/progressbar.base";

@Component({
  selector: "lx-progressbar",
  standalone: true,
  imports: [AppProgressbar, MobileProgressbar],
  template: `
    @if (platform.isMobile()) {
      <ili-progressbar [value]="value()" [style]="style()" [showValue]="showValue()" [color]="color()" [styleClass]="styleClass()"></ili-${c.folder}>
    } @else {
      <app-progressbar [value]="value()" [style]="style()" [showValue]="showValue()" [color]="color()" [styleClass]="styleClass()"></app-${c.folder}>
    }
  `,
})
export class LxProgressbar extends ProgressbarBase {
  protected platform = inject(PlatformService);
}
