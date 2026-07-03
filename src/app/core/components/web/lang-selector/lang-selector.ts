import {
  Component,
  input,
  model,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { SelectModule } from "primeng/select";

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
 * AppLangSelector — Dropdown de selección de idioma/locale.
 * Emite `langChange` con el código del idioma seleccionado.
 */
@Component({
  selector: "app-lang-selector",
  standalone: true,
  imports: [CommonModule, FormsModule, SelectModule],
  template: `
    <div class="lang-selector-root">
      @if (showLabel()) {
        <label class="lang-selector-label">{{ label() }}</label>
      }

      <p-select
        [(ngModel)]="selectedCode"
        [options]="languages()"
        optionLabel="label"
        optionValue="code"
        [placeholder]="placeholder()"
        styleClass="lang-selector-dropdown"
        (ngModelChange)="onLangChange($event)"
      >
        <ng-template pTemplate="selectedItem" let-item>
          @if (item) {
            <span class="lang-item">
              <span class="lang-flag">{{ item.flag }}</span>
              <span>{{ item.label }}</span>
            </span>
          }
        </ng-template>
        <ng-template pTemplate="item" let-item>
          <span class="lang-item">
            <span class="lang-flag">{{ item.flag }}</span>
            <span>{{ item.label }}</span>
          </span>
        </ng-template>
      </p-select>
    </div>
  `,
  styles: [`
    .lang-selector-root {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .lang-selector-label {
      font-size: var(--ds-font-size-label, 0.875rem);
      color: var(--ds-text-secondary);
      font-weight: 500;
    }
    .lang-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--ds-font-size-label, 0.875rem);
    }
    .lang-flag {
      font-size: 1.125rem;
      line-height: 1;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppLangSelector {
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
