import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "ii-button-confirm",

  imports: [CommonModule, IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="handleConfirm($event)"
    >
      <app-icon
        [icon]="iconClass() || 'mdi:check-circle-outline'"
        slot="icon-only"
      />
    </ion-button>
  `,
})
export class MobileButtonIconConfirm extends MobileButtonBase {
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  protected handleConfirm(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.swalText())) {
      this.confirmed.emit();
    }
  }
}
