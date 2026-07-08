import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LangSelectorBase } from "@ui/base/lang-selector.base";
import { SelectModule } from "primeng/select";

export { DEFAULT_LANGUAGES, type Language } from "@ui/base/lang-selector.base";

/**
 * AppLangSelector — Dropdown de selección de idioma/locale.
 * Emite `langChange` con el código del idioma seleccionado.
 */
@Component({
  selector: "app-lang-selector",

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
        <ng-template #selectedItem let-item>
          @if (item) {
            <span class="lang-item">
              <span class="lang-flag">{{ item.flag }}</span>
              <span>{{ item.label }}</span>
            </span>
          }
        </ng-template>
        <ng-template #item let-item>
          <span class="lang-item">
            <span class="lang-flag">{{ item.flag }}</span>
            <span>{{ item.label }}</span>
          </span>
        </ng-template>
      </p-select>
    </div>
  `,
  styles: [
    `
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
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppLangSelector extends LangSelectorBase {}
