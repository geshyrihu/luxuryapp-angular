import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { openPdf } from "../shared/pdf";

@Component({
  selector: "ii-button-view-pdf",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [fill]="fill()"
      [color]="color()"
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

