import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { MenuBase } from "@ui/base/menu.base";
import { IonList, IonItem, IonLabel, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "ili-menu",
  imports: [IonList, IonItem, IonLabel, IonIcon],
  template: `
    <ion-list [class]="styleClass()">
      @for (item of model(); track item) {
        <ion-item button (click)="item.command ? item.command() : null" [disabled]="item.disabled">
          @if (item.icon) {
            <ion-icon [name]="item.icon" slot="start"></ion-icon>
          }
          <ion-label>{{ item.label }}</ion-label>
        </ion-item>
      }
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileMenu extends MenuBase {}
