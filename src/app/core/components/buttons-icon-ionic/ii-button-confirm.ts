import { CommonModule } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IiButtonBase } from "./ii-button-base";

@Component({
  selector: "ii-button-confirm",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [fill]="fill()"
      [color]="color()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmAction($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:check-circle-outline'" slot="icon-only" />
    </ion-button>
  `,
})
export class IiButtonConfirm extends IiButtonBase {
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  protected confirmAction(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (window.confirm(this.swalText())) {
      this.confirmed.emit();
    }
  }
}
