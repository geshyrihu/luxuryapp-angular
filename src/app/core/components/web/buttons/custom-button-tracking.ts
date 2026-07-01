import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { WebButtonBase } from "./web-button-base";

@Component({
  selector: "custom-button-tracking",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <button
      type="button"
      class="btn btn-ghost-secondary btn--circle btn-sm position-relative"
      [disabled]="disabled() || loading()"
      (click)="onTrackingClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:bell-outline'" />
      @if (badgeCount() && badgeCount()! > 0) {
        <span
          class="absolute top-0 right-0 inline-flex align-items-center justify-content-center text-xs border-circle bg-red-500 text-white"
          style="min-width:1.1rem;height:1.1rem;transform:translate(30%,-30%);"
        >
          {{ badgeCount()! > 99 ? "99+" : badgeCount() }}
        </span>
      }
      @if (showLabelOnDesktop() && label()) {
        <span>{{ label() }}</span>
      }
    </button>
  `,
})
export class CustomButtonTracking extends WebButtonBase {
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  trackingTitle = input<string>("Seguimiento");

  clickTracking = output<{ ticketId: string | number | null; title: string }>();

  protected onTrackingClick(event: Event): void {
    if (this.disabled() || this.loading()) return;
    this.clickTracking.emit({
      ticketId: this.ticketId(),
      title: this.trackingTitle(),
    });
  }
}
