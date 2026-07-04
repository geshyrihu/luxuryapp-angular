import { Directive, input } from "@angular/core";

export interface TimelineEvent {
  title: string;
  description?: string;
  date?: string;
  icon?: string;
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
