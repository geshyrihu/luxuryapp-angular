import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export type PreviewMode = "desktop" | "mobile";

/**
 * AppEmailPreview — Vista previa de plantilla de email estilo cliente de correo.
 * Muestra cabecera (de, para, asunto) y cuerpo HTML en iframe sandbox.
 * Soporta toggle desktop/mobile para responsive preview.
 */
@Component({
  selector: "app-email-preview",

  imports: [ButtonModule, TagModule, AppIcon],
  template: `
    <div class="ep-root">
      <!-- Toolbar -->
      <div class="ep-toolbar">
        <span class="ep-toolbar-title">Vista previa de email</span>
        <div class="ep-toolbar-actions">
          <button
            class="ep-mode-btn"
            [class.ep-mode-active]="mode === 'desktop'"
            (click)="mode = 'desktop'"
            title="Vista escritorio"
          >
            <app-icon icon="material-symbols-light:desktop-windows" />
          </button>
          <button
            class="ep-mode-btn"
            [class.ep-mode-active]="mode === 'mobile'"
            (click)="mode = 'mobile'"
            title="Vista móvil"
          >
            <app-icon icon="material-symbols-light:devices-other" />
          </button>
        </div>
      </div>

      <!-- Email client frame -->
      <div class="ep-frame" [class.ep-frame-mobile]="mode === 'mobile'">
        <!-- Email header (client UI) -->
        <div class="ep-email-header">
          <div class="ep-field">
            <span class="ep-field-label">De:</span>
            <span class="ep-field-value">{{ from() }}</span>
          </div>
          <div class="ep-field">
            <span class="ep-field-label">Para:</span>
            <span class="ep-field-value">{{ to() }}</span>
          </div>
          @if (cc()) {
            <div class="ep-field">
              <span class="ep-field-label">CC:</span>
              <span class="ep-field-value">{{ cc() }}</span>
            </div>
          }
          <div class="ep-subject">
            <span class="ep-field-label">Asunto:</span>
            <strong class="ep-field-value">{{ subject() }}</strong>
          </div>
          @if (tags().length > 0) {
            <div class="ep-tags">
              @for (tag of tags(); track tag) {
                <p-tag
                  [value]="tag"
                  severity="secondary"
                  styleClass="text-xs"
                />
              }
            </div>
          }
        </div>

        <!-- Email body via iframe sandbox -->
        <div class="ep-body">
          @if (htmlContent()) {
            <iframe
              class="ep-iframe"
              sandbox="allow-same-origin"
              [srcdoc]="safeHtml()"
              title="Vista previa del email"
            ></iframe>
          } @else if (plainText()) {
            <div class="ep-plain-text">{{ plainText() }}</div>
          } @else {
            <div class="ep-empty">
              <app-icon icon="material-symbols-light:mail-outline" class="text-3xl" />
              <span>Sin contenido de email</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .ep-root {
        display: flex;
        flex-direction: column;
        gap: 0;
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }
      /* Toolbar */
      .ep-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.875rem;
        background: var(--ds-bg-elevated);
        border-bottom: 1px solid var(--ds-border);
      }
      .ep-toolbar-title {
        font-size: var(--ds-font-size-help);
        font-weight: 600;
        color: var(--ds-text-secondary);
      }
      .ep-toolbar-actions {
        display: flex;
        gap: 0.25rem;
      }
      .ep-mode-btn {
        width: 28px;
        height: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid transparent;
        border-radius: var(--ds-radius-sm);
        background: none;
        cursor: pointer;
        color: var(--ds-text-muted);
        font-size: 1rem;
        transition: all 0.15s;
      }
      .ep-mode-btn:hover {
        background: var(--ds-bg-surface);
        color: var(--ds-primary);
      }
      .ep-mode-active {
        background: var(--ds-bg-surface);
        color: var(--ds-primary);
        border-color: var(--ds-primary);
      }
      /* Frame */
      .ep-frame {
        background: var(--ds-bg-surface);
        transition: max-width 0.3s ease;
        margin: 0 auto;
        width: 100%;
      }
      .ep-frame-mobile {
        max-width: 375px;
        border-left: 1px solid var(--ds-border);
        border-right: 1px solid var(--ds-border);
      }
      /* Email header */
      .ep-email-header {
        padding: 1rem;
        border-bottom: 1px solid var(--ds-border);
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
      }
      .ep-field {
        display: flex;
        gap: 0.5rem;
        align-items: baseline;
      }
      .ep-subject {
        display: flex;
        gap: 0.5rem;
        align-items: baseline;
        margin-top: 0.25rem;
      }
      .ep-field-label {
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-muted);
        width: 42px;
        flex-shrink: 0;
      }
      .ep-field-value {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-primary);
      }
      .ep-subject .ep-field-value {
        font-size: var(--ds-font-size-label);
      }
      .ep-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.25rem;
        padding-top: 0.25rem;
      }
      /* Body */
      .ep-body {
        min-height: 300px;
      }
      .ep-iframe {
        width: 100%;
        height: 400px;
        border: none;
        display: block;
      }
      .ep-plain-text {
        padding: 1rem;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
        white-space: pre-wrap;
        line-height: 1.6;
      }
      .ep-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 3rem;
        color: var(--ds-text-muted);
        font-size: var(--ds-font-size-help);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppEmailPreview {
  from = input<string>("");
  to = input<string>("");
  cc = input<string>("");
  subject = input<string>("(Sin asunto)");
  htmlContent = input<string>("");
  plainText = input<string>("");
  tags = input<string[]>([]);

  mode: PreviewMode = "desktop";

  safeHtml = computed(() => {
    const html = this.htmlContent();
    if (!html) return "";
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:Arial,sans-serif;font-size:14px;color:black;margin:0;padding:16px;}</style></head><body>${html}</body></html>`;
  });
}
