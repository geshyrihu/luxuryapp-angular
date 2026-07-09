import { Component, inject } from "@angular/core";
import { ProgressBarBase } from "@ui/base/progress-bar.base";
import { MobileProgressBar } from "@ui/mobile/progress-bar/progress-bar";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de ProgressBar. Renderiza `app-progress-bar` (PrimeNG)
 * o `ili-progress-bar` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-progress-bar [value]="..." />`.
 */
@Component({
  selector: "lx-progress-bar",

  imports: [AppProgressBar, MobileProgressBar],
  template: `
    @if (platform.isMobile()) {
      <ili-progress-bar
        [value]="value()"
        [mode]="mode()"
        [showValue]="showValue()"
        [unit]="unit()"
        [color]="color()"
      />
    } @else {
      <app-progress-bar
        [value]="value()"
        [mode]="mode()"
        [showValue]="showValue()"
        [unit]="unit()"
        [color]="color()"
      />
    }
  `,
})
export class LxProgressBar extends ProgressBarBase {
  protected platform = inject(PlatformService);
}
