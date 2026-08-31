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
  selector: "ii-button-active-desactive",

  imports: [IonButton, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <ion-button
      [fill]="resolvedFill()"
      [color]="resolvedColor()"
      [size]="size()"
      [disabled]="disabled() || loading()"
      [class]="styleClass()"
      (click)="toggleState()"
    >
      <app-icon
        [icon]="state() ? IconCatalog.LockOpenOutline : IconCatalog.LockOpenOutline"
        slot="icon-only"
      />
    </ion-button>
  `,
})
export class MobileButtonIconActiveDesactive extends MobileButtonBase {
  protected override readonly IconCatalog = AppIconCatalog;
  state = input<boolean>(true);

  stateChange = output<boolean>();

  protected toggleState(): void {
    if (this.disabled() || this.loading()) return;
    this.stateChange.emit(!this.state());
  }
}
