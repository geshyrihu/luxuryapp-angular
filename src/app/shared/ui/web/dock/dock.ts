import {
  ChangeDetectionStrategy,
  Component,
  input,
  computed,
  ViewEncapsulation,
} from "@angular/core";
import { DockBase } from "@ui/base/dock.base";
import { DockModule } from "primeng/dock";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

/**
 * AppDock — Wrapper sobre p-dock para barra de herramientas tipo macOS.
 * Uso: acceso rápido a acciones, atajos de módulo, panel de herramientas flotante.
 * p-dock inputs: model (MenuItem[]), position, id, styleClass, breakpoint.
 */
@Component({
  selector: "app-dock",

  imports: [DockModule, LxTooltipDirective],
  template: `
    <div class="app-dock-root">
      <p-dock
        [model]="items()"
        [position]="position()"
        [id]="dockId()"
        [class]="'app-dock-inner'"
      >
        <ng-template #item let-item>
          <div
            class="app-dock-item"
            [lxTooltip]="item.label"
            [tooltipPosition]="tooltipPosition()"
            (click)="runCommand(item)"
          >
            @if (item.icon && item.icon.startsWith("assets")) {
              <img [src]="item.icon" [alt]="item.label" class="app-dock-img" />
            }
            @if (item.icon && !item.icon.startsWith("assets")) {
              <span [class]="item.icon + ' app-dock-icon'"></span>
            }
          </div>
        </ng-template>
      </p-dock>
    </div>
  `,
  styles: [
    `
      .app-dock-root {
        position: relative;
      }
      .app-dock-inner .p-dock-list {
        background: color-mix(in srgb, white 85%, transparent);
        backdrop-filter: blur(12px);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-xl);
        padding: 0.5rem;
        box-shadow: var(--ds-shadow-lg);
      }
      .app-dock-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--ds-radius-md);
        cursor: pointer;
        transition: background 0.15s;
      }
      .app-dock-item:hover {
        background: var(--ds-bg-elevated);
      }
      .app-dock-img {
        width: 32px;
        height: 32px;
        object-fit: contain;
      }
      .app-dock-icon {
        font-size: 1.5rem;
        color: var(--ds-text-primary);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppDock extends DockBase {
  dockId = input<string>("app-dock");

  tooltipPosition = computed(() => {
    const pos = this.position();
    if (pos === "bottom") return "top";
    if (pos === "top") return "bottom";
    if (pos === "left") return "right";
    return "left";
  });
}

