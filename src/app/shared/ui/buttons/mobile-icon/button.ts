import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ii-button",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      [attr.title]="title() || ariaLabel() || label() || null"
      [attr.aria-label]="ariaLabel() || title() || label() || null"
      (click)="onClick($event)"
    >
      <app-icon [icon]="resolvedIconClass() || IconCatalog.GestureTap" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIcon extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;}
