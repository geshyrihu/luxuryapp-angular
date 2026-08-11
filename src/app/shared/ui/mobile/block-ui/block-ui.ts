import { Component, ViewEncapsulation } from "@angular/core";
import { BlockUIBase } from "@ui/base/block-ui.base";

@Component({
  selector: "ili-block-ui",

  imports: [],
  template: `
    <div class="ili-block-ui-root">
      @if (blocked()) {
        <div
          class="ili-block-ui-overlay"
          [class.ili-block-ui-fullscreen]="fullScreen()"
        >
          <div class="ili-block-ui-spinner">
            <div class="ili-block-ui-spinner-ring"></div>
            <span class="ili-block-ui-spinner-text">Cargando...</span>
          </div>
        </div>
      }
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ili-block-ui-root {
        position: relative;
      }
      .ili-block-ui-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--ds-bg-overlay);
        z-index: 100;
        border-radius: inherit;
      }
      .ili-block-ui-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 9999;
      }
      .ili-block-ui-spinner {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }
      .ili-block-ui-spinner-ring {
        width: 32px;
        height: 32px;
        border: 3px solid var(--ds-border);
        border-top-color: var(--ds-primary);
        border-radius: 50%;
        animation: ili-spin 0.6s linear infinite;
      }
      .ili-block-ui-spinner-text {
        font-size: var(--ds-font-size-label);
        color: var(--ds-bg-surface);
        font-weight: 500;
      }
      @keyframes ili-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileBlockUI extends BlockUIBase {}
