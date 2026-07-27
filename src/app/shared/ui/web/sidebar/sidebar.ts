import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SidebarBase } from "@ui/base/sidebar.base";
import { DrawerModule } from "primeng/drawer";

@Component({
  selector: "app-sidebar",

  imports: [DrawerModule],
  template: `
    <p-drawer
      [visible]="visible()"
      (visibleChange)="visible.set($event)"
      [position]="position()"
      [closable]="closable()"
      [header]="header()"
      (onHide)="onHide()"
    >
      <ng-content />
    </p-drawer>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar extends SidebarBase {}
