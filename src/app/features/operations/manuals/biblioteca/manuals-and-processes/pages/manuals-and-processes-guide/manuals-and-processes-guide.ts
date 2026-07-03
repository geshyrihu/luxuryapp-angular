import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label";
import { WebButtonIcon } from "src/app/core/components/buttons/web/icon";
import { ROUTES } from "src/app/routing/route-paths";

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
    WebButtonLabel,
    WebButtonIcon,
    RouterLink,
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
    this.router.navigate([...ROUTES.BIBLIOTECA.MANUALES_Y_PROCESOS, 'list']);
  }
}
