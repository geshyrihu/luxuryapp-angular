import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { DividerModule } from "primeng/divider";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
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
