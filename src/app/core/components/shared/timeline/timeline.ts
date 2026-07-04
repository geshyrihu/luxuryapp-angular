import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { Timeline } from "src/app/core/components/web/timeline/timeline";
import { MobileTimeline } from "src/app/core/components/mobile/timeline/timeline";
import { TimelineBase } from "./timeline-base";

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
