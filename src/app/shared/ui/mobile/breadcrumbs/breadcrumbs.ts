import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { BreadcrumbsBase } from "@ui/base/breadcrumbs.base";

@Component({
  selector: "ili-breadcrumbs",
  standalone: true,
  imports: [CommonModule, RouterModule, AppIcon],
  template: `
    <nav class="ili-bc">
      @if (home(); as h) {
        <a
          class="ili-bc-item"
          [routerLink]="h.routerLink"
          (click)="runCommand(h, $event)"
        >
          <app-icon [icon]="h.icon || 'mdi:home'" />
        </a>
        <app-icon icon="mdi:chevron-right" class="ili-bc-sep" />
      }
      @for (item of items(); track $index; let last = $last) {
        <a
          class="ili-bc-item"
          [class.ili-bc-current]="last"
          [routerLink]="item.routerLink"
          (click)="runCommand(item, $event)"
        >
          @if (item.icon) {
            <app-icon [icon]="item.icon" />
          }
          {{ item.label }}
        </a>
        @if (!last) {
          <app-icon icon="mdi:chevron-right" class="ili-bc-sep" />
        }
      }
    </nav>
  `,
  styles: [
    `
      .ili-bc {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 0;
        overflow-x: auto;
        white-space: nowrap;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .ili-bc::-webkit-scrollbar {
        display: none;
      }
      .ili-bc-item {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: var(--ds-text-secondary);
        text-decoration: none;
        padding: 0.2rem 0.1rem;
        flex-shrink: 0;
      }
      .ili-bc-current {
        color: var(--ds-text-primary);
        font-weight: 600;
      }
      .ili-bc-sep {
        color: var(--ds-text-muted);
        font-size: 0.9rem;
        flex-shrink: 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBreadcrumbs extends BreadcrumbsBase {}
