import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
@Component({
  selector: "app-unauthorized",
  imports: [RouterModule, ButtonModule, DividerModule],
  templateUrl: "./unauthorized.html",
})
export class Unauthorized {
  // You can add logic here if needed, e.g., to redirect after a delay
}
