import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { WebButtonIcon } from "src/app/core/components/buttons/web-icon";

@Component({
  selector: "app-catalog-layout",
  imports: [
    CommonModule,
    RouterModule,
    TagModule,
    TooltipModule,
    AppIcon,
    WebButtonIcon,
  ],
  templateUrl: "./catalog-layout.html",
  styleUrls: ["./catalog-layout.scss"],
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
    document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
  }
}
