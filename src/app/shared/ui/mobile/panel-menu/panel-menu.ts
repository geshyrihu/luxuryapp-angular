import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { PanelMenuBase } from "@ui/base/panel-menu.base";
import { IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList } from "@ionic/angular/standalone";

@Component({
  selector: "ili-panel-menu",
  imports: [IonAccordionGroup, IonAccordion, IonItem, IonLabel, IonList],
  template: `
    <ion-accordion-group [class]="styleClass()">
      @for (item of model(); track item) {
        <ion-accordion [value]="item.label">
          <ion-item slot="header" color="light">
            <ion-label>{{ item.label }}</ion-label>
          </ion-item>
          <div slot="content">
            @if (item.items) {
              <ion-list>
                @for (subItem of item.items; track subItem) {
                  <ion-item button (click)="subItem.command ? subItem.command() : null">
                    <ion-label>{{ subItem.label }}</ion-label>
                  </ion-item>
                }
              </ion-list>
            }
          </div>
        </ion-accordion>
      }
    </ion-accordion-group>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobilePanelMenu extends PanelMenuBase {}
