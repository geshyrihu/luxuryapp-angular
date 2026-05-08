import { Component, computed, input, output } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { lockClosedOutline, lockOpenOutline } from "ionicons/icons";
import { BaseIonicButton } from "../base/base-ionic-button";

@Component({
  selector: "ion-button-active-desactive",
  imports: [IonButton, IonIcon],
  template: `
    @if (mostrar()) {
      <ion-button
        (click)="toggleState()"
        [expand]="expand() ?? 'block'"
        [disabled]="disabled()"
        [style]="dynamicStyle()"
      >
        <ion-icon [name]="dynamicIcon()" slot="start"></ion-icon>
        {{ dynamicLabel() }}
      </ion-button>
    }
  `,
})
export class IonButtonActiveDesactive extends BaseIonicButton {
  override fill = input<"solid" | "outline" | "clear" | "default">("outline");

  state = input<boolean>(true);
  activasLabel = input<string>("Activas");
  inactivasLabel = input<string>("Inactivas");

  stateChange = output<boolean>();

  dynamicLabel = computed(() =>
    this.state() ? this.inactivasLabel() : this.activasLabel(),
  );

  dynamicIcon = computed(() =>
    this.state() ? "lock-closed-outline" : "lock-open-outline",
  );

  dynamicStyle = computed(() =>
    this.state()
      ? `
          --border-radius: 14px;
          --border-color: #94a3b8;
          --color: #64748b;
          --background: transparent;
          height: 48px; font-weight: 600; font-size: 14px;
        `
      : `
          --border-radius: 14px;
          --background: linear-gradient(135deg, var(--primary-400, #6687b3), var(--primary-500, #0b3164));
          --color: #ffffff;
          --box-shadow: 0 4px 14px rgba(21,94,192,0.3);
          height: 48px; font-weight: 700; font-size: 14px;
        `
  );

  constructor() {
    super();
    addIcons({ lockClosedOutline, lockOpenOutline });
  }

  toggleState() {
    this.stateChange.emit(!this.state());
  }
}









