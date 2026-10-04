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
  selector: "app-page404",
  templateUrl: "./page404.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDivider, AppIcon, ButtonWeb],
})
export class Page404 implements OnInit {
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate(ROUTES.HOME);
  }
}
