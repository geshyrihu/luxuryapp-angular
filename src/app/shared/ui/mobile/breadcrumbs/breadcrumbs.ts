import { Component, ViewEncapsulation } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BreadcrumbsBase } from "@ui/core/breadcrumbs.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-breadcrumbs-mobile",

  imports: [RouterModule, AppIconMobile],
  template: `
    <nav class="lux-breadcrumbs-mobile">
      @if (home(); as h) {
        <a
          class="lux-breadcrumbs-mobile-item"
          [routerLink]="h.routerLink"
          (click)="runCommand(h, $event)"
        >
          <lux-icon-mobile [icon]="iconName(h.icon) || 'material-symbols-light:home'" />
        </a>
          <lux-icon-mobile icon="material-symbols-light:chevron-right" class="lux-breadcrumbs-mobile-sep" />
      }
      @for (item of items(); track $index; let last = $last) {
        <a
          class="lux-breadcrumbs-mobile-item"
          [class.lux-breadcrumbs-mobile-current]="last"
          [routerLink]="item.routerLink"
          (click)="runCommand(item, $event)"
        >
          @if (item.icon) {
            <lux-icon-mobile [icon]="iconName(item.icon) || 'material-symbols-light:circle'" />
          }
          {{ item.label }}
        </a>
        @if (!last) {
        <lux-icon-mobile icon="material-symbols-light:chevron-right" class="lux-breadcrumbs-mobile-sep" />
        }
      }
    </nav>
  `,
  styles: [
    `
      .lux-breadcrumbs-mobile {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.5rem 0;
        overflow-x: auto;
        white-space: nowrap;
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      .lux-breadcrumbs-mobile::-webkit-scrollbar {
        display: none;
      }
      .lux-breadcrumbs-mobile-item {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.85rem;
        color: var(--ds-text-secondary);
        text-decoration: none;
        padding: 0.2rem 0.1rem;
        flex-shrink: 0;
      }
      .lux-breadcrumbs-mobile-current {
        color: var(--ds-text-primary);
        font-weight: 600;
      }
      .lux-breadcrumbs-mobile-sep {
        color: var(--ds-text-muted);
        font-size: 0.9rem;
        flex-shrink: 0;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBreadcrumbs extends BreadcrumbsBase {}

