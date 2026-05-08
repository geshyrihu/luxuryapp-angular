import { Injectable, effect, signal } from "@angular/core";
@Injectable({
  providedIn: "root",
})
export class ThemeService {
  // Estados del tema: 'light' | 'dark'
  themeMode = signal<"light" | "dark">("light");

  constructor() {
    // Cargar preferencia guardada al iniciar
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;

    if (savedTheme) {
      this.themeMode.set(savedTheme);
    } else {
      // Detectar preferencia del sistema SOLO si no hay nada guardado
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.themeMode.set(prefersDark ? "dark" : "light");
    }

    // Aplicación inmediata
    this.applyTheme(this.themeMode());

    // Efecto que reacciona a cambios en themeMode
    effect(() => {
      const mode = this.themeMode();
      this.applyTheme(mode);
      localStorage.setItem("theme", mode);
    });
  }

  setTheme(mode: "light" | "dark"): void {
    this.themeMode.set(mode);
    localStorage.setItem("theme", mode);
  }

  toggleTheme(): void {
    // Ciclo: light -> dark -> light...
    const current = this.themeMode();
    const next: "light" | "dark" = current === "light" ? "dark" : "light";

    this.setTheme(next);
  }

  private applyTheme(mode: "light" | "dark"): void {
    const html = document.documentElement;
    const body = document.body;

    html.classList.remove("theme-dark", "theme-light");
    body.classList.remove("theme-dark", "theme-light");
    html.setAttribute("data-theme", mode);
    body.setAttribute("data-theme", mode);

    if (mode === "dark") {
      html.classList.add("theme-dark");
      body.classList.add("theme-dark");
    } else {
      html.classList.add("theme-light");
      body.classList.add("theme-light");
    }
    // PrimeNG aplica el colorScheme correcto vía darkModeSelector: ".theme-dark"
    // definido en app.config.ts. No se requiere updatePreset() en runtime.
  }

  getCurrentTheme(): "light" | "dark" {
    return this.themeMode();
  }

  isDarkMode(): boolean {
    return this.themeMode() === "dark";
  }
}
