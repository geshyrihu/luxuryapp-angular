import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SplitButtonBase } from "@ui/base/split-button.base";
import { IonButton, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: "ili-split-button",
  imports: [IonButton, IonIcon],
  template: `
    <div [class]="styleClass()" style="display: flex;">
      <ion-button [disabled]="disabled()" (click)="onClick.emit($event)" [color]="severity()">
        @if (icon()) {
          <ion-icon [name]="icon()" slot="start"></ion-icon>
        }
        {{ label() }}
      </ion-button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSplitButton extends SplitButtonBase {}
