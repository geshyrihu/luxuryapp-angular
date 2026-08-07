import { Component, ViewEncapsulation } from "@angular/core";
import { IonToggle } from "@ionic/angular/standalone";
import { ThemeSwitcherBase } from "@ui/base/theme-switcher.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-theme-switcher",

  imports: [IonToggle, AppIcon],
  template: `
    <div class="ili-theme">
      <app-icon
        [icon]="theme() === 'dark' ? 'mdi:weather-night' : 'mdi:weather-sunny'"
        class="text-xl"
      />
      <span class="ili-theme-label">Modo oscuro</span>
      <ion-toggle
        [checked]="theme() === 'dark'"
        (ionChange)="onToggle($event)"
        aria-label="Alternar modo oscuro"
      />
    </div>
  `,
  styles: [
    `
      .ili-theme {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }
      .ili-theme-label {
        flex: 1;
        font-size: 0.9375rem;
        color: var(--ds-text-primary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileThemeSwitcher extends ThemeSwitcherBase {
  protected onToggle(event: CustomEvent): void {
    const checked = (event as CustomEvent<{ checked: boolean }>).detail.checked;
    this.applyTheme(checked ? "dark" : "light");
  }
}
