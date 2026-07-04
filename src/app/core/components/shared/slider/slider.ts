import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppSlider } from "src/app/core/components/web/slider/slider";
import { MobileSlider } from "src/app/core/components/mobile/slider/slider";
import { SliderBase } from "./slider-base";

/**
 * Wrapper multiplataforma de Slider. Renderiza `app-slider` (PrimeNG) o
 * `ili-slider` (ion-range) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-slider [(value)]="..." />`.
 */
@Component({
  selector: "lx-slider",
  standalone: true,
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
