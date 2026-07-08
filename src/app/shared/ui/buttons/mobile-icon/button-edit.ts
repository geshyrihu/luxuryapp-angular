import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ii-button-edit",

  imports: [CommonModule, IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:pencil-outline'" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconEdit extends MobileButtonBase {}
