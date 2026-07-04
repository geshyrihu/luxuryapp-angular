import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { ThemeSwitcherBase } from "src/app/core/components/shared/theme-switcher/theme-switcher-base";

/**
 * AppThemeSwitcher — Toggle que aplica/remueve `body.theme-dark`.
 * Persiste la preferencia en localStorage. Respeta prefers-color-scheme en la primera visita.
 */
@Component({
  selector: "app-theme-switcher",
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, AppIcon],
  template: `
    <p-button
      [pTooltip]="theme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
      tooltipPosition="bottom"
      [rounded]="true"
      [text]="true"
      severity="secondary"
      (onClick)="toggle()"
      styleClass="app-theme-btn"
      [attr.aria-label]="theme() === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'"
      [attr.aria-pressed]="theme() === 'dark'"
    >
      <app-icon
        [icon]="theme() === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'"
        class="text-xl"
      />
    </p-button>
  `,
  styles: [`
    .app-theme-btn {
      transition: color 0.2s;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppThemeSwitcher extends ThemeSwitcherBase {}
