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

@Component({
  selector: "ili-button-active-desactive",

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
      (click)="toggleState()"
    >
      <app-icon
        [icon]="state() ? IconCatalog.LockOpenOutline : IconCatalog.LockOpenOutline"
        slot="start"
      />
      {{ state() ? inactivasLabel() : activasLabel() }}
    </ion-button>
  `,
})
export class MobileButtonLabelActiveDesactive extends MobileButtonBase {
  protected readonly IconCatalog = AppIconCatalog;
  state = input<boolean>(true);
  activasLabel = input<string>("Activos");
  inactivasLabel = input<string>("Inactivos");

  stateChange = output<boolean>();

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
