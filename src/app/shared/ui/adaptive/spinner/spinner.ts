import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { SpinnerBase } from "@ui/core/spinner.base";
import { MobileSpinner } from "@ui/mobile/spinner/spinner";
import { AppSpinner } from "@ui/web/spinner/spinner";

/**
 * Wrapper multiplataforma de Spinner. Renderiza `app-spinner` (Bootstrap) o
 * `lux-spinner-mobile` (Ionic) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-spinner />`.
 */
@Component({
  selector: "lux-spinner",

  imports: [AppSpinner, MobileSpinner],
  template: `
    @if (platform.isMobile()) {
      <lux-spinner-mobile
        [size]="size()"
        [color]="color()"
        [strokeWidth]="strokeWidth()"
        [ariaLabel]="ariaLabel()"
      />
    } @else {
      <lux-spinner-web
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
