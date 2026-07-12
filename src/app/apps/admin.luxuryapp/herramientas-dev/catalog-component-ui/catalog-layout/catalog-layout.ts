import {
  Component,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { TagModule } from "primeng/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { WebButtonIcon } from "@ui/buttons/web-icon";

@Component({
  selector: "app-catalog-layout",
  imports: [
    RouterModule,
    TagModule,
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
  isDarkMode = signal<boolean>(
    document.documentElement.classList.contains("theme-dark"),
  );
  mobilePreview = signal<boolean>(false);

  toggleTheme(): void {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);
    document.body.classList.toggle("theme-dark", newTheme);
    document.body.setAttribute("data-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("theme-dark", newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light",
    );
  }
}
