import { Component, inject } from "@angular/core";
import { KnobBase } from "@ui/base/knob.base";
import { MobileKnob } from "@ui/mobile/knob/knob";
import { AppKnob } from "@ui/web/knob/knob";
import { PlatformService } from "src/app/core/services/platform.service";

@Component({
  selector: "lx-knob",

  imports: [AppKnob, MobileKnob],
  template: `
    @if (platform.isMobile()) {
      <ili-knob
        [(value)]="value"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [size]="size()"
        [color]="color()"
      />
    } @else {
      <app-knob
        [(value)]="value"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [size]="size()"
        [color]="color()"
      />
    }
  `,
})
export class LxKnob extends KnobBase {
  protected platform = inject(PlatformService);
}
