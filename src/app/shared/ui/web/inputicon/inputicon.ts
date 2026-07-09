import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputIconModule } from "primeng/inputicon";
import { InputIconBase } from "@ui/base/inputicon.base";

@Component({
  selector: "app-inputicon",
  standalone: true,
  imports: [InputIconModule],
  template: `<p-inputicon [attr.styleClass]="styleClass()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class AppInputIcon extends InputIconBase {}
