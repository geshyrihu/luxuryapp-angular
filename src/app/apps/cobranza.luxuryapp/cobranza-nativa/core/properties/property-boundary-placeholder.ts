import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-property-boundary-placeholder",
  imports: [LxCard, LxTag, WebButtonLabel, AppIcon],
  templateUrl: "./property-boundary-placeholder.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PropertyBoundaryPlaceholder {
  private readonly router = inject(Router);

  navigateTo(route: string): void {
    void this.router.navigateByUrl(route);
  }
}
