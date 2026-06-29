import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { LoginComponent } from "./login";
import { LoginMobile } from "./login-mobile";

@Component({
  selector: "app-login-wrapper",
  imports: [LoginComponent, LoginMobile],
  template: `
    <!-- Vista Web Premium -->
    <div class="hidden md:block h-full w-full">
      <app-login />
    </div>

    <!-- Vista Móvil Premium (Ionic) -->
    <div class="flex md:hidden h-full w-full">
      <app-login-mobile />
    </div>
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
export class LoginWrapper {
  protected readonly platform = inject(PlatformService);
}
