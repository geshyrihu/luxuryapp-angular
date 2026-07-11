import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton, IonSpinner } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button",

  imports: [CommonModule, IonButton, IonSpinner, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [type]="type()"
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      @if (loading()) {
        <ion-spinner name="crescent" />
      } @else {
        @if (iconClass()) {
          <app-icon [icon]="iconClass()" slot="start" />
        }
        {{ label() || "Continuar" }}
      }
    </ion-button>
  `,
})
export class MobileButtonLabel extends MobileButtonBase {}
