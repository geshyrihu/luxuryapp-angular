import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { IonRadio } from "@ionic/angular/standalone";

@Component({
  selector: "ili-radio-button",
  imports: [ReactiveFormsModule, IonRadio],
  template: `<ion-radio
    [value]="value()"
    [formControl]="formControl()"
    [class]="styleClass()"
  ></ion-radio>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileRadioButton extends RadioButtonBase {}
