import { Component, ViewEncapsulation, signal } from "@angular/core";
import { CascadeSelectBase } from "@ui/base/cascade-select.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

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
        <app-icon icon="mdi:chevron-down" />
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
                <app-icon icon="mdi:chevron-right" />
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
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        color: var(--ds-text-primary, #1e293b);
        font-size: var(--ds-font-size-body, 0.875rem);
        cursor: pointer;
      }
      .ili-cascade-select-label {
        color: var(--ds-text-muted, #94a3b8);
      }
      .ili-cascade-select-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        z-index: 100;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        box-shadow: var(--ds-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.07));
        max-height: 240px;
        overflow-y: auto;
      }
      .ili-cascade-select-option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 0.75rem;
        cursor: pointer;
        font-size: var(--ds-font-size-body, 0.875rem);
        color: var(--ds-text-primary, #1e293b);
      }
      .ili-cascade-select-option:hover {
        background: var(--ds-bg-hover, #f1f5f9);
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
