import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "../../app-icon/app-icon.component";
import { DialogHandlerService } from "../../../services/dialog-handler.service";
import { PdfViewerModal } from "../../pdf-viewer-modal/pdf-viewer-modal";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-view-pdf",
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="btnClasses() + ' ' + customClass()"
      [ngClass]="customNgClass()"
      (click)="viewPdf()"
      [pTooltip]="ngbTooltip() || label() || 'Ver archivo'"
      tooltipPosition="top"
    >
      <span [class]="iconShellClasses(showLabelOnDesktop())" aria-hidden="true">
        <app-icon [icon]="finalIcon()" />
      </span>
      @if (showLabelOnDesktop()) {
        <span class="text-xs">{{ label() || "Ver archivo" }}</span>
      }
    </button>
  `,
})
export class CustomButtonViewPdf extends BaseButton {
  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(false);

  dialogHandlerS = inject(DialogHandlerService);
  url = input<string>("");
  fileName = input<string>("");

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:file-pdf");

  viewPdf(): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: this.url(), fileName: this.fileName() },
      this.fileName(),
      this.dialogHandlerS.sizeFull,
      true,
    );
  }
}
