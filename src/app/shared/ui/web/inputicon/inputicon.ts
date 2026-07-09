import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputIconBase } from "@ui/base/inputicon.base";
import { InputIconModule } from "primeng/inputicon";

@Component({
  selector: "app-inputicon",

  imports: [InputIconModule],
  template: `<p-inputicon [attr.styleClass]="styleClass()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppInputIcon extends InputIconBase {}
