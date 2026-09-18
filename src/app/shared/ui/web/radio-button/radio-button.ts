import { NgClass } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";

@Component({
  selector: "app-radio-button",

  imports: [ReactiveFormsModule, NgClass],
  template: `<input
    type="radio"
    class="form-check-input"
    [ngClass]="customClass()"
    [value]="value()"
    [formControl]="control()"
    [id]="inputId()"
    [disabled]="disabled()"
  />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppRadioButton extends RadioButtonBase {
  value = input<any>(undefined);
  control = input<any>(undefined);
  inputId = input<any>(undefined);
  customClass = input<string>("");
  disabled = input<boolean>(false);
}
