import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CommonModule } from "@angular/common";
import { Component, inject, ChangeDetectionStrategy } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { ROUTES } from "src/app/routing/route-paths";

import { CardModule } from "primeng/card";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxPanel } from "@ui/adaptive/panel/panel";
import { LxTag } from "@ui/adaptive/tag/tag";

@Component({
  selector: "app-manuals-and-processes-guide",
  templateUrl: "./manuals-and-processes-guide.html",

  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    WebButtonLabel,
    WebButtonIcon,
    RouterLink,
    CardModule,
    LxPanel,
    LxDivider,
    LxTag,
    LxFieldset,
   AppIcon],
})
export class ManualsAndProcessesGuide {
  private router = inject(Router);

  onBack(): void {
    this.router.navigate([...ROUTES.BIBLIOTECA.MANUALES_Y_PROCESOS, 'list']);
  }
}
