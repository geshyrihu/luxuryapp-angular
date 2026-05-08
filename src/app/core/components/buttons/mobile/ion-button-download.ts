import { Component, input } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { downloadOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-download",
  imports: [IonButton, IonIcon],
  template: `
    @if (mostrar()) {
      <ion-button
        [disabled]="disabled()"
        fill="clear"
        size="small"
        (click)="onClick($event)"
        style="
          --border-radius: 10px;
          --background: #e2e8f0;
          --background-activated: #cbd5e1;
          --color: #475569;
          --padding-start: 10px;
          --padding-end: 10px;
          width: 40px; height: 40px;
        "
      >
        <ion-icon name="download-outline" slot="icon-only"
          style="font-size: 18px;">
        </ion-icon>
      </ion-button>
    }
  `,
})
export class IonButtonDownload extends BaseIonicButton {
  override color = input<string>("medium");
  override fill = input<"solid" | "outline" | "clear" | "default">("clear");

  constructor() {
    super();
    addIcons({ downloadOutline });
  }
}









