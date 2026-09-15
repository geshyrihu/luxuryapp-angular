import {
  ChangeDetectionStrategy,
  Component,
} from "@angular/core";
import { SidebarBase } from "@ui/base/sidebar.base";

@Component({
  selector: "app-sidebar",

  imports: [],
  template: `
    @if (visible()) {
      <div class="offcanvas-backdrop fade show" (click)="onHide()"></div>
    }
    <aside
      class="offcanvas"
      [class.offcanvas-start]="position() === 'left'"
      [class.offcanvas-end]="position() === 'right'"
      [class.offcanvas-top]="position() === 'top'"
      [class.offcanvas-bottom]="position() === 'bottom'"
      [class.show]="visible()"
      [class]="styleClass()"
      tabindex="-1"
      [attr.aria-hidden]="!visible()"
    >
      <div class="offcanvas-header">
        @if (header()) { <h5 class="offcanvas-title">{{ header() }}</h5> }
        @if (closable()) {
          <button type="button" class="btn-close" aria-label="Cerrar" (click)="onHide()"></button>
        }
      </div>
      <div class="offcanvas-body"><ng-content /></div>
    </aside>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar extends SidebarBase {}
