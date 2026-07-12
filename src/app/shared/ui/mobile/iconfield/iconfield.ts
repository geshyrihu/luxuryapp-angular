import { ChangeDetectionStrategy, Component } from "@angular/core";
import { IconFieldBase } from "@ui/base/iconfield.base";
import { IonItem } from "@ionic/angular/standalone";

@Component({
  selector: "ili-iconfield",
  imports: [IonItem],
  template: `
    <ion-item lines="none" [class]="'icon-pos-' + iconPosition()">
      <ng-content />
    </ion-item>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileIconField extends IconFieldBase {}
