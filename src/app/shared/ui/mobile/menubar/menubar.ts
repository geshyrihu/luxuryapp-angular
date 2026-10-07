import { Component, ViewEncapsulation, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MenubarBase } from "@ui/core/menubar.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-menubar-mobile",

  imports: [RouterModule, AppIconMobile],
  template: `
    <div class="lux-menubar-mobile">
      <button
        class="lux-menubar-mobile-hamburger"
        (click)="toggleOpen()"
        aria-label="Menú"
      >
        <lux-icon-mobile icon="material-symbols-light:menu" />
      </button>
      @if (isOpen()) {
        <div class="lux-menubar-mobile-backdrop" (click)="close()"></div>
        <div class="lux-menubar-mobile-dropdown">
          @for (item of items(); track $index) {
            @if (item.separator) {
              <hr class="lux-menubar-mobile-separator" />
            } @else {
              <button
                class="lux-menubar-mobile-item"
                [class.lux-menubar-mobile-item-disabled]="item.disabled"
                [disabled]="item.disabled"
                (click)="onItemClick(item)"
              >
                @if (item.icon) {
                  <lux-icon-mobile [icon]="iconName(item.icon) || 'material-symbols-light:circle'" class="lux-menubar-mobile-item-icon" />
                }
                <span>{{ item.label }}</span>
                @if (item.items?.length) {
                  <lux-icon-mobile
                    icon="material-symbols-light:chevron-right"
                    class="lux-menubar-mobile-chevron"
                  />
                }
              </button>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .lux-menubar-mobile {
        position: relative;
      }
      .lux-menubar-mobile-hamburger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--ds-text-primary);
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
      }
      .lux-menubar-mobile-backdrop {
        position: fixed;
        inset: 0;
        z-index: 900;
        background: var(--ds-bg-overlay);
      }
      .lux-menubar-mobile-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 910;
        min-width: 220px;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-md);
        box-shadow: var(--ds-shadow-lg);
        padding: 0.5rem 0;
      }
      .lux-menubar-mobile-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
        cursor: pointer;
        text-align: left;
        transition: background 0.15s;
      }
      .lux-menubar-mobile-item:active {
        background: var(--ds-bg-elevated);
      }
      .lux-menubar-mobile-item-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .lux-menubar-mobile-item-icon {
        font-size: 1.125rem;
        color: var(--ds-text-secondary);
      }
      .lux-menubar-mobile-chevron {
        margin-left: auto;
        font-size: 0.875rem;
        color: var(--ds-text-muted);
      }
      .lux-menubar-mobile-separator {
        margin: 0.25rem 0;
        border: none;
        border-top: 1px solid var(--ds-border);
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileMenubar extends MenubarBase {
  protected isOpen = signal(false);

  toggleOpen(): void {
    this.isOpen.update((v) => !v);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onItemClick(item: any): void {
    if (item.items?.length) return;
    this.runCommand(item);
    this.close();
  }
}

