import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from "@angular/core";
import { Router } from "@angular/router";
import { ButtonWeb } from "@ui/buttons/web";
import { AppDivider } from "@ui/web/divider/divider";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
@Component({
  selector: "app-page500",
  templateUrl: "./page500.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDivider, AppIcon, ButtonWeb],
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
