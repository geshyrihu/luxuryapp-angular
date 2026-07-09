import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { RadiobuttonBase } from "@ui/base/radiobutton.base";
import { RadioButtonModule } from "primeng/radiobutton";

@Component({
  selector: "ili-radiobutton",
  standalone: true,
  imports: [RadioButtonModule],
  template: `<p-radioButton [value]="value()" [formControl]="formControl()" [inputId]="inputId()" [class]="styleClass()"></p-radioButton>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileRadiobutton extends RadiobuttonBase {}
