import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { IlButton } from "src/app/core/components/buttons/buttons-icon-label";
import { ROUTES } from "src/app/routing/route-paths";
@Component({
  selector: "app-page500",
  templateUrl: "./page500.html",
  imports: [DividerModule, AppIcon, IlButton],
})
export class Page500 implements OnInit {
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate(ROUTES.HOME);
  }

  reloadPage(): void {
    window.location.reload();
  }
}
