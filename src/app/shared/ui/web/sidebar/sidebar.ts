import { Component, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SidebarModule } from "primeng/sidebar";
import { SidebarBase } from "@ui/base/sidebar.base";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, SidebarModule],
  template: `
    <p-sidebar
      [(visible)]="visible"
      [position]="position()"
      [closable]="closable()"
      [header]="header()"
      (onHide)="onHide()"
    >
      <ng-content />
    </p-sidebar>
  `,
  styles: [`
    :host { display: contents; }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Sidebar extends SidebarBase {}
