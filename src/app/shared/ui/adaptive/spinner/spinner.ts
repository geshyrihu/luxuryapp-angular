import { Component, inject } from "@angular/core";
import { SpinnerBase } from "@ui/core/spinner.base";
import { MobileSpinner } from "@ui/mobile/spinner/spinner";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { PlatformService } from "@core/services/platform.service";

/**
 * Wrapper multiplataforma de Spinner. Renderiza `app-spinner` (Bootstrap) o
 * `ili-spinner` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-spinner />`.
 */
@Component({
  selector: "lux-spinner",

  imports: [AppSpinner, MobileSpinner],
  template: `
    @if (platform.isMobile()) {
      <ili-spinner
        [size]="size()"
        [color]="color()"
        [strokeWidth]="strokeWidth()"
        [ariaLabel]="ariaLabel()"
      />
    } @else {
      <app-spinner
        [size]="size()"
        [color]="color()"
        [strokeWidth]="strokeWidth()"
        [ariaLabel]="ariaLabel()"
      />
    }
  `,
})
export class LxSpinner extends SpinnerBase {
  protected platform = inject(PlatformService);
}

