import { Component, ViewEncapsulation } from "@angular/core";
import { IonToggle } from "@ionic/angular/standalone";
import { ThemeSwitcherBase } from "@ui/base/theme-switcher.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

@Component({
  selector: "ili-theme-switcher",

  imports: [IonToggle, AppIconMobile],
  template: `
    <div class="ili-theme">
      <ili-icon
        [icon]="theme() === 'dark' ? 'material-symbols-light:nightlight' : 'material-symbols-light:sunny'"
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
