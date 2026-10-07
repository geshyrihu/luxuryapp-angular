import {
  Component,
  ElementRef,
  ViewEncapsulation,
  effect,
  input,
  viewChild,
} from "@angular/core";
import { TabsBase } from "@ui/core/tabs.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-tabs-mobile",

  imports: [AppIconMobile],
  template: `
    <div class="lux-tabs-mobile" role="tablist">
      @for (tab of tabs(); track tab.id) {
        <button
          class="lux-tabs-mobile-item"
          role="tab"
          [class.lux-tabs-mobile-active]="activeId() === tab.id"
          [class.lux-tabs-mobile-disabled]="tab.disabled"
          [attr.aria-selected]="activeId() === tab.id"
          [disabled]="tab.disabled"
          (click)="select(tab)"
        >
          @if (tab.icon) {
            <lux-icon-mobile [icon]="tab.icon" class="lux-tabs-mobile-icon" />
          }
          <span class="lux-tabs-mobile-label">{{ tab.label }}</span>
          @if (tab.badge && tab.badge > 0) {
            <span class="lux-tabs-mobile-badge">{{
              tab.badge > 99 ? "99+" : tab.badge
            }}</span>
          }
        </button>
      }
    </div>
    @if (!navOnly()) {
      <div class="lux-tabs-mobile-panels" #panels>
        <ng-content />
      </div>
    }
  `,
  styles: [
    `
      .lux-tabs-mobile {
        display: flex;
        align-items: stretch;
        border-bottom: 2px solid var(--ds-border);
        background: var(--ds-bg-surface);
        overflow-x: auto;
        scrollbar-width: none;
      }
      .lux-tabs-mobile::-webkit-scrollbar {
        display: none;
      }
      .lux-tabs-mobile-item {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        margin-bottom: -2px;
        cursor: pointer;
        font-size: var(--ds-font-size-label);
        font-weight: 500;
        color: var(--ds-text-muted);
        white-space: nowrap;
        transition:
          color 0.15s,
          border-color 0.15s;
        -webkit-tap-highlight-color: transparent;
      }
      .lux-tabs-mobile-item:hover:not(.lux-tabs-mobile-disabled) {
        color: var(--ds-text-primary);
      }
      .lux-tabs-mobile-active {
        color: var(--ds-primary) !important;
        border-bottom-color: var(--ds-primary);
        font-weight: 600;
      }
      .lux-tabs-mobile-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .lux-tabs-mobile-icon {
        font-size: 1rem;
      }
      .lux-tabs-mobile-badge {
        background: var(--ds-danger);
        color: var(--ds-on-primary);
        font-size: 0.625rem;
        font-weight: 700;
        border-radius: var(--ds-radius-full);
        padding: 0.1rem 0.35rem;
        min-width: 16px;
        text-align: center;
        line-height: 1.4;
      }
      .lux-tabs-mobile-panels {
        padding-top: 0.75rem;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTabs extends TabsBase {
  /** Solo navegacion: el consumidor (p. ej. `lux-tabs`) proyecta los paneles. */
  navOnly = input<boolean>(false);

  private panelsRef = viewChild<ElementRef<HTMLElement>>("panels");

  constructor() {
    super();
    // Conmuta la visibilidad de los paneles proyectados `[tab=<id>]` segun la
    // tab activa. Si no hay paneles proyectados (uso como selector + @switch del
    // feature), no hace nada.
    effect(() => {
      const active = this.activeId();
      if (this.navOnly()) return;
      const host = this.panelsRef()?.nativeElement;
      if (!host) return;
      const panels = host.querySelectorAll<HTMLElement>(":scope > [tab]");
      panels.forEach((p) => {
        p.hidden = p.getAttribute("tab") !== active;
      });
    });
  }
}
