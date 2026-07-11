import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from "@angular/core";

@Component({
  selector: "ili-list-item",

  template: `
    <article
      class="ili-list-item"
      [class.ili-list-item-no-padding]="noPadding()"
      [class.ili-list-item-no-divider]="!divider()"
      [class.ili-list-item-align-top]="alignTop()"
    >
      <div class="ili-list-item__start">
        <ng-content select="[start], [slot=start]" />
      </div>

      <div class="ili-list-item__content">
        <ng-content />
      </div>

      <div class="ili-list-item__end">
        <ng-content select="[end], [slot=end]" />
      </div>
    </article>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .ili-list-item {
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto;
        align-items: center;
        gap: 0.75rem;
        min-height: 4.25rem;
        padding: 0.75rem;
        background: var(--ds-bg-surface, #ffffff);
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }

      .ili-list-item-no-padding {
        padding-inline: 0;
      }

      .ili-list-item-no-divider {
        border-bottom: 0;
      }

      .ili-list-item__start {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        grid-column: 1;
      }

      .ili-list-item__end {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        grid-column: 3;
      }

      .ili-list-item__content {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        grid-column: 2;
      }

      .ili-list-item__content:empty,
      .ili-list-item__start:empty,
      .ili-list-item__end:empty {
        display: none;
      }
      
      .ili-list-item.ili-list-item-align-top,
      .ili-list-item.ili-list-item-align-top .ili-list-item__start,
      .ili-list-item.ili-list-item-align-top .ili-list-item__end {
        align-items: flex-start;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileListItem {
  divider = input(true);
  noPadding = input(false);
  alignTop = input(false);
}
