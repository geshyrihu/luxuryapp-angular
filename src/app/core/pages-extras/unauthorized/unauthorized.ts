import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonWeb } from "@ui/buttons/web";
import { AppDivider } from "@ui/web/divider/divider";
import { ROUTES } from "src/app/routing/route-paths";
import { LxIcon } from "@ui/adaptive/icon/icon";
@Component({
  selector: "app-unauthorized",
   imports: [AppDivider, LxIcon, ButtonWeb],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./unauthorized.html",
})
export class Unauthorized {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(ROUTES.HOME);
  }

  goLogin(): void {
    this.router.navigate(ROUTES.AUTH.LOGIN);
  }
}
