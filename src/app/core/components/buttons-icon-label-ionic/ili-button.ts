import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../shared/app-icon/app-icon.component";
import { IliButtonBase } from "./ili-button-base";

@Component({
  selector: "ili-button",
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
      @if (iconClass()) {
        <app-icon [icon]="iconClass()" slot="start" />
      }
      {{ label() || "Continuar" }}
    </ion-button>
  `,
})
export class IliButton extends IliButtonBase {}
