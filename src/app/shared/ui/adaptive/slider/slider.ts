import { Component, inject } from "@angular/core";
import { SliderBase } from "@ui/base/slider.base";
import { MobileSlider } from "@ui/mobile/slider/slider";
import { AppSlider } from "@ui/web/slider/slider";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de Slider. Renderiza `app-slider` (PrimeNG) o
 * `ili-slider` (ion-range) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-slider [(value)]="..." />`.
 */
@Component({
  selector: "lx-slider",

  imports: [AppSlider, MobileSlider],
  template: `
    @if (platform.isMobile()) {
      <ili-slider
        [(value)]="value"
        [label]="label()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [range]="range()"
        [disabled]="disabled()"
        [showValue]="showValue()"
        [prefix]="prefix()"
        [suffix]="suffix()"
      />
    } @else {
      <app-slider
        [(value)]="value"
        [label]="label()"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [range]="range()"
        [disabled]="disabled()"
        [showValue]="showValue()"
        [prefix]="prefix()"
        [suffix]="suffix()"
      />
    }
  `,
})
export class LxSlider extends SliderBase {
  protected platform = inject(PlatformService);
}
