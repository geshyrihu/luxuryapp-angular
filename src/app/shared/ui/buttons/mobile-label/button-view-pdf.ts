import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";
import { openPdf } from "../shared/pdf";

@Component({
  selector: "ili-button-view-pdf",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="handleClick($event)"
    >
      <app-icon [icon]="resolvedIconClass() || IconCatalog.FilePdf" slot="start" />
      {{ label() || "Ver archivo" }}
    </ion-button>
  `,
})
export class MobileButtonLabelViewPdf extends MobileButtonBase {
  protected readonly IconCatalog = AppIconCatalog;
  url = input<string>("");
  fileName = input<string>("");

  protected handleClick(event: Event): void {
    if (this.url()) {
      openPdf(this.url());
      return;
    }
    this.onClick(event);
  }
}
