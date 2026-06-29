import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { BaseIonicButton } from "../../shared/buttons/base/base-ionic-button";

@Component({
  selector: "ion-button-item",
  imports: [CommonModule, IonItem, IonLabel, IonIcon],
  template: `
    <ion-item button detail="false" lines="none"
      [disabled]="disabled()" [class]="customClass()"
      (click)="onClick($event)"
      style="--background:#f8fafc;--background-activated:#f1f5f9;--border-radius:14px;
             --padding-start:10px;--inner-padding-end:14px;--min-height:54px;
             margin-bottom:6px;box-shadow:0 1px 4px rgba(0,0,0,0.07);"
    >
      @if (emoji() || ionicIcon()) {
        <div slot="start"
          style="width:38px;height:38px;border-radius:10px;background:#e2e8f0;
                 display:flex;align-items:center;justify-content:center;margin-right:4px;flex-shrink:0;">
          @if (emoji()) {
            <span style="font-size:20px;">{{ emoji() }}</span>
          } @else {
            <ion-icon [name]="ionicIcon()" style="font-size:20px;color:#475569;" />
          }
        </div>
      }
      <ion-label style="font-weight:600;font-size:15px;color:var(--secondary-800);">
        {{ label() || "Acción" }}
      </ion-label>
    </ion-item>
  `,
})
export class IonButtonItem extends BaseIonicButton {
  ionicIcon = input<string>("");
}


