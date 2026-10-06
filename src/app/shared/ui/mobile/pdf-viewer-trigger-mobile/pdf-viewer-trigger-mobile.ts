import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
} from "@angular/core";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { ButtonMobile } from "@ui/buttons/mobile";
import type { ButtonDisplayMode } from "@ui/buttons/base/base-button";

@Component({
  selector: "lux-pdf-viewer-trigger-mobile",
  imports: [ButtonMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <lux-button-mobile
      kind="view-pdf"
      [displayMode]="displayMode()"
      [label]="resolvedLabel()"
      [iconClass]="iconClass()"
      [variant]="variant()"
      [color]="color()"
      [fill]="fill()"
      [size]="size()"
      [styleClass]="styleClass()"
      [ariaLabel]="ariaLabel()"
      [disabled]="disabled()"
      [loading]="loading()"
      (clicked)="open($event)"
    />
  `,
})
export class PdfViewerTriggerMobile {
  url = input<string>("");
  fileName = input<string>("");
  label = input<string>("");
  iconClass = input<string>("");
  displayMode = input<ButtonDisplayMode>("both");
  variant = input<string>("");
  color = input<string>("primary");
  fill = input<"clear" | "outline" | "solid" | "default">("solid");
  size = input<"small" | "default" | "large">("default");
  styleClass = input<string>("");
  ariaLabel = input<string>("");
  disabled = input<boolean>(false);
  loading = input<boolean>(false);
  clicked = output<Event>();

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
