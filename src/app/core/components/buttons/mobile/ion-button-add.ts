import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { addOutline, chevronForwardOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-add",
  imports: [CommonModule, IonItem, IonLabel, IonIcon],
  template: `
    <ion-item button detail="false" lines="none"
      [disabled]="disabled()" [class]="customClass()"
      (click)="onClick($event)"
      style="--background:#eef3ff;--background-activated:#dbeafe;--border-radius:14px;
             --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
             margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
    >
      <div slot="start" style="width:38px;height:38px;border-radius:10px;background:#bfdbfe;
           display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
        <ion-icon name="add-outline" style="font-size:20px;color:#1d4ed8;" />
      </div>
      <ion-label style="font-weight:600;font-size:15px;color:#1e293b;">
        {{ label() || "Agregar" }}
      </ion-label>
      <ion-icon name="chevron-forward-outline" slot="end" style="color:#94a3b8;font-size:16px;" />
    </ion-item>
  `,
})
export class IonButtonAdd extends BaseIonicButton {
  constructor() {
    super();
    addIcons({ addOutline, chevronForwardOutline });
  }
}
