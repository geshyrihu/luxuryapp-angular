import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ROUTES } from "src/app/routing/route-paths";

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
    LxPanel,
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
