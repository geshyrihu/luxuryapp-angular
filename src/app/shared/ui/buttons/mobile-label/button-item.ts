import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button-item",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      @if (iconClass()) {
        <app-icon [icon]="iconClass()" slot="start" />
      }
      {{ label() || "Accion" }}
    </ion-button>
  `,
})
export class MobileButtonLabelItem extends MobileButtonBase {}
