import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { OverlayBadgeModule } from "primeng/overlaybadge";
import { TooltipModule } from "primeng/tooltip";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-tracking",
  imports: [CommonModule, TooltipModule, OverlayBadgeModule],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' relative ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="onTrackingClick($event)"
      [pTooltip]="tooltipText() || label() || 'Seguimiento'"
      tooltipPosition="top"
    >
      <p-overlaybadge
        [value]="
          badgeCount() && badgeCount()! > 0
            ? badgeCount()! > 99 ? '99+' : badgeCount()
            : null
        "
        severity="danger"
        class="custom-overlay-badge"
      >
        <span [class]="iconShellClasses(false)" aria-hidden="true">
          <i [class]="finalIcon()"></i>
        </span>
      </p-overlaybadge>
    </button>
  `,
  styles: [`
    ::ng-deep .custom-overlay-badge .p-overlay-badge {
      width: auto;
      min-width: 18px;
      height: 18px;
      padding: 0 4px;
      font-size: 0.75rem;
      font-weight: bold;
      border-radius: 50%;
      line-height: 18px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      top: -6px;
      right: -6px;
    }
    ::ng-deep .custom-overlay-badge .p-overlay-badge .p-overlay-badge-value {
      transform: translate(0, 0);
      display: block;
    }
  `],
})
export class CustomButtonTracking extends BaseButton {
  override text = input<boolean>(true);
  override rounded = input<boolean>(true);

  tooltipText = input<string>("");
  badgeCount = input<number | null | undefined>(undefined);
  ticketId = input<string | number | null>(null);
  title = input<string>("Seguimiento");

  clickTracking = output<{ ticketId: string | number | null; title: string }>();

  finalIcon = computed(() => this.resolvedIconClass() || "pi pi-map-marker");

  onTrackingClick(event: MouseEvent): void {
    event.stopPropagation();
    this.clickTracking.emit({ ticketId: this.ticketId(), title: this.title() });
  }
}
