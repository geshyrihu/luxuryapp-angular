import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputIconBase } from "@ui/base/inputicon.base";
import { IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "ili-inputicon",
  imports: [IonIcon],
  template: `<ion-icon [class]="styleClass()" name="help-outline"></ion-icon>`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileInputIcon extends InputIconBase {}
