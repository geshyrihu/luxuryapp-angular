import {
  ChangeDetectionStrategy,
  Component,
  input,
  ViewEncapsulation,
} from "@angular/core";

export interface DashboardWidget {
  id: string;
  title: string;
  cols: number;
  rows: number;
}

@Component({
  selector: "app-dashboard-layout",

  imports: [],
  template: `
    <div
      class="dashboard-grid"
      [style.gridTemplateColumns]="'repeat(' + columns() + ', 1fr)'"
    >
      @for (widget of widgets(); track widget.id) {
        <div
          class="dashboard-widget"
          [style.gridColumn]="'span ' + widget.cols"
          [style.gridRow]="'span ' + widget.rows"
        >
          <div class="dashboard-widget-header">
            <strong>{{ widget.title }}</strong>
          </div>
          <div class="dashboard-widget-body">
            <ng-content [select]="'[widget-' + widget.id + ']'" />
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .dashboard-grid {
        display: grid;
        gap: 1rem;
        grid-auto-rows: minmax(200px, auto);
      }
      .dashboard-widget {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .dashboard-widget-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.625rem 1rem;
        background: var(--ds-bg-elevated);
        border-bottom: 1px solid var(--ds-border);
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
      .dashboard-widget-body {
        flex: 1;
        padding: 1rem;
        overflow: auto;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class DashboardLayout {
  widgets = input.required<DashboardWidget[]>();
  columns = input<number>(3);
}
