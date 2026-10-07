import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { TimelineBase } from "@ui/core/timeline.base";
import { MobileTimeline } from "@ui/mobile/timeline/timeline";
import { Timeline } from "@ui/web/timeline/timeline";

/**
 * Wrapper multiplataforma de Timeline. Renderiza `app-timeline` (Bootstrap) o
 * `lux-timeline-mobile` (timeline vertical nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-timeline [events]="..." />`.
 */
@Component({
  selector: "lux-timeline",

  imports: [Timeline, MobileTimeline],
  template: `
    @if (platform.isMobile()) {
      <lux-timeline-mobile [events]="events()" [align]="align()" [layout]="layout()" />
    } @else {
      <lux-timeline-web [events]="events()" [align]="align()" [layout]="layout()" />
    }
  `,
})
export class LxTimeline extends TimelineBase {
  protected platform = inject(PlatformService);
}
