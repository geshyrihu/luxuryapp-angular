import { NgClass } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { MessageService } from "@core/services/message.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import type { AppIconName } from "@ui/shared/app-icon/app-icon.catalog";

@Component({
  selector: "app-toast",
  imports: [AppIcon, NgClass],
  template: `
    <div class="toast-container position-fixed top-0 start-0 p-3" style="z-index: 99999">
      @for (msg of messageService.messages(); track msg.id) {
        <div class="toast show app-toast" [ngClass]="'app-toast-' + (msg.severity || 'info')" role="alert">
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
                    <button type="button" class="btn btn-sm btn-primary" (click)="executeAction(msg)" [disabled]="isLoading(msg.id)">
                      @if (isLoading(msg.id)) {
                        <span class="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                        <span>Cargando...</span>
                      } @else {
                        {{ msg.data?.actionLabel }}
                      }
                    </button>
                  }
                  @if (msg.data?.cancelLabel) {
                    <button type="button" class="btn btn-sm btn-outline-secondary" (click)="executeCancel(msg)">
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
        display: block;
        --bs-toast-bg: var(--ds-bg-surface);
        --bs-toast-header-bg: var(--ds-bg-surface);
      }
      .app-toast .toast-header,
      .app-toast .toast-body {
        width: 100%;
        box-sizing: border-box;
      }
      .app-toast .toast-header,
      .app-toast .toast-body {
        background-color: transparent;
        color: inherit;
      }
      .app-toast-success {
        --bs-toast-bg: color-mix(in srgb, var(--ds-success) 12%, var(--ds-bg-surface));
        --bs-toast-header-bg: var(--bs-toast-bg);
        color: var(--ds-text-primary);
        border: 1px solid color-mix(in srgb, var(--ds-success) 30%, transparent);
        border-left: 4px solid var(--ds-success);
      }
      .app-toast-info {
        --bs-toast-bg: color-mix(in srgb, var(--ds-info) 12%, var(--ds-bg-surface));
        --bs-toast-header-bg: var(--bs-toast-bg);
        color: var(--ds-text-primary);
        border: 1px solid color-mix(in srgb, var(--ds-info) 30%, transparent);
        border-left: 4px solid var(--ds-info);
      }
      .app-toast-warn {
        --bs-toast-bg: color-mix(in srgb, var(--ds-warning) 14%, var(--ds-bg-surface));
        --bs-toast-header-bg: var(--bs-toast-bg);
        color: var(--ds-text-primary);
        border: 1px solid color-mix(in srgb, var(--ds-warning) 35%, transparent);
        border-left: 4px solid var(--ds-warning);
      }
      .app-toast-error {
        --bs-toast-bg: color-mix(in srgb, var(--ds-danger) 12%, var(--ds-bg-surface));
        --bs-toast-header-bg: var(--bs-toast-bg);
        color: var(--ds-text-primary);
        border: 1px solid color-mix(in srgb, var(--ds-danger) 30%, transparent);
        border-left: 4px solid var(--ds-danger);
      }
      .app-toast-success app-icon,
      .app-toast-success .toast-header strong { color: var(--ds-success); }
      .app-toast-info app-icon,
      .app-toast-info .toast-header strong { color: var(--ds-info); }
      .app-toast-warn app-icon,
      .app-toast-warn .toast-header strong { color: var(--ds-warning-text); }
      .app-toast-error app-icon,
      .app-toast-error .toast-header strong { color: var(--ds-danger); }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppToast {
  protected messageService = inject(MessageService);
  private loadingIds = signal<Set<number>>(new Set());

  protected icon(severity?: string): AppIconName {
    const map: Record<string, AppIconName> = {
      success: "material-symbols-light:check-circle-outline",
      info: "material-symbols-light:info",
      warn: "material-symbols-light:warning-outline",
      error: "material-symbols-light:error-outline",
    };
    return map[severity ?? "info"] ?? map["info"];
  }

  protected isLoading(id: number): boolean {
    return this.loadingIds().has(id);
  }

  protected executeAction(msg: { id: number; data?: { onAction?: () => Promise<void> | void; onCancel?: () => void } }): void {
    const action = msg.data?.onAction;
    if (!action) return;

    this.loadingIds.update((ids) => new Set(ids).add(msg.id));
    try {
      const result = action();
      if (result instanceof Promise) {
        result.finally(() => {
          this.loadingIds.update((ids) => {
            const next = new Set(ids);
            next.delete(msg.id);
            return next;
          });
        });
      } else {
        this.loadingIds.update((ids) => {
          const next = new Set(ids);
          next.delete(msg.id);
          return next;
        });
      }
    } catch {
      this.loadingIds.update((ids) => {
        const next = new Set(ids);
        next.delete(msg.id);
        return next;
      });
    }
  }

  protected executeCancel(msg: { id: number; data?: { onCancel?: () => void } }): void {
    msg.data?.onCancel?.();
  }
}
