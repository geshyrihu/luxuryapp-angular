import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { RecoveryCode } from "./recovery-code";
import { RecoveryCodeMobile } from "./recovery-code-mobile";

@Component({
  selector: "app-recovery-code-wrapper",
  imports: [RecoveryCode, RecoveryCodeMobile],
  template: `
    @if (platform.isMobile()) {
      <app-recovery-code-mobile />
    } @else {
      <app-recovery-code />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`:host { display: block; height: 100vh; width: 100vw; }`],
})
export class RecoveryCodeWrapper {
  protected readonly platform = inject(PlatformService);
}
