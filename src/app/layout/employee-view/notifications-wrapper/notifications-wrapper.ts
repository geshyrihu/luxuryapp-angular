import { isPlatformBrowser } from "@angular/common";
import { Component, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { NotificationsListMobile } from "src/app/layout/employee-view/movil/notifications-list-mobile/notifications-list-mobile";
import { NotificationsListWeb } from "src/app/layout/employee-view/monitor/notifications-list-web/notifications-list-web";

@Component({
  selector: "app-notifications-wrapper",
  template: `
    @if (isMobile()) {
      <app-notifications-list-mobile />
    } @else {
      <app-notifications-list-web />
    }
  `,
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









