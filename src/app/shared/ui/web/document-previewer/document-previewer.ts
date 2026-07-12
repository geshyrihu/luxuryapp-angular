import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-document-previewer",

  imports: [AppIcon],
  template: `
    <div class="doc-previewer-root">
      <div class="doc-previewer-toolbar">
        <strong class="doc-previewer-filename">{{ fileName() }}</strong>
        <div class="doc-previewer-actions">
          @if (downloadUrl()) {
            <a
              [href]="downloadUrl()"
              [download]="fileName()"
              class="doc-previewer-btn"
              title="Descargar"
            >
              <app-icon icon="mdi:download" />
            </a>
          }
          @if (printable()) {
            <button
              class="doc-previewer-btn"
              (click)="print()"
              title="Imprimir"
            >
              <app-icon icon="mdi:printer" />
            </button>
          }
        </div>
      </div>
      <div class="doc-previewer-viewport">
        @if (src()) {
          <iframe
            class="doc-previewer-iframe"
            [src]="src()"
            [title]="fileName()"
          ></iframe>
        } @else {
          <div class="doc-previewer-empty">
            <app-icon icon="mdi:file-document-outline" class="text-4xl" />
            <p>Vista previa no disponible</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .doc-previewer-root {
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 400px;
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
        overflow: hidden;
      }
      .doc-previewer-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.5rem 0.75rem;
        background: var(--ds-bg-elevated, #f4f5f8);
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .doc-previewer-filename {
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-primary);
      }
      .doc-previewer-actions {
        display: flex;
        gap: 0.25rem;
      }
      .doc-previewer-btn {
        display: inline-flex;
        padding: 0.375rem;
        border: none;
        background: none;
        cursor: pointer;
        color: var(--ds-text-secondary);
        border-radius: var(--ds-radius-md, 6px);
        font-size: 1.125rem;
        transition: background 0.1s;
      }
      .doc-previewer-btn:hover {
        background: var(--ds-bg-hover, #f0f4ff);
      }
      .doc-previewer-viewport {
        flex: 1;
        display: flex;
      }
      .doc-previewer-iframe {
        width: 100%;
        height: 100%;
        border: none;
      }
      .doc-previewer-empty {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 0.5rem;
        color: var(--ds-text-muted);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class DocumentPreviewer {
  src = input<string>("");
  fileName = input<string>("documento");
  downloadUrl = input<string>("");
  printable = input<boolean>(true);

  print(): void {
    const iframe = document.querySelector(
      ".doc-previewer-iframe",
    ) as HTMLIFrameElement | null;
    iframe?.contentWindow?.print();
  }
}
