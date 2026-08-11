import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed
} from "@angular/core";
import { BadgeBase } from "@ui/base/badge.base";
import { BadgeModule } from "primeng/badge";
import { BadgeSeverity, BadgeSize } from "primeng/types/badge";

/**
 * AppBadge — Wrapper sobre p-badge con color semántico y tamaño.
 */
@Component({
  selector: "app-badge",

  imports: [BadgeModule],
  template: `
    <p-badge
      [value]="displayValue()"
      [severity]="severity()"
      [badgeSize]="badgeSize()"
      [class]="'app-badge-' + color()"
    />
  `,
  styles: [
    `
      app-badge .p-badge.app-badge-primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      app-badge .p-badge.app-badge-neutral {
        background: var(--ds-bg-muted);
        color: var(--ds-on-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBadge extends BadgeBase {
  severity = computed<BadgeSeverity>(() => {
    const map: Record<string, BadgeSeverity> = {
      primary: "info",
      secondary: "secondary",
      success: "success",
      warning: "warn",
      danger: "danger",
      info: "info",
      neutral: "secondary",
    };
    return map[this.color()] ?? "secondary";
  });

  badgeSize = computed<BadgeSize>(() => {
    const map: Record<string, BadgeSize> = {
      small: "small",
      normal: null,
      large: "large",
    };
    return map[this.size()] ?? null;
  });
}
