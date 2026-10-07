import { Directive, input } from "@angular/core";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";

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
 *  - web:     `app-timeline` (Bootstrap p-timeline, soporta align/layout)
 *  - mobile:  `lux-timeline-mobile` (timeline vertical nativo)
 *  - wrapper: `lux-timeline`  (auto runtime)
 */
@Directive()
export abstract class TimelineBase {
  events = input.required<TimelineEvent[]>();
  align = input<"left" | "right" | "alternate" | "top" | "bottom">("left");
  layout = input<"vertical" | "horizontal">("vertical");
}
