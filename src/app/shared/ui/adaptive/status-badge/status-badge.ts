import { Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { StatusBadgeBase } from "@ui/core/status-badge.base";
import { MobileStatusBadge } from "@ui/mobile/status-badge/status-badge";
import { StatusBadge } from "@ui/web/status-badge/status-badge";

/**
 * Wrapper multiplataforma de StatusBadge. Renderiza `app-status-badge` (web,
 * con tooltip) o `lux-status-badge-mobile` (Ionic, sin tooltip) según la plataforma.
 * Punto de entrada recomendado: `<lux-status-badge [status]="..." />`.
 */
@Component({
  selector: "lux-status-badge",

  imports: [StatusBadge, MobileStatusBadge],
  template: `
    @if (platform.isMobile()) {
      <lux-status-badge-mobile
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
      <lux-status-badge-web
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
