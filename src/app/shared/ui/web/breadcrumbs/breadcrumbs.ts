import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RouterLink } from "@angular/router";
import { BreadcrumbsBase } from "@ui/base/breadcrumbs.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
// Type-only: ver la misma nota en breadcrumbs.base.ts — cero acoplamiento
// de runtime con PrimeNG.
import type { MenuItem } from "primeng/api";

@Component({
  selector: "app-breadcrumbs",

  imports: [RouterLink, AppIcon],
  template: `
    <nav class="breadcrumbs-root" [class]="styleClass()" aria-label="breadcrumb">
      <ol class="breadcrumb mb-0">
        @if (home(); as h) {
          <li class="breadcrumb-item">
            <a [routerLink]="h.routerLink" [attr.aria-label]="h.label || 'Inicio'" (click)="onClick(h, $event)">
              @if (h.icon) {
                <app-icon [icon]="iconName(h.icon)" />
              }
              @if (h.label) {
                <span>{{ h.label }}</span>
              }
            </a>
          </li>
        }
        @for (item of items(); track $index; let last = $last) {
          <li
            class="breadcrumb-item"
            [class.active]="last && !item.routerLink && !item.command"
            [attr.aria-current]="last ? 'page' : null"
          >
            @if (item.routerLink || item.command) {
              <a [routerLink]="item.routerLink" [attr.aria-label]="item.label || 'Inicio'" (click)="onClick(item, $event)">
                @if (item.icon) {
                  <app-icon [icon]="iconName(item.icon)" />
                }
                @if (item.label) {
                  <span>{{ item.label }}</span>
                }
              </a>
            } @else {
              @if (item.icon) {
                <app-icon [icon]="iconName(item.icon)" />
              }
              @if (item.label) {
                <span>{{ item.label }}</span>
              }
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumbs-root {
        padding: 0.5rem 0;
      }
      .breadcrumb {
        --bs-breadcrumb-divider-color: var(--ds-text-secondary);
        flex-wrap: wrap;
      }
      .breadcrumb-item {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .breadcrumb-item a {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        color: inherit;
        text-decoration: none;
      }
      .breadcrumb-item a:hover {
        text-decoration: underline;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Breadcrumbs extends BreadcrumbsBase {
  protected onClick(item: MenuItem, event: Event): void {
    if (item.command) {
      this.runCommand(item, event);
    }
  }
}

