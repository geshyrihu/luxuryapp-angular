import { ChangeDetectionStrategy, Component, ViewEncapsulation } from "@angular/core";
import { TapToTopBase } from "@ui/base/tap-to-top.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-scroll-top",
  imports: [AppIcon],
  template: `
    @if (show) {
      <button type="button" class="app-scroll-top-btn" aria-label="Volver arriba" (click)="tapToTop()">
        <app-icon icon="material-symbols-light:arrow-upward" />
      </button>
    }
  `,
  styles: [`
    :host { display: contents; }
    .app-scroll-top-btn {
      position: fixed;
      right: 1.5rem;
      bottom: 1.5rem;
      z-index: 1000;
      width: 3rem;
      height: 3rem;
      border: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--ds-primary);
      color: var(--ds-on-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Default,
  encapsulation: ViewEncapsulation.None,
})
export class ScrollTop extends TapToTopBase {}
