import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { LoginComponent } from "./login";
import { LoginMobile } from "./login-mobile";

@Component({
  selector: "app-login-wrapper",
  imports: [LoginComponent, LoginMobile],
  template: `
    @if (platform.isMobile()) {
      <app-login-mobile />
    } @else {
      <app-login />
    }
  `,
  styles: [`:host { display: block; height: 100vh; width: 100vw; }`],
})
export class LoginWrapper {
  protected readonly platform = inject(PlatformService);
}
