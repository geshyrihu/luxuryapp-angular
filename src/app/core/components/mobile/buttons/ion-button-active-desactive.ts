import { CommonModule } from "@angular/common";
import { Component, computed, input, output } from "@angular/core";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { lockClosedOutline, lockOpenOutline } from "ionicons/icons";
import { BaseIonicButton } from "../../shared/buttons/base/base-ionic-button";

@Component({
  selector: "ion-button-active-desactive",
  imports: [CommonModule, IonButton, IonIcon],
  template: `
    <ion-button
      (click)="toggleState()"
      expand="block"
      [disabled]="disabled()"
      [style]="mobileStyle()"
    >
      <ion-icon [name]="mobileIcon()" slot="start" />
      {{ dynamicLabel() }}
    </ion-button>
  `,
})
export class IonButtonActiveDesactive extends BaseIonicButton {
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  dynamicLabel = computed(() =>
    this.state() ? this.inactivasLabel() : this.activasLabel(),
  );

  mobileIcon = computed(() =>
    this.state() ? "lock-closed-outline" : "lock-open-outline",
  );

  mobileStyle = computed(() =>
    this.state()
      ? `--border-radius:14px;--border-color:var(--secondary-400);--color:#64748b;--background:transparent;
         height:48px;font-weight:600;font-size:14px;`
      : `--border-radius:14px;--background:linear-gradient(135deg,var(--ion-color-primary-shade,#6687b3),var(--ion-color-primary,#0b3164));
         --color:#ffffff;--box-shadow:0 4px 14px color-mix(in srgb, var(--primary-600) 35%, transparent);height:48px;font-weight:700;font-size:14px;`,
  );

  toggleState(): void {
    this.stateChange.emit(!this.state());
  }

  constructor() {
    super();
    addIcons({ lockClosedOutline, lockOpenOutline });
  }
}


