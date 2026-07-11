import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { ROUTES } from "src/app/routing/route-paths";
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
