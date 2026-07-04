import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppOtpInput } from "@ui/web/otp-input/otp-input";
import { MobileOtpInput } from "@ui/mobile/otp-input/otp-input";
import { OtpInputBase } from "@ui/base/otp-input.base";

/**
 * Wrapper multiplataforma de OtpInput. Renderiza `app-otp-input` (PrimeNG) o
 * `ili-otp-input` (cajas nativas) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-otp-input [(value)]="..." />`.
 */
@Component({
  selector: "lx-otp-input",
  standalone: true,
  imports: [AppOtpInput, MobileOtpInput],
  template: `
    @if (platform.isMobile()) {
      <ili-otp-input
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [error]="error()"
        [length]="length()"
        [integerOnly]="integerOnly()"
        [disabled]="disabled()"
        [mask]="mask()"
        (complete)="complete.emit($event)"
      />
    } @else {
      <app-otp-input
        [(value)]="value"
        [label]="label()"
        [hint]="hint()"
        [error]="error()"
        [length]="length()"
        [integerOnly]="integerOnly()"
        [disabled]="disabled()"
        [mask]="mask()"
        (complete)="complete.emit($event)"
      />
    }
  `,
})
export class LxOtpInput extends OtpInputBase {
  protected platform = inject(PlatformService);
}
