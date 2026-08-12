import { Directive, input } from "@angular/core";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

export interface TimelineEvent {
  title: string;
  description?: string;
  date?: string;
  icon?: AppIconName;
  color?: string;
  badge?: string;
  badgeColor?: string;
}

/**
 * Base compartida de Timeline.
 *  - web:     `app-timeline` (PrimeNG p-timeline, soporta align/layout)
 *  - mobile:  `ili-timeline` (timeline vertical nativo)
 *  - wrapper: `lx-timeline`  (auto runtime)
 */
@Directive()
export abstract class TimelineBase {
  events = input.required<TimelineEvent[]>();
  align = input<"left" | "right" | "alternate" | "top" | "bottom">("left");
  layout = input<"vertical" | "horizontal">("vertical");
}
