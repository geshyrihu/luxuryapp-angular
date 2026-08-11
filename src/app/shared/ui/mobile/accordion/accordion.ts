import { Component, ViewEncapsulation } from "@angular/core";
import { AccordionBase } from "@ui/base/accordion.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-accordion",

  imports: [AppIcon],
  template: `
    <div class="ili-accordion">
      @for (item of items(); track item.id) {
        <div
          class="ili-accordion-item"
          [class.ili-accordion-disabled]="item.disabled"
        >
          <button
            class="ili-accordion-header"
            [disabled]="item.disabled"
            (click)="toggle(item.id)"
          >
            @if (item.icon) {
              <app-icon [icon]="item.icon" class="ili-accordion-header-icon" />
            }
            <span class="ili-accordion-header-title">{{ item.title }}</span>
            <app-icon
              [icon]="
                isExpanded(item.id) ? 'mdi:chevron-up' : 'mdi:chevron-down'
              "
              class="ili-accordion-chevron"
            />
          </button>
          @if (isExpanded(item.id)) {
            <div class="ili-accordion-body">
              <ng-content [select]="'[accordion=' + item.id + ']'" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-accordion {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
      }
      .ili-accordion-item {
        border-bottom: 1px solid var(--ds-border);
      }
      .ili-accordion-item:last-child {
        border-bottom: none;
      }
      .ili-accordion-disabled {
        opacity: 0.4;
      }
      .ili-accordion-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.75rem 1rem;
        background: none;
        border: none;
        font-size: var(--ds-font-size-body);
        font-weight: 600;
        color: var(--ds-text-primary);
        cursor: pointer;
        text-align: left;
        -webkit-tap-highlight-color: transparent;
        transition: background 0.15s;
      }
      .ili-accordion-header:active {
        background: var(--ds-bg-elevated);
      }
      .ili-accordion-header-icon {
        font-size: 1.125rem;
        color: var(--ds-primary);
      }
      .ili-accordion-header-title {
        flex: 1;
      }
      .ili-accordion-chevron {
        font-size: 0.875rem;
        color: var(--ds-text-muted);
        transition: transform 0.2s;
      }
      .ili-accordion-body {
        padding: 0 1rem 0.75rem;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-secondary);
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileAccordion extends AccordionBase {
  isExpanded(id: string): boolean {
    return this.expandedIds().includes(id);
  }
}
