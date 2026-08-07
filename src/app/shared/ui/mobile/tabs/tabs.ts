import {
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  viewChild,
} from "@angular/core";
import { TabsBase } from "@ui/base/tabs.base";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "ili-tabs",

  imports: [AppIcon],
  template: `
    <div class="ili-tabs" role="tablist">
      @for (tab of tabs(); track tab.id) {
        <button
          class="ili-tab-item"
          role="tab"
          [class.ili-tab-active]="activeId() === tab.id"
          [class.ili-tab-disabled]="tab.disabled"
          [attr.aria-selected]="activeId() === tab.id"
          [disabled]="tab.disabled"
          (click)="select(tab)"
        >
          @if (tab.icon) {
            <app-icon [icon]="tab.icon" class="ili-tab-icon" />
          }
          <span class="ili-tab-label">{{ tab.label }}</span>
          @if (tab.badge && tab.badge > 0) {
            <span class="ili-tab-badge">{{
              tab.badge > 99 ? "99+" : tab.badge
            }}</span>
          }
        </button>
      }
    </div>
    <div class="ili-tab-panels" #panels>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .ili-tabs {
        display: flex;
        align-items: stretch;
        border-bottom: 2px solid var(--ds-border, #e2e8f0);
        background: var(--ds-bg-surface, #ffffff);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .ili-tabs::-webkit-scrollbar {
        display: none;
      }
      .ili-tab-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        cursor: pointer;
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 500;
        color: var(--ds-text-muted);
        white-space: nowrap;
        transition:
          color 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .ili-tab-item:hover:not(.ili-tab-disabled) {
        color: var(--ds-text-primary);
      }
      .ili-tab-active {
        color: var(--ds-primary, #003d9b) !important;
        border-bottom-color: var(--ds-primary, #003d9b);
        font-weight: 600;
      }
      .ili-tab-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ili-tab-icon {
        font-size: 1rem;
      }
      .ili-tab-badge {
        background: var(--ds-danger, #ba1a1a);
        color: #ffffff;
        font-size: 0.625rem;
        font-weight: 700;
        border-radius: var(--ds-radius-full, 9999px);
        padding: 0.1rem 0.35rem;
        min-width: 16px;
        text-align: center;
        line-height: 1.4;
      }
      .ili-tab-panels {
        padding-top: 0.75rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTabs extends TabsBase {
  private panelsRef = viewChild<ElementRef<HTMLElement>>("panels");

  constructor() {
    super();
    // Conmuta la visibilidad de los paneles proyectados `[tab=<id>]` segun la
    // tab activa. Si no hay paneles proyectados (uso como selector + @switch del
    // feature), no hace nada.
    effect(() => {
      const active = this.activeId();
      const host = this.panelsRef()?.nativeElement;
      if (!host) return;
      const panels = host.querySelectorAll<HTMLElement>(":scope > [tab]");
      panels.forEach((p) => {
        p.hidden = p.getAttribute("tab") !== active;
      });
    });
  }
}
