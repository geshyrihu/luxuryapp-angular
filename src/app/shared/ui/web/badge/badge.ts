import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { BadgeBase } from "@ui/base/badge.base";

/**
 * AppBadge — `.badge` de Bootstrap con color semántico y tamaño.
 */
@Component({
  selector: "app-badge",

  imports: [],
  template: `
    <span class="badge" [class]="'app-badge-' + color() + ' app-badge-size-' + size()">{{ displayValue() }}</span>
  `,
  styles: [
    `
      .app-badge-primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      .app-badge-secondary {
        background: var(--ds-secondary-light);
        color: var(--ds-accent-text-warning);
      }
      .app-badge-success {
        background: var(--ds-success);
        color: var(--ds-on-primary);
      }
      .app-badge-warning {
        background: var(--ds-warning);
        color: var(--ds-on-primary);
      }
      .app-badge-danger {
        background: var(--ds-danger);
        color: var(--ds-on-primary);
      }
      .app-badge-info {
        background: var(--ds-info, var(--ds-primary));
        color: var(--ds-on-primary);
      }
      .app-badge-neutral {
        background: var(--ds-bg-muted);
        color: var(--ds-on-primary);
      }
      .app-badge-size-small {
        font-size: 0.625rem;
        padding: 0.15em 0.4em;
      }
      .app-badge-size-large {
        font-size: 0.875rem;
        padding: 0.35em 0.65em;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBadge extends BadgeBase {}
