import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
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
        <lux-icon-base [icon]="resolvedIconClass()" slot="start" />
      }
      {{ label() || "Accion" }}
    </ion-button>
  `,
})
export class MobileButtonLabelItem extends MobileButtonBase {}
