import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import { ContextMenuBase } from "@ui/base/context-menu.base";
import {
  ContextMenuModule,
  ContextMenu as PrimeContextMenu,
} from "primeng/contextmenu";

@Component({
  selector: "app-context-menu",

  imports: [CommonModule, ContextMenuModule],
  template: `
    <div
      class="context-menu-host"
      (contextmenu)="onContextMenu($event)"
      tabindex="0"
    >
      <ng-content />
    </div>
    <p-contextmenu #cm [model]="items()" />
  `,
  styles: [
    `
      .context-menu-host {
        display: contents;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class ContextMenu extends ContextMenuBase {
  @ViewChild("cm") cm!: PrimeContextMenu;

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.cm?.show(event);
  }
}
