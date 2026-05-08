import { Platform } from "@angular/cdk/platform";
import { Component, inject, OnInit } from "@angular/core";
import { RecoverPassword } from "./recover-password";
import { RecoveryMobile } from "./recovery-mobile";
@Component({
  selector: "app-recovery-wrapper",
  imports: [RecoverPassword, RecoveryMobile],
  template: `
    @if (isMobile) {
      <app-recovery-mobile></app-recovery-mobile>
    } @else {
      <app-recover-password></app-recover-password>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
        width: 100vw;
      }
    `,
  ],
})
export class RecoveryWrapper implements OnInit {
  private platform = inject(Platform);
  public isMobile = false;
  ngOnInit() {
    this.isMobile =
      this.platform.ANDROID || this.platform.IOS || window.innerWidth <= 768;
  }
}
