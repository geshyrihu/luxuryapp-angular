import { Component, inject } from "@angular/core";
import { PlatformService } from "src/app/core/services/platform.service";
import { EmptyState } from "@ui/web/empty-state/empty-state";
import { MobileEmptyState } from "@ui/mobile/empty-state/empty-state";
import { EmptyStateBase } from "@ui/base/empty-state.base";

/**
 * Wrapper multiplataforma. Renderiza la versión web (`app-empty-state`) o la
 * versión Ionic (`ili-empty-state`) según `PlatformService.isMobile()`.
 * Es el punto de entrada recomendado: `<lx-empty-state ... />`.
 */
@Component({
  selector: "lx-empty-state",
  standalone: true,
  imports: [EmptyState, MobileEmptyState],
  template: `
    @if (platform.isMobile()) {
      <ili-empty-state
        [icon]="icon()"
        [iconColor]="iconColor()"
        [title]="title()"
        [message]="message()"
        [actionLabel]="actionLabel()"
        [actionIcon]="actionIcon()"
        [actionSeverity]="actionSeverity()"
        [tag]="tag()"
        (action)="action.emit()"
      />
    } @else {
      <app-empty-state
        [icon]="icon()"
        [iconColor]="iconColor()"
        [title]="title()"
        [message]="message()"
        [actionLabel]="actionLabel()"
        [actionIcon]="actionIcon()"
        [actionSeverity]="actionSeverity()"
        [tag]="tag()"
        (action)="action.emit()"
      />
    }
  `,
})
export class LxEmptyState extends EmptyStateBase {
  protected platform = inject(PlatformService);
}
