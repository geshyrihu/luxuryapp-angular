import { Component, OnInit, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-page404",
  templateUrl: "./page404.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DividerModule, AppIcon, WebButtonLabel],
})
export class Page404 implements OnInit {
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate(ROUTES.HOME);
  }
}
