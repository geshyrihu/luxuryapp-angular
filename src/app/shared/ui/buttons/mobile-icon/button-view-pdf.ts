import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { openPdf } from "../shared/pdf";

@Component({
  selector: "ii-button-view-pdf",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="handleClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:file-pdf-box'" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconViewPdf extends MobileButtonBase {
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
