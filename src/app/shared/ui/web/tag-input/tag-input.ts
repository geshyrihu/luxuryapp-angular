import { Component, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { TagInputBase } from "@ui/base/tag-input.base";

/**
 * AppTagInput — Input de tags/chips con autocompletado opcional.
 * Permite entrada libre o restringida a sugerencias.
 * Uso: etiquetado de registros, categorías, habilidades, keywords.
 */
@Component({
  selector: "app-tag-input",
  standalone: true,
  imports: [CommonModule, FormsModule, AutoCompleteModule],
  template: `
    <div class="app-tag-root">
      @if (label()) {
        <label class="app-tag-label">{{ label() }}</label>
      }

      <p-autocomplete
        [(ngModel)]="value"
        [suggestions]="filteredSuggestions"
        [multiple]="true"
        [dropdown]="suggestions().length > 0"
        [disabled]="disabled()"
        [placeholder]="placeholder()"
        [forceSelection]="forceSelection()"
        [unique]="true"
        (completeMethod)="onSearch($event)"
        (onAdd)="tagAdded.emit($event.value)"
        (onRemove)="tagRemoved.emit($event.value)"
        styleClass="app-tag-autocomplete"
      />

      @if (hint()) {
        <span class="app-tag-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [`
    .app-tag-root {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .app-tag-label {
      font-size: var(--ds-font-size-label, 0.875rem);
      color: var(--ds-text-secondary);
      font-weight: 500;
    }
    .app-tag-hint {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
    }
    /* Override PrimeNG autocomplete chips style */
    .app-tag-autocomplete .p-autocomplete-multiple-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      padding: 0.375rem 0.5rem;
      border: 1.5px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 6px);
      background: var(--ds-bg-surface, #fff);
      min-height: 2.5rem;
      align-items: center;
    }
    .app-tag-autocomplete .p-autocomplete-multiple-container:focus-within {
      border-color: var(--ds-primary, #003d9b);
      box-shadow: 0 0 0 3px var(--ds-primary-200, #b2c5ff);
    }
    .app-tag-autocomplete .p-autocomplete-chip {
      background: var(--ds-primary-100, #dae2ff);
      color: var(--ds-primary-700, #003079);
      border: none;
      border-radius: var(--ds-radius-full, 9999px);
      padding: 0.2rem 0.65rem;
      font-size: var(--ds-font-size-help, 0.8125rem);
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.3rem;
    }
    .app-tag-autocomplete .p-autocomplete-chip-icon {
      cursor: pointer;
      opacity: 0.7;
      font-size: 0.75rem;
    }
    .app-tag-autocomplete .p-autocomplete-chip-icon:hover { opacity: 1; }
    .app-tag-autocomplete .p-autocomplete-input {
      border: none;
      outline: none;
      background: transparent;
      font-size: var(--ds-font-size-body, 0.9375rem);
      color: var(--ds-text-primary);
      min-width: 120px;
      flex: 1;
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppTagInput extends TagInputBase {}
