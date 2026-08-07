import { Component, ViewEncapsulation } from "@angular/core";
import { IonProgressBar } from "@ionic/angular/standalone";
import { ProgressBarBase } from "@ui/base/progress-bar.base";

/**
 * MobileProgressBar — ProgressBar sobre `ion-progress-bar`. `value` en 0..100
 * (se convierte a 0..1 para Ionic).
 */
@Component({
  selector: "ili-progress-bar",

  imports: [IonProgressBar],
  template: `
    <div class="ili-progress-bar-root">
      <ion-progress-bar
        [type]="mode()"
        [value]="fraction()"
        [color]="ionColor()"
      />
      @if (showValue() && mode() === "determinate") {
        <span class="ili-progress-bar-value"
          >{{ clampedValue() }}{{ unit() }}</span
        >
      }
    </div>
  `,
  styles: [
    `
      .ili-progress-bar-root {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .ili-progress-bar-root ion-progress-bar {
        flex: 1;
      }
      .ili-progress-bar-value {
        font-size: 0.8125rem;
        color: var(--ds-text-secondary);
        min-width: 2.5rem;
        text-align: right;
      }
    `,
  ],
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
