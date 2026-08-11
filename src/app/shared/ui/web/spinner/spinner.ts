import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SpinnerBase } from "@ui/base/spinner.base";
import { ProgressSpinnerModule } from "primeng/progressspinner";

/**
 * AppSpinner — Wrapper sobre p-progressspinner con tamaño y color semántico.
 */
@Component({
  selector: "app-spinner",

  imports: [ProgressSpinnerModule],
  template: `
    <p-progressspinner
      [style]="{ width: sizePx(), height: sizePx() }"
      [strokeWidth]="strokeWidth().toString()"
      [ariaLabel]="ariaLabel()"
      [class]="'app-spinner-' + color()"
    />
  `,
  styles: [
    `
      app-spinner
        .p-progressspinner.app-spinner-primary
        .p-progressspinner-circle {
        stroke: var(--ds-primary);
      }
      app-spinner
        .p-progressspinner.app-spinner-success
        .p-progressspinner-circle {
        stroke: var(--ds-success);
      }
      app-spinner
        .p-progressspinner.app-spinner-warning
        .p-progressspinner-circle {
        stroke: var(--ds-warning);
      }
      app-spinner
        .p-progressspinner.app-spinner-danger
        .p-progressspinner-circle {
        stroke: var(--ds-danger);
      }
      app-spinner
        .p-progressspinner.app-spinner-neutral
        .p-progressspinner-circle {
        stroke: var(--ds-text-secondary);
      }
      /* PrimeNG cicla el stroke con la keyframe p-progressspinner-color; la quitamos
       (dejando solo el dash) para respetar el color semántico fijo. El giro vive en
       el SVG, no en el circle, así que se conserva. */
      app-spinner
        .p-progressspinner[class*="app-spinner-"]
        .p-progressspinner-circle {
        animation: p-progressspinner-dash 1.5s ease-in-out infinite;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSpinner extends SpinnerBase {}
