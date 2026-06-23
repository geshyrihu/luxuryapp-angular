import { CommonModule } from "@angular/common";
import { Component, computed, inject, input } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { downloadOutline } from "ionicons/icons";
import { TooltipModule } from "primeng/tooltip";
import { PlatformService } from "src/app/core/services/platform.service";
import { AppIcon } from "../../app-icon/app-icon.component";
import { BaseButton } from "../base/base-button";

@Component({
  selector: "custom-button-download",
  imports: [CommonModule, TooltipModule, AppIcon, IonButton, IonIcon],
  template: `
    @if (platform.isMobile()) {
      <ion-button
        [disabled]="disabled()"
        fill="clear"
        size="small"
        (click)="clicked.emit($event)"
        style="--border-radius:10px;--background:#e2e8f0;--background-activated:#cbd5e1;
               --color:#475569;--padding-start:10px;--padding-end:10px;width:40px;height:40px;"
      >
        <ion-icon name="download-outline" slot="icon-only" style="font-size:18px;" />
      </ion-button>
    } @else {
      <button
        [type]="type()"
        [disabled]="disabled()"
        [class]="btnClasses() + ' ' + customClass()"
        [ngClass]="customNgClass()"
        (click)="onClick($event)"
        [pTooltip]="ngbTooltip() || label() || 'Descargar'"
        tooltipPosition="top"
      >
        <span [class]="iconShellClasses(showLabelOnDesktop() && !!label())" aria-hidden="true">
          <app-icon [icon]="finalIcon()" />
        </span>
        @if (showLabelOnDesktop() && label()) {
          <span>{{ label() }}</span>
        }
      </button>
    }
  `,
})
export class CustomButtonDownload extends BaseButton {
  protected readonly platform = inject(PlatformService);

  override text = input<boolean>(true);
  override severity = input<any>("secondary");
  override rounded = input<boolean>(true);

  finalIcon = computed(() => this.icon() || this.iconClass() || "mdi:download");

  constructor() {
    super();
    addIcons({ downloadOutline });
  }
}
