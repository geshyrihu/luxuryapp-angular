import { Directive, OnInit, signal } from "@angular/core";

export type Theme = "light" | "dark";

/**
 * Base compartida de ThemeSwitcher (lógica de tema + persistencia).
 *  - web:     `app-theme-switcher` (botón PrimeNG)
 *  - mobile:  `ili-theme-switcher` (ion-toggle)
 *  - wrapper: `lx-theme-switcher`  (auto runtime)
 */
@Directive()
export abstract class ThemeSwitcherBase implements OnInit {
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

  protected applyTheme(t: Theme): void {
    this.theme.set(t);
    document.body.classList.toggle("theme-dark", t === "dark");
    localStorage.setItem(this.STORAGE_KEY, t);
  }
}
