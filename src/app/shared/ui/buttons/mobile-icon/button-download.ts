import { AppIcon as AppIconCatalog } from "../../primitives/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IonButton } from "@ionic/angular";
import { AppIcon } from "../../primitives/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ii-button-download",

  imports: [IonButton, AppIcon],
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
      <lux-icon-base [icon]="resolvedIconClass() || IconCatalog.Download" slot="icon-only" />
    </ion-button>
  `,
})
export class MobileButtonIconDownload extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;}
