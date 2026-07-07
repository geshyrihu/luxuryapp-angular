import { CommonModule } from "@angular/common";
import { Component, computed, input, ChangeDetectionStrategy } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ii-button-save",
  standalone: true,
  imports: [CommonModule, IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || submitting()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      <app-icon
        [icon]="
          propertyId()
            ? 'mdi:content-save-edit-outline'
            : 'mdi:content-save-outline'
        "
        slot="icon-only"
      />
    </ion-button>
  `,
})
export class MobileButtonIconSave extends MobileButtonBase {
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);
}

