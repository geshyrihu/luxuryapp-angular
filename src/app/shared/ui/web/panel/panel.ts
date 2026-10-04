import {
  ChangeDetectionStrategy,
  Component,
  effect,
  signal,
} from "@angular/core";
import { PanelBase } from "@ui/core/panel.base";

@Component({
  selector: "lux-panel-web",

  imports: [],
  template: `
    <section class="card app-panel" [class.app-panel-collapsed]="isCollapsed()">
      <div class="card-header d-flex align-items-center justify-content-between">
        <span>{{ header() }}</span>
        @if (toggleable()) {
          <button type="button" class="btn btn-link p-0" (click)="isCollapsed.update(value => !value)" [attr.aria-expanded]="!isCollapsed()">
            {{ isCollapsed() ? 'Mostrar' : 'Ocultar' }}
          </button>
        }
      </div>
      @if (!isCollapsed()) { <div class="card-body"><ng-content /></div> }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppPanel extends PanelBase {
  protected readonly isCollapsed = signal(false);

  constructor() {
    super();
    effect(() => this.isCollapsed.set(this.collapsed()));
  }
}
