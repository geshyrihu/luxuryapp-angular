import { Component, ViewEncapsulation, signal } from "@angular/core";
import { CascadeSelectBase } from "@ui/base/cascade-select.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

interface FlatOption {
  label: string;
  value: any;
  parent?: string;
}

@Component({
  selector: "ili-cascade-select",

  imports: [AppIcon],
  template: `
    <div class="ili-cascade-select-root">
      <button class="ili-cascade-select-trigger" (click)="toggleOpen()">
        <span class="ili-cascade-select-label">{{ displayText() }}</span>
        <app-icon icon="material-symbols-light:keyboard-arrow-down" />
      </button>
      @if (isOpen()) {
        <div class="ili-cascade-select-dropdown">
          @for (option of currentLevel(); track $index) {
            <div
              class="ili-cascade-select-option"
              (click)="selectOption(option)"
            >
              <span>{{ option[optionLabel()] }}</span>
              @if (hasChildren(option)) {
                <app-icon icon="material-symbols-light:chevron-right" />
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-cascade-select-root {
        position: relative;
        width: 100%;
      }
      .ili-cascade-select-trigger {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: 0.625rem 0.75rem;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        color: var(--ds-text-primary);
        font-size: var(--ds-font-size-body);
        cursor: pointer;
      }
      .ili-cascade-select-label {
        color: var(--ds-text-muted);
      }
      .ili-cascade-select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        box-shadow: var(--ds-shadow-md);
        max-height: 240px;
        overflow-y: auto;
      }
      .ili-cascade-select-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 0.75rem;
        cursor: pointer;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
      .ili-cascade-select-option:hover {
        background: var(--ds-bg-hover);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileCascadeSelect extends CascadeSelectBase {
  protected isOpen = signal(false);
  protected currentLevel = signal<any[]>([]);
  protected breadcrumb = signal<any[]>([]);

  protected toggleOpen(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.currentLevel.set(this.options());
    } else {
      this.currentLevel.set([]);
    }
  }

  protected hasChildren(option: any): boolean {
    return Array.isArray(option.children) && option.children.length > 0;
  }

  protected selectOption(option: any): void {
    if (this.hasChildren(option)) {
      this.breadcrumb.update((v) => [...v, option]);
      this.currentLevel.set(option.children);
    } else {
      this.value.set(option);
      this.isOpen.set(false);
      this.currentLevel.set([]);
      this.breadcrumb.set([]);
    }
  }

  protected displayText(): string {
    const v = this.value();
    if (!v) return this.placeholder();
    if (typeof v === "object" && v !== null) {
      return v[this.optionLabel()] ?? this.placeholder();
    }
    return String(v);
  }
}
