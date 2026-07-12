import { Component, ViewEncapsulation, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonButton } from "@ionic/angular/standalone";
import { MenubarBase } from "@ui/base/menubar.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "ili-menubar",

  imports: [RouterModule, IonButton, AppIcon],
  template: `
    <div class="ili-menubar">
      <button
        class="ili-menubar-hamburger"
        (click)="toggleOpen()"
        aria-label="Menú"
      >
        <app-icon icon="mdi:menu" />
      </button>
      @if (isOpen()) {
        <div class="ili-menubar-backdrop" (click)="close()"></div>
        <div class="ili-menubar-dropdown">
          @for (item of items(); track $index) {
            @if (item.separator) {
              <hr class="ili-menubar-separator" />
            } @else {
              <button
                class="ili-menubar-item"
                [class.ili-menubar-item-disabled]="item.disabled"
                [disabled]="item.disabled"
                (click)="onItemClick(item)"
              >
                @if (item.icon) {
                  <app-icon [icon]="item.icon" class="ili-menubar-item-icon" />
                }
                <span>{{ item.label }}</span>
                @if (item.items?.length) {
                  <app-icon
                    icon="mdi:chevron-right"
                    class="ili-menubar-chevron"
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
      .ili-menubar {
        position: relative;
      }
      .ili-menubar-hamburger {
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
      .ili-menubar-backdrop {
        position: fixed;
        inset: 0;
        z-index: 900;
        background: var(--ds-bg-overlay, rgba(0, 0, 0, 0.4));
      }
      .ili-menubar-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 910;
        min-width: 220px;
        background: var(--ds-bg-surface, #ffffff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 8px);
        box-shadow: var(--ds-shadow-lg);
        padding: 0.5rem 0;
      }
      .ili-menubar-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        padding: 0.625rem 1rem;
        background: none;
        border: none;
        font-size: var(--ds-font-size-body, 0.9375rem);
        color: var(--ds-text-primary);
        cursor: pointer;
        text-align: left;
        transition: background 0.15s;
      }
      .ili-menubar-item:active {
        background: var(--ds-bg-elevated, #f1f3ff);
      }
      .ili-menubar-item-disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
      .ili-menubar-item-icon {
        font-size: 1.125rem;
        color: var(--ds-text-secondary);
      }
      .ili-menubar-chevron {
        margin-left: auto;
        font-size: 0.875rem;
        color: var(--ds-text-muted);
      }
      .ili-menubar-separator {
        margin: 0.25rem 0;
        border: none;
        border-top: 1px solid var(--ds-border, #e2e8f0);
      }
    `,
  ],
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
