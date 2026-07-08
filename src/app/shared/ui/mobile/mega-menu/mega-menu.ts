import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MegaMenuBase } from "@ui/base/mega-menu.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-mega-menu",

  imports: [CommonModule, RouterModule, AppIcon],
  template: `
    <div class="ili-megamenu">
      @for (category of items(); track $index) {
        <div class="ili-megamenu-category">
          <button class="ili-megamenu-trigger" (click)="toggleCategory($index)">
            @if (category.icon) {
              <app-icon [icon]="category.icon" class="ili-megamenu-cat-icon" />
            }
            <span>{{ category.label }}</span>
            <app-icon
              [icon]="
                expandedCategory() === $index
                  ? 'mdi:chevron-up'
                  : 'mdi:chevron-down'
              "
              class="ili-megamenu-chevron"
            />
          </button>
          @if (expandedCategory() === $index && category.items) {
            <div class="ili-megamenu-sub">
              @for (group of category.items; track $index) {
                <div class="ili-megamenu-group">
                  @if (group.label) {
                    <div class="ili-megamenu-group-label">
                      {{ group.label }}
                    </div>
                  }
                  @for (item of group.items; track $index) {
                    <button
                      class="ili-megamenu-item"
                      [disabled]="item.disabled"
                      (click)="runCommand(item)"
                    >
                      @if (item.icon) {
                        <app-icon
                          [icon]="item.icon"
                          class="ili-megamenu-item-icon"
                        />
                      }
                      <span>{{ item.label }}</span>
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-megamenu {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .ili-megamenu-category {
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-megamenu-trigger {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        font-size: var(--ds-font-size-body, 0.9375rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        cursor: pointer;
        text-align: left;
        -webkit-tap-highlight-color: transparent;
      }
      .ili-megamenu-trigger:active {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      .ili-megamenu-cat-icon {
        font-size: 1.125rem;
        color: var(--ds-primary, #003d9b);
      }
      .ili-megamenu-chevron {
        margin-left: auto;
        font-size: 0.875rem;
        color: var(--ds-text-muted);
        transition: transform 0.2s;
      }
      .ili-megamenu-sub {
        padding: 0 1rem 0.75rem;
      }
      .ili-megamenu-group {
        margin-bottom: 0.75rem;
      }
      .ili-megamenu-group-label {
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        color: var(--ds-text-muted);
        margin-bottom: 0.25rem;
        letter-spacing: 0.05em;
      }
      .ili-megamenu-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        background: none;
        border: none;
        border-radius: var(--ds-radius-sm, 4px);
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-secondary);
        cursor: pointer;
        text-align: left;
        transition: background 0.15s;
      }
      .ili-megamenu-item:active {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      .ili-megamenu-item-icon {
        font-size: 1rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileMegaMenu extends MegaMenuBase {
  expandedCategory = signal<number | null>(null);

  toggleCategory(index: number): void {
    this.expandedCategory.set(this.expandedCategory() === index ? null : index);
  }
}
