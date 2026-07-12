// @ts-nocheck

import { Component, inject, input, signal } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
import { GlobalErrorService } from "src/app/core/http/services/global-error-handler.service";

@Component({
  selector: "app-error-boundary",

  imports: [ButtonModule, AppIcon],
  template: `
    @if (hasError()) {
      <div class="error-boundary-root">
        <div class="error-boundary-content">
          <app-icon
            icon="mdi:alert-circle-outline"
            class="error-boundary-icon"
          />
          <strong class="error-boundary-title">{{ title() }}</strong>
          <p class="error-boundary-message">{{ message() }}</p>
          @if (showRetry()) {
            <p-button
              [label]="retryLabel()"
              icon="mdi:refresh"
              severity="warn"
              (onClick)="onRetry()"
            />
          }
          @if (showDetails()) {
            <details class="error-boundary-details">
              <summary>Detalles técnicos</summary>
              <pre>{{ errorDetails() }}</pre>
            </details>
          }
        </div>
      </div>
    } @else {
      <ng-content />
    }
  `,
  styles: [
    `
      .error-boundary-root {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        padding: 2rem;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
        background: var(--ds-bg-surface, #ffffff);
      }
      .error-boundary-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        text-align: center;
      }
      .error-boundary-icon {
        font-size: 2.5rem;
        color: var(--ds-danger, #ba1a1a);
      }
      .error-boundary-title {
        font-size: var(--ds-font-size-card-title, 1rem);
        color: var(--ds-text-primary, #041b3c);
      }
      .error-boundary-message {
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-secondary, #434654);
        margin: 0;
      }
      .error-boundary-details {
        width: 100%;
        margin-top: 0.5rem;
        text-align: left;
      }
      .error-boundary-details summary {
        cursor: pointer;
        font-size: var(--ds-font-size-help, 0.8125rem);
        color: var(--ds-text-muted, #737685);
      }
      .error-boundary-details pre {
        font-size: var(--ds-font-size-micro, 0.75rem);
        background: var(--ds-bg-sunken, #e8edff);
        padding: 0.75rem;
        border-radius: var(--ds-radius-sm, 4px);
        overflow-x: auto;
        white-space: pre-wrap;
        word-break: break-all;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class ErrorBoundary {
  private errorService = inject(GlobalErrorService);
  private retryCount = 0;

  title = input<string>("Algo salió mal");
  message = input<string>(
    "Ocurrió un error inesperado. Intenta de nuevo o contacta al administrador.",
  );
  retryLabel = input<string>("Reintentar");
  showRetry = input<boolean>(true);
  showDetails = input<boolean>(false);
  maxRetries = input<number>(3);

  hasError = signal(false);
  errorDetails = signal<string>("");

  constructor() {
    this.errorService.lastError.subscribe((err) => {
      if (err && !err.handled) {
        this.hasError.set(true);
        this.errorDetails.set(err.stack || err.message);
      }
    });
  }

  onRetry(): void {
    if (this.retryCount >= this.maxRetries()) return;
    this.retryCount++;
    this.errorService.markHandled();
    this.hasError.set(false);
    this.errorDetails.set("");
  }
}
