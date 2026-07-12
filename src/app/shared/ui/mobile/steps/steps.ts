import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { StepsBase } from "@ui/base/steps.base";
import { IonSegment, IonSegmentButton, IonLabel } from "@ionic/angular/standalone";

@Component({
  selector: "ili-steps",
  imports: [IonSegment, IonSegmentButton, IonLabel],
  template: `
    <ion-segment 
      [value]="activeIndex()" 
      (ionChange)="activeIndex.set($event.detail.value)"
      [disabled]="readonly()"
      [class]="styleClass()">
      @for (item of model(); track item; let i = $index) {
        <ion-segment-button [value]="i">
          <ion-label>{{ item.label }}</ion-label>
        </ion-segment-button>
      }
    </ion-segment>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSteps extends StepsBase {}
