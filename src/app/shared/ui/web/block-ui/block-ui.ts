import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { BlockUIBase } from "@ui/base/block-ui.base";
import { BlockUIModule } from "primeng/blockui";

@Component({
  selector: "app-block-ui",

  imports: [CommonModule, BlockUIModule],
  template: `
    <div class="app-block-ui-root">
      <p-blockUI [blocked]="blocked()" [fullScreen]="fullScreen()" />
      <ng-content />
    </div>
  `,
  styles: [
    `
      .app-block-ui-root {
        position: relative;
      }
      .p-blockui {
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.35));
        border-radius: inherit;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBlockUI extends BlockUIBase {}
