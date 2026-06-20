import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

@Component({
  selector: "app-web-icons",
  imports: [CommonModule, CardModule, DividerModule, AppIcon],
  templateUrl: "./web-icons.html",
})
export class WebIcons {}
