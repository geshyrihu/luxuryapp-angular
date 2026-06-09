import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";

import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { FieldsetModule } from "primeng/fieldset";
import { PanelModule } from "primeng/panel";
import { TagModule } from "primeng/tag";

@Component({
  selector: "app-manuals-and-processes-guide",
  templateUrl: "./manuals-and-processes-guide.html",

  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    PanelModule,
    DividerModule,
    TagModule,
    FieldsetModule,
   AppIcon],
})
export class ManualsAndProcessesGuide {
  private router = inject(Router);

  onBack(): void {
    this.router.navigate(["/library/manuals-and-processes/list"]);
  }
}
