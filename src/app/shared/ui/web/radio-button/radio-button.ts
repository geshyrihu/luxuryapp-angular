import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "app-radio-button",

  imports: [ReactiveFormsModule, RadioButtonModule],
  template: `<p-radiobutton
    [value]="value()"
    [formControl]="formControl()"
    [inputId]="inputId()"
    [class]="styleClass()"
  ></p-radiobutton>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppRadioButton extends RadioButtonBase {}
