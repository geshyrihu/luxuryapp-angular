import { Component, input } from "@angular/core";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addOutline, chevronForwardOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-add",
  imports: [IonItem, IonLabel, IonIcon, IonFab, IonFabButton],
  template: `
    @if (mostrar()) {
      @if (fabMode()) {
        <ion-fab vertical="bottom" horizontal="end" slot="fixed">
          <ion-fab-button
            [color]="color()"
            (click)="onClick($event)"
            [disabled]="disabled()"
            style="--border-radius: 16px; --box-shadow: 0 6px 20px rgba(21,94,192,0.35);"
          >
            <ion-icon name="add-outline"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      } @else {
        <ion-item
          button
          detail="false"
          lines="none"
          [disabled]="disabled()"
          [class]="customClass()"
          (click)="onClick($event)"
          style="
            --background: #eef3ff;
            --background-activated: #dbeafe;
            --border-radius: 14px;
            --padding-start: 10px;
            --inner-padding-end: 14px;
            --min-height: 54px;
            margin-bottom: 6px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.07);
          "
        >
          <div slot="start" style="
            width: 38px; height: 38px; border-radius: 10px;
            background: #bfdbfe; display: flex; align-items: center;
            justify-content: center; margin-right: 4px; flex-shrink: 0;
          ">
            <ion-icon
              [name]="iconName() || 'add-outline'"
              style="font-size: 20px; color: #1d4ed8;"
            ></ion-icon>
          </div>
          <ion-label style="font-weight: 600; font-size: 15px; color: #1e293b;">
            {{ label() || "Agregar" }}
          </ion-label>
          <ion-icon name="chevron-forward-outline" slot="end"
            style="color: #94a3b8; font-size: 16px;">
          </ion-icon>
        </ion-item>
      }
    }
  `,
})
export class IonButtonAdd extends BaseIonicButton {
  fabMode = input<boolean>(false);
  override color = input<string>("primary");

  constructor() {
    super();
    addIcons({ addOutline, chevronForwardOutline });
  }
}









