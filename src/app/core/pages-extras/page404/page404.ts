import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
@Component({
  selector: "app-page404",
  templateUrl: "./page404.html",
  imports: [ButtonModule, RouterModule, DividerModule],
})

/**
 * Page404 component
 */
export class Page404 implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
