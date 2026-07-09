import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { InputnumberBase } from "@ui/base/inputnumber.base";
import { InputNumberModule } from "primeng/inputnumber";

@Component({
  selector: "ili-inputnumber",
  standalone: true,
  imports: [InputNumberModule],
  template: `<p-inputNumber [placeholder]="placeholder()" [min]="min()" [max]="max()" [mode]="mode()" [value]="value()" (valueChange)="value.set($event)" [class]="styleClass()"></p-inputNumber>`,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class MobileInputnumber extends InputnumberBase {}
