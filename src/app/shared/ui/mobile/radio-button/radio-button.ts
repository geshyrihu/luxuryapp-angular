import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "ili-radio-button",

  imports: [ReactiveFormsModule, RadioButtonModule],
  template: `<p-radiobutton
    [value]="value()"
    [formControl]="formControl()"
    [inputId]="inputId()"
    [class]="styleClass()"
  ></p-radiobutton>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileRadioButton extends RadioButtonBase {}
