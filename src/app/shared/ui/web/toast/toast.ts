import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MessageService } from "src/app/core/services/message.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { AppIconName } from "src/app/shared/ui/shared/app-icon/app-icon.catalog";

@Component({
  selector: "app-toast",
  imports: [AppIcon],
  template: `
    <div class="toast-container position-fixed top-0 start-0 p-3" style="z-index: 99999">
      @for (msg of messageService.messages(); track msg.id) {
        <div class="toast show app-toast" [class]="'app-toast-' + (msg.severity || 'info')" role="alert">
          <div class="toast-header">
            <app-icon [icon]="icon(msg.severity)" class="me-2" />
            <strong class="me-auto">{{ msg.summary }}</strong>
            <button type="button" class="btn-close" aria-label="Cerrar" (click)="messageService.remove(msg.id)"></button>
          </div>
          @if (msg.detail || msg.data?.actionLabel || msg.data?.cancelLabel) {
            <div class="toast-body">
              @if (msg.detail) {
                <div>{{ msg.detail }}</div>
              }
              @if (msg.data?.actionLabel || msg.data?.cancelLabel) {
                <div class="d-flex gap-2 mt-2">
                  @if (msg.data?.actionLabel) {
                    <button type="button" class="btn btn-sm btn-primary" (click)="msg.data?.onAction?.()">
                      {{ msg.data?.actionLabel }}
                    </button>
                  }
                  @if (msg.data?.cancelLabel) {
                    <button type="button" class="btn btn-sm btn-outline-secondary" (click)="msg.data?.onCancel?.()">
                      {{ msg.data?.cancelLabel }}
                    </button>
                  }
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .app-toast {
        min-width: 300px;
        margin-bottom: 0.5rem;
        --bs-toast-bg: var(--ds-bg-surface);
        --bs-toast-header-bg: var(--ds-bg-surface);
      }
      .app-toast-success { border-left: 4px solid var(--ds-success); }
      .app-toast-info { border-left: 4px solid var(--ds-info); }
      .app-toast-warn { border-left: 4px solid var(--ds-warning); }
      .app-toast-error { border-left: 4px solid var(--ds-danger); }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToast {
  protected messageService = inject(MessageService);

  protected icon(severity?: string): AppIconName {
    const map: Record<string, AppIconName> = {
      success: "material-symbols-light:check-circle-outline",
      info: "material-symbols-light:info",
      warn: "material-symbols-light:warning-outline",
      error: "material-symbols-light:error-outline",
    };
    return map[severity ?? "info"] ?? map["info"];
  }
}
