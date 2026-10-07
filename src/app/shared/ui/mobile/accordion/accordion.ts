import { Component, ViewEncapsulation } from "@angular/core";
import { AccordionBase } from "@ui/core/accordion.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-accordion-mobile",

  imports: [AppIconMobile],
  template: `
    <div class="lux-accordion-mobile">
      @for (item of items(); track item.id) {
        <div
          class="lux-accordion-mobile-item"
          [class.lux-accordion-mobile-disabled]="item.disabled"
        >
          <button
            class="lux-accordion-mobile-header"
            [disabled]="item.disabled"
            (click)="toggle(item.id)"
          >
            @if (item.icon) {
              <lux-icon-mobile [icon]="item.icon" class="lux-accordion-mobile-header-icon" />
            }
            <span class="lux-accordion-mobile-header-title">{{ item.title }}</span>
            <lux-icon-mobile
              [icon]="
                isExpanded(item.id) ? 'material-symbols-light:keyboard-arrow-up' : 'material-symbols-light:keyboard-arrow-down'
              "
              class="lux-accordion-mobile-chevron"
            />
          </button>
          @if (isExpanded(item.id)) {
            <div class="lux-accordion-mobile-body">
              <ng-content [select]="'[accordion=' + item.id + ']'" />
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .lux-accordion-mobile {
        display: flex;
        flex-direction: column;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        overflow: hidden;
      }
      .lux-accordion-mobile-item {
        border-bottom: 1px solid var(--ds-border);
      }
      .lux-accordion-mobile-item:last-child {
        border-bottom: none;
      }
      .lux-accordion-mobile-disabled {
        opacity: 0.4;
      }
      .lux-accordion-mobile-header {
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
      .lux-accordion-mobile-header:active {
        background: var(--ds-bg-elevated);
      }
      .lux-accordion-mobile-header-icon {
        font-size: 1.125rem;
        color: var(--ds-primary);
      }
      .lux-accordion-mobile-header-title {
        flex: 1;
      }
      .lux-accordion-mobile-chevron {
        font-size: 0.875rem;
        color: var(--ds-text-muted);
        transition: transform 0.2s;
      }
      .lux-accordion-mobile-body {
        padding: 0 1rem 0.75rem;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-secondary);
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileAccordion extends AccordionBase {
  isExpanded(id: string): boolean {
    return this.expandedIds().includes(id);
  }
}

