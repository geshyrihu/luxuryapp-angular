import { Component, input, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuModule } from "primeng/contextmenu";
import { ContextMenu as PrimeContextMenu } from "primeng/contextmenu";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-context-menu",
  standalone: true,
  imports: [CommonModule, ContextMenuModule],
  template: `
    <div
      class="context-menu-host"
      (contextmenu)="onContextMenu($event)"
      tabindex="0"
    >
      <ng-content />
    </div>
    <p-contextMenu #cm [model]="items()" />
  `,
  styles: [`
    .context-menu-host {
      display: contents;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ContextMenu {
  items = input.required<MenuItem[]>();

  @ViewChild("cm") cm!: PrimeContextMenu;

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.cm?.show(event);
  }
}
