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
import { LxIcon } from "@ui/adaptive/icon/icon";
@Component({
  selector: "app-page404",
  templateUrl: "./page404.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppDivider, LxIcon, ButtonWeb],
})
export class Page404 implements OnInit {
  private router = inject(Router);

  constructor() {}

  ngOnInit(): void {}

  goHome(): void {
    this.router.navigate(ROUTES.HOME);
  }
}
