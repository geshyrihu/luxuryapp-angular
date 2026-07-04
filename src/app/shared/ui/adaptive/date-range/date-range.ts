import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { DateRange } from "@ui/web/date-range/date-range";
import { MobileDateRange } from "@ui/mobile/date-range/date-range";
import { DateRangeBase } from "@ui/base/date-range.base";

/**
 * Wrapper multiplataforma de DateRange. Renderiza `app-date-range` (presets
 * PrimeNG) o `ili-date-range` (presets Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-date-range [(value)]="..." />`.
 */
@Component({
  selector: "lx-date-range",
  standalone: true,
  imports: [DateRange, MobileDateRange],
  template: `
    @if (platform.isMobile()) {
      <ili-date-range [(value)]="value" />
    } @else {
      <app-date-range [(value)]="value" />
    }
  `,
})
export class LxDateRange extends DateRangeBase {
  protected platform = inject(PlatformService);
}
