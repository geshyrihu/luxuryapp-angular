import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { DockBase } from "@ui/base/dock.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-dock",

  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-dock" [class.ili-dock-top]="position() === 'top'">
      @for (item of items(); track $index) {
        <button
          class="ili-dock-item"
          [disabled]="item.disabled"
          (click)="runCommand(item)"
        >
          @if (item.icon) {
            <app-icon [icon]="item.icon" class="ili-dock-icon" />
          }
          @if (item.label && position() !== "bottom") {
            <span class="ili-dock-label">{{ item.label }}</span>
          }
        </button>
      }
    </div>
  `,
  styles: [
    `
      .ili-dock {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        background: var(--ds-bg-surface, #ffffff);
        border-top: 1px solid var(--ds-border, #e2e8f0);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .ili-dock::-webkit-scrollbar {
        display: none;
      }
      .ili-dock-top {
        border-top: none;
        border-bottom: 1px solid var(--ds-border, #e2e8f0);
      }
      .ili-dock-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.15rem;
        padding: 0.5rem;
        background: none;
        border: none;
        border-radius: var(--ds-radius-md, 6px);
        cursor: pointer;
        color: var(--ds-text-secondary);
        transition:
          color 0.15s,
          background 0.15s;
        -webkit-tap-highlight-color: transparent;
        min-width: 48px;
      }
      .ili-dock-item:active {
        background: var(--ds-bg-elevated, #f1f3ff);
        color: var(--ds-primary, #003d9b);
      }
      .ili-dock-icon {
        font-size: 1.375rem;
      }
      .ili-dock-label {
        font-size: 0.625rem;
        font-weight: 500;
        white-space: nowrap;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileDock extends DockBase {}
