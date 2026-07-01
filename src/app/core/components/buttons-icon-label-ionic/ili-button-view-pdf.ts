import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IliButtonBase } from "./ili-button-base";

@Component({
  selector: "ili-button-view-pdf",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="fill()"
      [color]="color()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="openPdf($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:file-pdf-box'" slot="start" />
      {{ label() || "Ver archivo" }}
    </ion-button>
  `,
})
export class IliButtonViewPdf extends IliButtonBase {
  url = input<string>("");
  fileName = input<string>("");

  protected openPdf(event: Event): void {
    if (this.url()) {
      window.open(this.url(), "_blank");
      return;
    }
    this.onClick(event);
  }
}
