import { CommonModule } from "@angular/common";
import { Component, computed, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IliButtonBase } from "./ili-button-base";

@Component({
  selector: "ili-button-save",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="fill()"
      color="success"
      [size]="size()"
      [disabled]="disabled() || submitting()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      <app-icon [icon]="propertyId() ? 'mdi:content-save-edit-outline' : 'mdi:content-save-outline'" slot="start" />
      {{ finalLabel() }}
    </ion-button>
  `,
})
export class IliButtonSave extends IliButtonBase {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
