import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ThemeSwitcherBase } from "@ui/base/theme-switcher.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

/**
 * AppThemeSwitcher — Toggle que aplica/remueve `body.theme-dark`.
 * Persiste la preferencia en localStorage. Respeta prefers-color-scheme en la primera visita.
 */
@Component({
  selector: "app-theme-switcher",

  imports: [ButtonModule, LxTooltipDirective, AppIcon],
  template: `
    <p-button
      [lxTooltip]="
        theme() === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      "
      tooltipPosition="bottom"
      [rounded]="true"
      [text]="true"
      severity="secondary"
      (onClick)="toggle()"
      styleClass="app-theme-btn"
      [attr.aria-label]="
        theme() === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'
      "
      [attr.aria-pressed]="theme() === 'dark'"
    >
      <app-icon
        [icon]="theme() === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'"
        class="text-xl"
      />
    </p-button>
  `,
  styles: [
    `
      .app-theme-btn {
        transition: color 0.2s;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppThemeSwitcher extends ThemeSwitcherBase {}
