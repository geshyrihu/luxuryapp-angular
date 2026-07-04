import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Timeline } from "@ui/web/timeline/timeline";
import { MobileTimeline } from "@ui/mobile/timeline/timeline";
import { TimelineBase } from "@ui/base/timeline.base";

/**
 * Wrapper multiplataforma de Timeline. Renderiza `app-timeline` (PrimeNG) o
 * `ili-timeline` (timeline vertical nativo) según `PlatformService.isMobile()`.
 * Punto de entrada recomendado: `<lx-timeline [events]="..." />`.
 */
@Component({
  selector: "lx-timeline",
  standalone: true,
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
