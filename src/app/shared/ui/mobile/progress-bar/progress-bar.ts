import { Component, ViewEncapsulation } from "@angular/core";
import { IonProgressBar } from "@ionic/angular";
import { ProgressBarBase } from "@ui/core/progress-bar.base";

/**
 * MobileProgressBar — ProgressBar sobre `ion-progress-bar`. `value` en 0..100
 * (se convierte a 0..1 para Ionic).
 */
@Component({
  selector: "lux-progress-bar-mobile",

  imports: [IonProgressBar],
  template: `
    <div class="lux-progress-bar-mobile-root">
      <ion-progress-bar
        [type]="mode()"
        [value]="fraction()"
        [color]="ionColor()"
      />
      @if (showValue() && mode() === "determinate") {
        <span class="lux-progress-bar-mobile-value"
          >{{ clampedValue() }}{{ unit() }}</span
        >
      }
    </div>
  `,
  styles: [
    `
      .lux-progress-bar-mobile-root {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .lux-progress-bar-mobile-root ion-progress-bar {
        flex: 1;
      }
      .lux-progress-bar-mobile-value {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
        min-width: 2.5rem;
        text-align: right;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileProgressBar extends ProgressBarBase {
  ionColor(): string {
    const map: Record<string, string> = {
      primary: "primary",
      success: "success",
      warning: "warning",
      danger: "danger",
    };
    return map[this.resolvedColor()] ?? "primary";
  }
}
