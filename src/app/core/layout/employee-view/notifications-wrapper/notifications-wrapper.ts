import { isPlatformBrowser } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal,
} from "@angular/core";
import { NotificationsListWeb } from "src/app/core/layout/employee-view/monitor/notifications-list-web/notifications-list-web";
import { NotificationsListMobile } from "src/app/core/layout/employee-view/movil/notifications-list-mobile/notifications-list-mobile";

@Component({
  selector: "app-notifications-wrapper",
  template: `
    @if (isMobile()) {
      <app-notifications-list-mobile />
    } @else {
      <app-notifications-list-web />
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [NotificationsListMobile, NotificationsListWeb],
})
export class NotificationsWrapper implements OnInit {
  private platformId = inject(PLATFORM_ID);

  isMobile = signal(false);

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobile.set(window.innerWidth < 768);
    }
  }
}
