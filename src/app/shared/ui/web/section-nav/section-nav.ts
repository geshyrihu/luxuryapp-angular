import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { AppIcon, type AppIconName } from "../../shared/app-icon/app-icon";

export interface LxSectionNavItem {
  label: string;
  value: string;
  icon?: AppIconName | string;
  disabled?: boolean;
}

@Component({
  selector: "lux-section-nav",
  imports: [AppIcon],
  template: `
    <nav class="lux-section-nav" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track item.value) {
        <button
          type="button"
          class="lux-section-nav__button"
          [class.lux-section-nav__button--active]="activeValue() === item.value"
          [disabled]="item.disabled"
          [attr.aria-current]="activeValue() === item.value ? 'page' : null"
          (click)="select(item)"
        >
          @if (item.icon) {
            <app-icon class="lux-section-nav__icon" [icon]="item.icon" />
          }
          <span class="lux-section-nav__label">{{ item.label }}</span>
        </button>
      }
    </nav>
  `,
  styles: [
    `
      :host {
        display: block;
        width: min(100%, 1080px);
      }

      .lux-section-nav {
        display: flex;
        flex-wrap: wrap;
        gap: 0.7rem;
        width: 100%;
      }

      .lux-section-nav__button {
        align-items: center;
        background: var(--ds-surface);
        border: 2px solid var(--ds-border);
        border-radius: 0.75rem;
        color: var(--ds-text-primary);
        cursor: pointer;
        display: inline-flex;
        font-weight: 700;
        justify-content: center;
        line-height: 1.15;
        min-height: 3rem;
        padding: 0.7rem 1.1rem;
        text-align: center;
        transition:
          background-color 160ms ease,
          border-color 160ms ease,
          box-shadow 160ms ease,
          color 160ms ease,
          transform 160ms ease;
        width: 205px;
      }

      .lux-section-nav__button:hover:not(:disabled) {
        border-color: var(--ds-primary);
        box-shadow: 0 8px 18px rgb(15 23 42 / 0.1);
        transform: translateY(-1px);
      }

      .lux-section-nav__button--active {
        background: color-mix(
          in srgb,
          var(--ds-primary) 10%,
          var(--ds-surface)
        );
        border-color: var(--ds-primary);
        box-shadow: inset 0 0 0 1px var(--ds-primary);
      }

      .lux-section-nav__button:focus-visible {
        outline: 3px solid
          color-mix(in srgb, var(--ds-primary) 30%, transparent);
        outline-offset: 2px;
      }

      .lux-section-nav__button:disabled {
        cursor: not-allowed;
        opacity: 0.55;
      }

      .lux-section-nav__icon {
        align-items: center;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: 1.35rem;
        justify-content: center;
        line-height: 1;
        margin-right: 0.85rem;
      }

      .lux-section-nav__label {
        align-items: center;
        display: inline-flex;
        min-height: 1.35rem;
      }

      @media (max-width: 640px) {
        .lux-section-nav__button {
          width: 100%;
        }
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LxSectionNav {
  items = input<LxSectionNavItem[]>([]);
  activeValue = input<string>("");
  ariaLabel = input("Navegación de secciones");

  valueChange = output<string>();
  itemSelected = output<LxSectionNavItem>();

  select(item: LxSectionNavItem): void {
    if (item.disabled) return;

    this.valueChange.emit(item.value);
    this.itemSelected.emit(item);
  }
}
