import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { PlatformService } from "@core/services/platform.service";
import { EmptyStateBase } from "@ui/core/empty-state.base";
import { MobileEmptyState } from "@ui/mobile/empty-state/empty-state";
import { EmptyState } from "@ui/web/empty-state/empty-state";

/**
 * Wrapper multiplataforma. Renderiza la versión web (`app-empty-state`) o la
 * versión Ionic (`ili-empty-state`) según `PlatformService.isMobile()`.
 * Es el punto de entrada recomendado: `<lux-empty-state ... />`.
 */
@Component({
  selector: "lux-empty-state",

  imports: [EmptyState, MobileEmptyState],
  changeDetection: ChangeDetectionStrategy.Eager,
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
      <lux-empty-state-web
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
