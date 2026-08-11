import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from "@angular/core";
import { BlockUIBase } from "@ui/base/block-ui.base";
import { BlockUIModule } from "primeng/blockui";

@Component({
  selector: "app-block-ui",
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  imports: [BlockUIModule],
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
        background: var(--ds-bg-overlay);
        border-radius: inherit;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppBlockUI extends BlockUIBase {}
