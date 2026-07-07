import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BadgeModule } from "primeng/badge";
import type { BadgeSeverity, BadgeSize } from "primeng/badge";
import { BadgeBase } from "@ui/base/badge.base";

/**
 * AppBadge — Wrapper sobre p-badge con color semántico y tamaño.
 */
@Component({
  selector: "app-badge",
  standalone: true,
  imports: [CommonModule, BadgeModule],
  template: `
    <p-badge
      [value]="displayValue()"
      [severity]="severity()"
      [badgeSize]="badgeSize()"
      [class]="'app-badge-' + color()"
    />
  `,
  styles: [`
    app-badge .p-badge.app-badge-primary { background: var(--ds-primary, #2563eb); color: #fff; }
    app-badge .p-badge.app-badge-neutral { background: var(--ds-bg-muted, #64748b); color: #fff; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBadge extends BadgeBase {
  severity(): BadgeSeverity {
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
  }

  badgeSize(): BadgeSize {
    const map: Record<string, BadgeSize> = {
      small: "small",
      normal: null,
      large: "large",
    };
    return map[this.size()] ?? null;
  }
}
