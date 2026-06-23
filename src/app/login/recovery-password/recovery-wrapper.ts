import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { RecoverPassword } from "./recover-password";
import { RecoveryMobile } from "./recovery-mobile";

@Component({
  selector: "app-recovery-wrapper",
  imports: [RecoverPassword, RecoveryMobile],
  template: `
    @if (platform.isMobile()) {
      <app-recovery-mobile />
    } @else {
      <app-recover-password />
    }
  `,
  styles: [`:host { display: block; height: 100vh; width: 100vw; }`],
})
export class RecoveryWrapper {
  protected readonly platform = inject(PlatformService);
}
