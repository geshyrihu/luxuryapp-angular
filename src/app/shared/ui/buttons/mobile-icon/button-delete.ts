import { CommonModule } from "@angular/common";
import { Component, input, output, ChangeDetectionStrategy } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "ii-button-delete",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="confirmDelete($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:delete-outline'" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconDelete extends MobileButtonBase {
  override color = input<string>("danger");
  confirmHeader = input<string>("Confirmar eliminacion");
  confirmMessage = input<string>("Estas seguro de eliminar este registro?");
  confirmed = output<void>();

  protected confirmDelete(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.confirmMessage())) {
      this.confirmed.emit();
    }
  }
}

