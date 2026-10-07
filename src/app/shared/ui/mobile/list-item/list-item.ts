import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from "@angular/core";

/**
 * 📱 ILI LIST ITEM (Mobile)
 * ─────────────────────────────────────────────────────────────
 * Grid-based list item with 3-column layout (start/content/end).
 *
 * **Touch Target Rule (WCAG 2.5.5):**
 * All clickable elements INSIDE this item MUST have min-width: 44px.
 * Use padding-based sizing for icon buttons, not fixed icon sizes.
 *
 * ✓ GOOD:
 *   <button style="min-width: 44px; padding: 8px;">
 *     <lux-icon-base icon="material-symbols-light:edit" />
 *   </button>
 *
 * ✗ BAD (< 44px touch target):
 *   <lux-icon-base icon="material-symbols-light:edit" class="text-2xl" />
 *
 * Minimum list-item height is 4.25rem (68px) which provides ample
 * vertical space. Enforce min-width on nested button/icon elements.
 */
@Component({
  selector: "lux-list-item-mobile",
  template: `
    <article
      class="lux-list-item-mobile"
      [class.lux-list-item-mobile-no-padding]="noPadding()"
      [class.lux-list-item-mobile-no-divider]="!divider()"
      [class.lux-list-item-mobile-align-top]="alignTop()"
    >
      <div class="lux-list-item-mobile__start">
        <ng-content select="[start], [slot=start]" />
      </div>

      <div class="lux-list-item-mobile__content">
        <ng-content />
      </div>

      <div class="lux-list-item-mobile__end">
        <ng-content select="[end], [slot=end]" />
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .lux-list-item-mobile {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.75rem;
        min-height: 4.25rem;
        padding: 0.75rem;
        background: var(--ds-bg-surface);
        border-bottom: 1px solid var(--ds-border);
      }

      .lux-list-item-mobile-no-padding {
        padding-inline: 0;
      }

      .lux-list-item-mobile-no-divider {
        border-bottom: 0;
      }

      .lux-list-item-mobile__start {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        grid-column: 1;
      }

      .lux-list-item-mobile__end {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        grid-column: 3;
      }

      .lux-list-item-mobile__content {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        grid-column: 2;
      }

      .lux-list-item-mobile__content:empty,
      .lux-list-item-mobile__start:empty,
      .lux-list-item-mobile__end:empty {
        display: none;
      }

      .lux-list-item-mobile.lux-list-item-mobile-align-top,
      .lux-list-item-mobile.lux-list-item-mobile-align-top .lux-list-item-mobile__start,
      .lux-list-item-mobile.lux-list-item-mobile-align-top .lux-list-item-mobile__end {
        align-items: flex-start;
      }
    `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileListItem {
  divider = input(true);
  noPadding = input(false);
  alignTop = input(false);
}
