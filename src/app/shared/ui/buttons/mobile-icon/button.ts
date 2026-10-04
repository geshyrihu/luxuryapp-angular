import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
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
      @if (displayMode() !== "label") {
        <app-icon [icon]="resolvedIconClass() || IconCatalog.GestureTap" slot="icon-only" />
      }
      @if (displayMode() !== "icon") {
        {{ label() }}
      }
    </ion-button>
  `,
})
export class MobileButtonIcon extends MobileButtonBase {
  override displayMode = input<"label" | "icon" | "both">("icon");
  protected override readonly IconCatalog = AppIconCatalog;}
