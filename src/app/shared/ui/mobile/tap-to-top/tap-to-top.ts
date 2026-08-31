import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { TapToTopBase } from "@ui/base/tap-to-top.base";
import { AppIconMobile } from "src/app/shared/ui/mobile/app-icon/app-icon";

@Component({
  selector: "ili-tap-to-top",

  imports: [CommonModule, AppIconMobile],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div
      class="tap-top text-center"
      (click)="tapToTop()"
      [ngStyle]="{ display: show ? 'block' : 'none' }"
    >
      <ili-icon icon="material-symbols-light:arrow-upward" class="m-0 icon icon-" />
    </div>
  `,
  styles: [
    `
      .tap-top {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9999;
        cursor: pointer;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background: var(--ds-primary);
        color: var(--ds-on-primary);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--ds-shadow-lg);
        transition:
          opacity 0.2s,
          transform 0.2s;
      }
      .tap-top:hover {
        transform: scale(1.1);
      }
    `,
  ],
})
export class MobileTapToTop extends TapToTopBase {}
