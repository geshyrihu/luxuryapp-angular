import { Component, ViewEncapsulation } from "@angular/core";
import { TapToTopBase } from "@ui/base/tap-to-top.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { ScrollTopModule } from "primeng/scrolltop";

@Component({
  selector: "app-scroll-top",

  imports: [ScrollTopModule, AppIcon],
  template: `
    <!-- El icono va por plantilla, no por el input "icon": ese espera una
         clase CSS de PrimeIcons y aquí se usa Material Symbols. -->
    <p-scrolltop
      [threshold]="600"
      [style]="{ background: 'var(--ds-primary)', color: 'var(--ds-on-primary)' }"
    >
      <ng-template #icon>
        <app-icon icon="material-symbols-light:arrow-upward" />
      </ng-template>
    </p-scrolltop>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class ScrollTop extends TapToTopBase {}
