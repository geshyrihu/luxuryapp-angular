import { Component, inject } from "@angular/core";
import { StatusBadgeBase } from "@ui/base/status-badge.base";
import { MobileStatusBadge } from "@ui/mobile/status-badge/status-badge";
import { StatusBadge } from "@ui/web/status-badge/status-badge";
import { PlatformService } from "src/app/core/services/platform.service";

/**
 * Wrapper multiplataforma de StatusBadge. Renderiza `app-status-badge` (web,
 * con tooltip) o `ili-status-badge` (Ionic, sin tooltip) según la plataforma.
 * Punto de entrada recomendado: `<lx-status-badge [status]="..." />`.
 */
@Component({
  selector: "lx-status-badge",

  imports: [StatusBadge, MobileStatusBadge],
  template: `
    @if (platform.isMobile()) {
      <ili-status-badge
        [status]="status()"
        [itemId]="itemId()"
        [clickable]="clickable()"
        [tooltip]="tooltip()"
        [isEmpresa]="isEmpresa()"
        [isVisibility]="isVisibility()"
        [showIcon]="showIcon()"
        (statusClick)="statusClick.emit($event)"
      />
    } @else {
      <app-status-badge
        [status]="status()"
        [itemId]="itemId()"
        [clickable]="clickable()"
        [tooltip]="tooltip()"
        [isEmpresa]="isEmpresa()"
        [isVisibility]="isVisibility()"
        [showIcon]="showIcon()"
        (statusClick)="statusClick.emit($event)"
      />
    }
  `,
})
export class LxStatusBadge extends StatusBadgeBase {
  protected platform = inject(PlatformService);
}
