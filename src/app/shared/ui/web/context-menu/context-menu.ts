import { Component, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContextMenuModule } from "primeng/contextmenu";
import { ContextMenu as PrimeContextMenu } from "primeng/contextmenu";
import { ContextMenuBase } from "@ui/base/context-menu.base";

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
    <p-contextmenu #cm [model]="items()" />
  `,
  styles: [`
    .context-menu-host {
      display: contents;
    }
  `],
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
