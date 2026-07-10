import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { ResetPassword } from "./reset-password";
import { ResetPasswordMobile } from "./reset-password-mobile";

@Component({
  selector: "app-reset-password-wrapper",
  imports: [ResetPassword, ResetPasswordMobile],
  template: `
    @if (platform.isMobile()) {
      <app-reset-password-mobile />
    } @else {
      <app-reset-password />
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [`:host { display: block; height: 100vh; width: 100vw; }`],
})
export class ResetPasswordWrapper {
  protected readonly platform = inject(PlatformService);
}
