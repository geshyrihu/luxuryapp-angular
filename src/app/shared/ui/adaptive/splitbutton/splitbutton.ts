import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppSplitbutton } from "@ui/web/splitbutton/splitbutton";
import { MobileSplitbutton } from "@ui/mobile/splitbutton/splitbutton";
import { SplitbuttonBase } from "@ui/base/splitbutton.base";

@Component({
  selector: "lx-splitbutton",
  standalone: true,
  imports: [AppSplitbutton, MobileSplitbutton],
  template: `
    @if (platform.isMobile()) {
      <ili-splitbutton [label]="label()" [model]="model()" [size]="size()" [severity]="severity()" [disabled]="disabled()" (onClick)="onClick.emit($event)" [styleClass]="styleClass()"></ili-splitbutton>
    } @else {
      <app-splitbutton [label]="label()" [model]="model()" [size]="size()" [severity]="severity()" [disabled]="disabled()" (onClick)="onClick.emit($event)" [styleClass]="styleClass()"></app-splitbutton>
    }
  `,
})
export class LxSplitbutton extends SplitbuttonBase {
  protected platform = inject(PlatformService);
}
