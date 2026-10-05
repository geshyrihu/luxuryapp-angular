import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";
import type { ButtonDisplayMode } from "@ui/buttons/base/base-button";

type PdfTriggerSeverity =
  | "primary"
  | "secondary"
  | "success"
  | "info"
  | "warning"
  | "danger";
type PdfTriggerVariant = "solid" | "outline" | "soft" | "text" | "link";
type PdfTriggerSize = "sm" | "md" | "lg" | "small" | "large";

/**
 * 🔗 PDF VIEWER TRIGGER
 * -------------------------------------------------------------------------
 * Puente semántico entre la API moderna "tonta" (`lux-button-web kind="view-pdf"`)
 * y el visor global (`PdfViewerModal`). Reemplaza a los botones legacy
 * `il/iw-button-view-pdf`, que abrían el visor internamente.
 *
 * Mantiene el contrato heredado: recibe `url` + `fileName`, pinta el botón con
 * la severidad/variante por defecto del legacy (secondary/soft) y abre el modal
 * en el `(clicked)`. El visor se carga de forma diferida para no arrastrar
 * ng2-pdf-viewer al bundle inicial.
 */
@Component({
  selector: "lux-pdf-viewer-trigger",
  imports: [ButtonWeb],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <lux-button-web
      kind="view-pdf"
      [displayMode]="displayMode()"
      [label]="resolvedLabel()"
      [iconClass]="iconClass()"
      [severity]="severity()"
      [variant]="variant()"
      [size]="size()"
      [tooltip]="tooltip()"
      [ariaLabel]="ariaLabel()"
      [styleClass]="styleClass()"
      [disabled]="disabled()"
      [loading]="loading()"
      (clicked)="open($event)"
    />
  `,
})
export class PdfViewerTrigger {
  url = input<string>("");
  fileName = input<string>("");
  label = input<string>("");
  iconClass = input<string>("");
  displayMode = input<ButtonDisplayMode>("both");
  severity = input<PdfTriggerSeverity>("secondary");
  variant = input<PdfTriggerVariant>("soft");
  size = input<PdfTriggerSize>("md");
  tooltip = input<string>("");
  ariaLabel = input<string>("");
  styleClass = input<string>("");
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<Event>();

  /** Legacy: `il-` mostraba "Ver archivo"; `iw-` (icon-only) no mostraba nada. */
  protected readonly resolvedLabel = computed(
    () => this.label() || (this.displayMode() === "icon" ? "" : "Ver archivo"),
  );

  private readonly dialogHandlerS = inject(DialogHandlerService);

  protected open(event: Event): void {
    const url = this.url();
    if (!url) {
      this.clicked.emit(event);
      return;
    }
    void this.openViewer(url);
  }

  /** Abre el PDF en el visor modal (lazy-load). */
  private async openViewer(url: string): Promise<void> {
    const { PdfViewerModal } =
      await import("@ui/web/pdf-viewer-modal/pdf-viewer-modal");
    void this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: this.fileName() },
      this.fileName() || "Documento",
      this.dialogHandlerS.sizeFull,
      true,
    );
  }
}
