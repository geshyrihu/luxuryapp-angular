import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { IlButton } from "src/app/core/components/buttons/buttons-icon-label";
@Component({
  selector: "app-unauthorized",
  imports: [DividerModule, AppIcon, IlButton],
  templateUrl: "./unauthorized.html",
})
export class Unauthorized {
  private router = inject(Router);

  goHome(): void {
    this.router.navigate(["/"]);
  }

  goLogin(): void {
    this.router.navigate(["/auth/login"]);
  }
}
