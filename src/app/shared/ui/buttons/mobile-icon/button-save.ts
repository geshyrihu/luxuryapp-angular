import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ii-button-save",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || submitting()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      <app-icon
        [icon]="
          propertyId()
            ? IconCatalog.FileSign
            : IconCatalog.ContentSaveOutline
        "
        slot="icon-only"
      />
    </ion-button>
  `,
})
export class MobileButtonIconSave extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);
}
