import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
@Component({
  selector: "app-page500",
  templateUrl: "./page500.html",
  imports: [ButtonModule, RouterModule, DividerModule],
})

/**
 * Page 500 Component
 */
export class Page500 implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
