import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { TagInputBase } from "@ui/base/tag-input.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-tag-input",

  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-tag-root">
      @if (label()) {
        <label class="ili-tag-label">{{ label() }}</label>
      }

      <div class="ili-tag-field" [class.ili-tag-disabled]="disabled()">
        @for (tag of value(); track tag) {
          <span class="ili-tag-chip">
            {{ tag }}
            <button
              type="button"
              class="ili-tag-chip-x"
              (click)="removeTag(tag)"
            >
              <app-icon icon="mdi:close" />
            </button>
          </span>
        }
        <input
          class="ili-tag-input"
          [placeholder]="placeholder()"
          [disabled]="disabled()"
          [value]="draft()"
          (input)="draft.set($any($event.target).value)"
          (keydown)="onKeydown($event)"
        />
      </div>

      @if (draft() && filtered().length) {
        <div class="ili-tag-suggestions">
          @for (s of filtered(); track s) {
            <button type="button" class="ili-tag-suggestion" (click)="pick(s)">
              {{ s }}
            </button>
          }
        </div>
      }

      @if (hint()) {
        <span class="ili-tag-hint">{{ hint() }}</span>
      }
    </div>
  `,
  styles: [
    `
      .ili-tag-root {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .ili-tag-label {
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
        font-weight: 500;
      }
      .ili-tag-field {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
        align-items: center;
        padding: 0.5rem;
        min-height: 2.75rem;
        border: 1.5px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        background: var(--ds-bg-surface, #fff);
      }
      .ili-tag-field:focus-within {
        border-color: var(--ds-primary, #003d9b);
      }
      .ili-tag-disabled {
        opacity: 0.55;
        pointer-events: none;
      }
      .ili-tag-chip {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        background: var(--ds-primary-100, #dae2ff);
        color: var(--ds-primary-700, #003079);
        border-radius: 9999px;
        padding: 0.25rem 0.5rem 0.25rem 0.7rem;
        font-size: 0.8125rem;
        font-weight: 500;
      }
      .ili-tag-chip-x {
        display: inline-flex;
        border: none;
        background: none;
        color: inherit;
        opacity: 0.7;
        font-size: 0.85rem;
        padding: 0;
      }
      .ili-tag-input {
        flex: 1;
        min-width: 100px;
        border: none;
        outline: none;
        background: transparent;
        font-size: 0.9375rem;
        color: var(--ds-text-primary);
        padding: 0.25rem;
      }
      .ili-tag-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }
      .ili-tag-suggestion {
        border: 1px solid var(--ds-border, #e2e8f0);
        background: var(--ds-bg-sunken, #f1f5f9);
        color: var(--ds-text-secondary);
        border-radius: 9999px;
        padding: 0.2rem 0.65rem;
        font-size: 0.8125rem;
      }
      .ili-tag-hint {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTagInput extends TagInputBase {
  protected draft = signal("");

  protected filtered(): string[] {
    return this.availableSuggestions(this.draft());
  }

  protected pick(tag: string): void {
    this.addTag(tag);
    this.draft.set("");
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      if (this.draft().trim()) {
        this.addTag(this.draft());
        this.draft.set("");
      }
    } else if (
      event.key === "Backspace" &&
      !this.draft() &&
      this.value().length
    ) {
      this.removeTag(this.value()[this.value().length - 1]);
    }
  }
}
