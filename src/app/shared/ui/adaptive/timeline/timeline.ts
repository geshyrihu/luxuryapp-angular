import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { TimelineBase } from "@ui/base/timeline.base";
import { MobileTimeline } from "@ui/mobile/timeline/timeline";
import { Timeline } from "@ui/web/timeline/timeline";

/**
 * Wrapper multiplataforma de Timeline. Renderiza `app-timeline` (Bootstrap) o
 * `ili-timeline` (timeline vertical nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lux-timeline [events]="..." />`.
 */
@Component({
  selector: "lux-timeline",

  imports: [Timeline, MobileTimeline],
  template: `
    @if (platform.isMobile()) {
      <ili-timeline [events]="events()" [align]="align()" [layout]="layout()" />
    } @else {
      <app-timeline [events]="events()" [align]="align()" [layout]="layout()" />
    }
  `,
})
export class LxTimeline extends TimelineBase {
  protected platform = inject(PlatformService);
}
