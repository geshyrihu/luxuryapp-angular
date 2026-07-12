import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";
import { SplitterModule } from "primeng/splitter";

@Component({
  selector: "app-split-pane",

  imports: [SplitterModule],
  template: `
    <p-splitter
      [style]="{ height: height() }"
      [layout]="direction()"
      [panelSizes]="sizes()"
      [minSizes]="minSizes()"
    >
      <ng-template pTemplate>
        <div class="split-pane-panel">
          <ng-content select="[left-panel]" />
        </div>
      </ng-template>
      <ng-template pTemplate>
        <div class="split-pane-panel">
          <ng-content select="[right-panel]" />
        </div>
      </ng-template>
    </p-splitter>
  `,
  styles: [
    `
      .split-pane-panel {
        padding: 0.75rem;
        height: 100%;
        overflow: auto;
      }
      .p-splitter {
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class SplitPane {
  direction = input<"horizontal" | "vertical">("horizontal");
  height = input<string>("400px");
  sizes = input<number[]>([50, 50]);
  minSizes = input<number[]>([20, 20]);
}
