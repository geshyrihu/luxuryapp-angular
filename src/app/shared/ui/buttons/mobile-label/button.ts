import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton, IonSpinner } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon.component";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button",

  imports: [IonButton, IonSpinner, AppIcon],
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
  styles: [
    `
      /* app-icon (a diferencia de ion-icon) no recibe el margen por defecto de
         ion-button, por eso el icono queda pegado al texto. Lo separamos. */
      app-icon[slot="start"] {
        margin-inline-end: 0.45rem;
      }
      app-icon[slot="end"] {
        margin-inline-start: 0.45rem;
      }
    `,
  ],
})
export class MobileButtonLabel extends MobileButtonBase {}
