import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import { MobileButtonBase } from "../mobile-button-base";

@Component({
  selector: "ili-button-save",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [expand]="expand()"
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || submitting()"
      [class]="styleClass()"
      (click)="onClick($event)"
    >
      <app-icon
        [icon]="
          propertyId() ? IconCatalog.FileSign : IconCatalog.ContentSaveOutline
        "
        slot="start"
      />
      {{ finalLabel() }}
    </ion-button>
  `,
})
export class MobileButtonLabelSave extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;
  override color = input<string>("primary");
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
