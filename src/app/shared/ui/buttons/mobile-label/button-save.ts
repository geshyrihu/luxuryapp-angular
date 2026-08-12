import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
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
          propertyId()
            ? 'material-symbols-light:edit-note'
            : 'material-symbols-light:save-outline'
        "
        slot="start"
      />
      {{ finalLabel() }}
    </ion-button>
  `,
})
export class MobileButtonLabelSave extends MobileButtonBase {
  override color = input<string>("primary");
  propertyId = input<string | number | null>(null);
  submitting = input<boolean>(false);

  protected finalLabel = computed(() => {
    if (this.label()) return this.label();
    return this.propertyId() ? "Actualizar" : "Guardar";
  });
}
