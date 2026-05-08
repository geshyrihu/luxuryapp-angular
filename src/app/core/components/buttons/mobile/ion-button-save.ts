import { Component, computed, input } from "@angular/core";
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cloudUploadOutline, saveOutline, syncOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-save",
  imports: [IonButton, IonIcon, IonSpinner],
  template: `
    @if (mostrar()) {
      <ion-button
        [disabled]="disabled() || submitting()"
        [expand]="expand() ?? 'block'"
        (click)="onClick($event)"
        type="submit"
        style="
          --border-radius: 14px;
          --background: linear-gradient(135deg, var(--primary-400, #6687b3), var(--primary-500, #0b3164));
          --background-activated: var(--primary-600, #092953);
          --box-shadow: 0 4px 16px rgba(21,94,192,0.35);
          --color: #ffffff;
          height: 52px;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.4px;
        "
      >
        @if (submitting()) {
          <ion-spinner name="crescent" style="color: #fff; width: 20px; height: 20px;"></ion-spinner>
        } @else {
          <ion-icon [name]="finalIcon()" slot="start"></ion-icon>
          {{ finalLabel() }}
        }
      </ion-button>
    }
  `,
})
export class IonButtonSave extends BaseIonicButton {
  override color = input<string>("primary");
  override fill = input<"solid" | "outline" | "clear" | "default">("solid");

  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });

  finalIcon = computed(() =>
    this.propertyId() ? "sync-outline" : "save-outline",
  );

  constructor() {
    super();
    addIcons({ saveOutline, syncOutline, cloudUploadOutline });
  }
}









