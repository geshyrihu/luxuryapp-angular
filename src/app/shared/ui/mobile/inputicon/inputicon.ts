import { ChangeDetectionStrategy, Component } from "@angular/core";
import { InputIconBase } from "@ui/base/inputicon.base";
import { AppInputIcon } from "@ui/web/inputicon/inputicon";

@Component({
  selector: "ili-inputicon",

  imports: [AppInputIcon],
  template: `<app-inputicon [styleClass]="styleClass()" />`,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class MobileInputIcon extends InputIconBase {}
