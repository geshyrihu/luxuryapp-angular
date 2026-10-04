import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon";
import { AppTag } from "@ui/web/tag/tag";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { ThemeService } from "@core/services/theme.service";

@Component({
  selector: "app-catalog-layout",
  imports: [
    RouterModule,
    AppTag,
    LxTooltipDirective,
    AppIcon,
    WebButtonIcon,
  ],
  templateUrl: "./catalog-layout.html",
  styleUrls: ["./catalog-layout.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogLayout {
  readonly themeService = inject(ThemeService);

  mobilePreview = signal<boolean>(false);
  sidebarOpen = signal<boolean>(false);

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}

