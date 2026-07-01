import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button-active-desactive",
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
      (click)="toggleState()"
    >
      <app-icon
        [icon]="state() ? 'mdi:lock-outline' : 'mdi:lock-open-variant-outline'"
        slot="start"
      />
      {{ state() ? inactivasLabel() : activasLabel() }}
    </ion-button>
  `,
})
export class MobileButtonLabelActiveDesactive extends MobileButtonBase {
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
