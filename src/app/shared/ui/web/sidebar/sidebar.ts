import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { SidebarBase } from "@ui/base/sidebar.base";
import { DrawerModule } from "primeng/drawer";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, DrawerModule],
  template: `
    <p-drawer
      [(visible)]="visible"
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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar extends SidebarBase {}
