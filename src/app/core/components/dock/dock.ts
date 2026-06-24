import { Component, input, output, ViewEncapsulation } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DockModule } from "primeng/dock";
import { TooltipModule } from "primeng/tooltip";
import type { MenuItem } from "primeng/api";

/**
 * AppDock — Wrapper sobre p-dock para barra de herramientas tipo macOS.
 * Uso: acceso rápido a acciones, atajos de módulo, panel de herramientas flotante.
 * p-dock inputs: model (MenuItem[]), position, id, styleClass, breakpoint.
 */
@Component({
  selector: "app-dock",
  standalone: true,
  imports: [CommonModule, DockModule, TooltipModule],
  template: `
    <div class="app-dock-root">
      <p-dock
        [model]="items()"
        [position]="position()"
        [id]="dockId()"
        [styleClass]="'app-dock-inner'"
      >
        <ng-template pTemplate="item" let-item>
          <div
            class="app-dock-item"
            [pTooltip]="item.label"
            [tooltipPosition]="tooltipPosition()"
            (click)="item.command ? item.command({}) : itemClick.emit(item)"
          >
            <img
              *ngIf="item.icon && item.icon.startsWith('assets')"
              [src]="item.icon"
              [alt]="item.label"
              class="app-dock-img"
            />
            <span
              *ngIf="item.icon && !item.icon.startsWith('assets')"
              [class]="item.icon + ' app-dock-icon'"
            ></span>
          </div>
        </ng-template>
      </p-dock>
    </div>
  `,
  styles: [`
    .app-dock-root { position: relative; }
    .app-dock-inner .p-dock-list {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-xl, 12px);
      padding: 0.5rem;
      box-shadow: var(--ds-shadow-lg);
    }
    .app-dock-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--ds-radius-md, 6px);
      cursor: pointer;
      transition: background 0.15s;
    }
    .app-dock-item:hover { background: var(--ds-bg-elevated, #f1f3ff); }
    .app-dock-img { width: 32px; height: 32px; object-fit: contain; }
    .app-dock-icon { font-size: 1.5rem; color: var(--ds-text-primary); }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppDock {
  items     = input<MenuItem[]>([]);
  position  = input<"bottom" | "top" | "left" | "right">("bottom");
  dockId    = input<string>("app-dock");

  itemClick = output<MenuItem>();

  tooltipPosition(): string {
    const pos = this.position();
    if (pos === "bottom") return "top";
    if (pos === "top")    return "bottom";
    if (pos === "left")   return "right";
    return "left";
  }
}
