import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DividerModule } from "primeng/divider";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-unauthorized",
  imports: [DividerModule, AppIcon, WebButtonLabel],
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
