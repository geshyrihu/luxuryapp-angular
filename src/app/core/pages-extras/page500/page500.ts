import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
@Component({
  selector: "app-page500",
  templateUrl: "./page500.html",
  imports: [ButtonModule, RouterModule, DividerModule, AppIcon],
})

/**
 * Page 500 Component
 */
export class Page500 implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
