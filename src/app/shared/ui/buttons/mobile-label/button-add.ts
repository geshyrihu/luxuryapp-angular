import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button-add",

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
      <lux-icon-base [icon]="resolvedIconClass() || IconCatalog.Add" slot="start" />
      {{ label() || "Agregar" }}
    </ion-button>
  `,
})
export class MobileButtonLabelAdd extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;}
