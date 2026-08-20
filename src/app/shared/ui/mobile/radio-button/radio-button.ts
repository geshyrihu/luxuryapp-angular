import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { IonRadio } from "@ionic/angular/standalone";

@Component({
  selector: "ili-radio-button",
  imports: [ReactiveFormsModule, IonRadio],
  template: `<ion-radio
    [value]="value()"
    [formControl]="control()"
    [id]="inputId()"
    [class]="customClass()"
    [disabled]="disabled()"
  ></ion-radio>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileRadioButton extends RadioButtonBase {
  value = input<any>(undefined);
  control = input<any>(undefined);
  inputId = input<any>(undefined);
  customClass = input<string>("");
  disabled = input<boolean>(false);
}
