import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from "@angular/core";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "iw-button-view-pdf",

  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <button
      type="button"
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="handleClick($event)"
    >
      <app-icon [icon]="iconClass() || 'fluent-color:document-16'" />
    </button>
  `,
})
export class WebButtonIconViewPdf extends BaseButton {
  url = input<string>("");
  fileName = input<string>("");

  override variant = input<"solid" | "outline" | "ghost" | "text" | "link">(
    "ghost",
  );
  override severity = input<any>("secondary");

  private readonly dialogHandlerS = inject(DialogHandlerService);

  protected handleClick(event: Event): void {
    const url = this.url();
    if (url) {
      void this.openViewer(url);
      return;
    }
    this.emitClick(event);
  }

  /** Abre el PDF en el visor modal (lazy-load para no cargar ng2-pdf-viewer siempre). */
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
