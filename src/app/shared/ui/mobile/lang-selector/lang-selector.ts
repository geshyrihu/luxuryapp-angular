import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { IonSelect, IonSelectOption } from "@ionic/angular/standalone";
import { LangSelectorBase } from "@ui/base/lang-selector.base";

@Component({
  selector: "ili-lang-selector",
  standalone: true,
  imports: [CommonModule, IonSelect, IonSelectOption],
  template: `
    <div class="ili-lang-root">
      @if (showLabel()) {
        <label class="ili-lang-label">{{ label() }}</label>
      }
      <ion-select
        [value]="selectedCode()"
        [placeholder]="placeholder()"
        interface="action-sheet"
        (ionChange)="onIonChange($event)"
      >
        @for (l of languages(); track l.code) {
          <ion-select-option [value]="l.code">
            {{ l.flag }} {{ l.label }}
          </ion-select-option>
        }
      </ion-select>
    </div>
  `,
  styles: [
    `
      .ili-lang-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .ili-lang-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      ion-select {
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-input, 3px);
        padding: 0.5rem 0.75rem;
        --placeholder-color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileLangSelector extends LangSelectorBase {
  protected onIonChange(event: CustomEvent): void {
    const code = (event as CustomEvent<{ value: string }>).detail.value;
    this.selectedCode.set(code);
    this.onLangChange(code);
  }
}
