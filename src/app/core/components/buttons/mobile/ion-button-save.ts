import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { saveOutline, syncOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-save",
  imports: [CommonModule, IonButton, IonIcon, IonSpinner],
  template: `
    <ion-button
      [disabled]="disabled() || submitting()"
      expand="block"
      type="submit"
      style="
        --border-radius: 14px;
        --background: linear-gradient(135deg, var(--ion-color-primary-shade, #6687b3), var(--ion-color-primary, #0b3164));
        --background-activated: var(--ion-color-primary-shade, #092953);
        --box-shadow: 0 4px 16px rgba(21,94,192,0.35);
        --color: #ffffff;
        height: 52px;
        font-weight: 700;
        font-size: 15px;
        letter-spacing: 0.4px;
      "
      (click)="onClick($event)"
    >
      @if (submitting()) {
        <ion-spinner name="crescent" style="color:#fff;width:20px;height:20px;" />
      } @else {
        <ion-icon [name]="finalIonicIcon()" slot="start" />
        {{ finalLabel() }}
      }
    </ion-button>
  `,
})
export class IonButtonSave extends BaseIonicButton {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });

  finalIonicIcon = computed(() => this.propertyId() ? "sync-outline" : "save-outline");

  constructor() {
    super();
    addIcons({ saveOutline, syncOutline });
  }
}
