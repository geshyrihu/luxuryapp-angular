import { Component, ViewEncapsulation } from "@angular/core";
import { IonSpinner } from "@ionic/angular";
import { SpinnerBase } from "@ui/core/spinner.base";

/**
 * MobileSpinner — Spinner sobre `ion-spinner` (crescent) con tamaño y color.
 */
@Component({
  selector: "lux-spinner-mobile",

  imports: [IonSpinner],
  template: `
    <ion-spinner
      name="crescent"
      [color]="ionColor()"
      [attr.aria-label]="ariaLabel()"
      [style.width]="sizePx()"
      [style.height]="sizePx()"
    />
  `,
  encapsulation: ViewEncapsulation.None,
})
export class MobileSpinner extends SpinnerBase {
  ionColor(): string {
    const map: Record<string, string> = {
      primary: "primary",
      success: "success",
      warning: "warning",
      danger: "danger",
      neutral: "medium",
    };
    return map[this.color()] ?? "primary";
  }
}
