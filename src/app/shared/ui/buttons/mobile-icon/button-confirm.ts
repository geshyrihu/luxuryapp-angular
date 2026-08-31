import { AppIcon as AppIconCatalog } from "../../shared/app-icon/app-icon.catalog";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { IonButton } from "@ionic/angular/standalone";
import { AppIcon } from "../../shared/app-icon/app-icon";
import { MobileButtonBase } from "../mobile-button-base";
import { confirmAction } from "../shared/confirm";

@Component({
  selector: "ii-button-confirm",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="handleConfirm($event)"
    >
      <app-icon
        [icon]="resolvedIconClass() || IconCatalog.CheckCircleOutline"
        slot="icon-only"
      />
    </ion-button>
  `,
})
export class MobileButtonIconConfirm extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;
  swalText = input<string>("Estas seguro de continuar?");
  confirmed = output<void>();

  protected handleConfirm(event: Event): void {
    if (this.disabled() || this.loading()) return;
    if (confirmAction(this.swalText())) {
      this.confirmed.emit();
    }
  }
}
