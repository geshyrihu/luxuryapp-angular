import { Directive, input, model, output } from "@angular/core";

export interface Language {
  code: string;
  label: string;
  flag: string;
  locale: string;
}

export const DEFAULT_LANGUAGES: Language[] = [
  { code: "es-MX", label: "Español (México)", flag: "🇲🇽", locale: "es-MX" },
  { code: "es-ES", label: "Español (España)", flag: "🇪🇸", locale: "es-ES" },
  { code: "en-US", label: "English (US)", flag: "🇺🇸", locale: "en-US" },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧", locale: "en-GB" },
  { code: "pt-BR", label: "Português (Brasil)", flag: "🇧🇷", locale: "pt-BR" },
  { code: "fr-FR", label: "Français", flag: "🇫🇷", locale: "fr-FR" },
];

/**
 * Base compartida de LangSelector.
 *  - web:     `app-lang-selector` (PrimeNG p-select)
 *  - mobile:  `ili-lang-selector` (ion-select, action-sheet)
 *  - wrapper: `lx-lang-selector`  (auto runtime)
 */
@Directive()
export abstract class LangSelectorBase {
  selectedCode = model<string>("es-MX");
  languages = input<Language[]>(DEFAULT_LANGUAGES);
  label = input<string>("Idioma / Región");
  placeholder = input<string>("Seleccionar idioma");
  showLabel = input<boolean>(true);

  langChange = output<Language>();

  onLangChange(code: string): void {
    const lang = this.languages().find((l) => l.code === code);
    if (lang) this.langChange.emit(lang);
  }
}
