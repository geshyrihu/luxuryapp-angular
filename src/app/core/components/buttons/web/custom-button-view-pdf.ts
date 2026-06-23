import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline, documentOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { DialogHandlerService } from "../../../services/dialog-handler.service";
import { PdfViewerModal } from "../../pdf-viewer-modal/pdf-viewer-modal";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-view-pdf",
  imports: [CommonModule, TooltipModule, AppIcon, IonItem, IonLabel, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-item button detail="false" lines="none"
        [disabled]="disabled()" [class]="customClass()"
        (click)="viewPdf()"
        style="--background:#f8fafc;--background-activated:#f1f5f9;--border-radius:14px;
               --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
               margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
      >
        <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#e2e8f0;
             display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
          <ion-icon name="document-outline" style="font-size:20px;color:#475569;" />
        </div>
        <ion-label style="font-weight:600;font-size:15px;color:#1e293b;">
          {{ label() || "Ver archivo" }}
        </ion-label>
        <ion-icon name="chevron-forward-outline" slot="end" style="color:#94a3b8;font-size:16px;" />
      </ion-item>
    } @else {
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
    }
  `,
})
export class CustomButtonViewPdf extends BaseButton {
  protected readonly platform = inject(PlatformService);
  private readonly dialogHandlerS = inject(DialogHandlerService);

  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(false);

  url = input<string>("");
  fileName = input<string>("");
  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:file-pdf");

  constructor() {
    super();
    addIcons({ documentOutline, chevronForwardOutline });
  }

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
