import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IliButtonBase } from "./ili-button-base";

@Component({
  selector: "ili-button-edit",
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
      (click)="onClick($event)"
    >
      <app-icon [icon]="iconClass() || 'mdi:pencil-outline'" slot="start" />
      {{ label() || "Editar" }}
    </ion-button>
  `,
})
export class IliButtonEdit extends IliButtonBase {}
