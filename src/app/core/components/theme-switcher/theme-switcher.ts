import {
  Component,
  OnInit,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

type Theme = "light" | "dark";

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
export class AppThemeSwitcher implements OnInit {
  theme = signal<Theme>("light");

  private readonly STORAGE_KEY = "ds-theme";

  ngOnInit(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    this.applyTheme(saved ?? preferred);
  }

  toggle(): void {
    this.applyTheme(this.theme() === "light" ? "dark" : "light");
  }

  private applyTheme(t: Theme): void {
    this.theme.set(t);
    document.body.classList.toggle("theme-dark", t === "dark");
    localStorage.setItem(this.STORAGE_KEY, t);
  }
}
