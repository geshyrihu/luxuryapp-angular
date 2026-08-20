import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RadioButtonBase } from "@ui/base/radio-button.base";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "app-radio-button",

  imports: [ReactiveFormsModule, RadioButtonModule],
  template: `<p-radiobutton
    [value]="value()"
    [formControl]="control()"
    [inputId]="inputId()"
    [class]="customClass()"
    [disabled]="disabled()"
  ></p-radiobutton>`,
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
