import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface TourStep {
  title: string;
  description: string;
  target?: string;
  position?: "top" | "bottom" | "left" | "right" | "center";
  icon?: string;
}

@Component({
  selector: "app-tour",

  imports: [AppIcon],
  template: `
    @if (visible()) {
      <div class="tour-backdrop" (click)="skip()"></div>

      <div
        class="tour-popup"
        [style]="popupStyle()"
        [class.tour-popup-center]="!currentStep().target"
      >
        <div class="tour-header">
          @if (currentStep().icon) {
            <app-icon [icon]="currentStep().icon!" class="tour-step-icon" />
          }
          <strong class="tour-step-title">{{ currentStep().title }}</strong>
        </div>

        <p class="tour-step-desc">{{ currentStep().description }}</p>

        @if (currentStep().target) {
          <div class="tour-highlight" [style]="highlightStyle()"></div>
        }

        <div class="tour-footer">
          <div class="tour-dots">
            @for (step of steps(); track $index) {
              <span
                class="tour-dot"
                [class.tour-dot-active]="$index === currentIndex()"
              ></span>
            }
          </div>

          <div class="tour-actions">
            <button class="tour-btn tour-btn-ghost" (click)="skip()">
              Saltar
            </button>

            @if (currentIndex() > 0) {
              <button class="tour-btn tour-btn-ghost" (click)="prev()">
                <app-icon icon="mdi:chevron-left" />
                Anterior
              </button>
            }

            @if (isLast()) {
              <button class="tour-btn tour-btn-primary" (click)="finish()">
                Finalizar
              </button>
            } @else {
              <button class="tour-btn tour-btn-primary" (click)="next()">
                Siguiente
                <app-icon icon="mdi:chevron-right" />
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .tour-backdrop {
        position: fixed;
        inset: 0;
        background: color-mix(in srgb, black 45%, transparent);
        z-index: 9000;
      }
      .tour-popup {
        position: fixed;
        z-index: 9001;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-xl);
        box-shadow: var(--ds-shadow-xl);
        padding: 1rem 1.25rem;
        max-width: 380px;
        width: calc(100vw - 2rem);
      }
      .tour-popup-center {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .tour-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
      }
      .tour-step-icon {
        font-size: 1.25rem;
        color: var(--ds-primary);
      }
      .tour-step-title {
        font-size: var(--ds-font-size-body);
        color: var(--ds-text-primary);
      }
      .tour-step-desc {
        margin: 0 0 0.75rem;
        font-size: var(--ds-font-size-table);
        color: var(--ds-text-secondary);
        line-height: 1.5;
      }
      .tour-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .tour-dots {
        display: flex;
        gap: 0.375rem;
      }
      .tour-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--ds-border);
        transition: background 0.2s;
      }
      .tour-dot-active {
        background: var(--ds-primary);
      }
      .tour-actions {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }
      .tour-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.25rem;
        padding: 0.375rem 0.75rem;
        border-radius: var(--ds-radius-md);
        font-size: var(--ds-font-size-table);
        cursor: pointer;
        transition: all 0.12s;
        border: none;
      }
      .tour-btn-ghost {
        background: transparent;
        color: var(--ds-text-secondary);
      }
      .tour-btn-ghost:hover {
        background: var(--ds-bg-hover);
      }
      .tour-btn-primary {
        background: var(--ds-primary);
        color: var(--ds-on-primary);
      }
      .tour-btn-primary:hover {
        filter: brightness(1.08);
      }
      .tour-highlight {
        position: fixed;
        z-index: 9000;
        pointer-events: none;
        border-radius: var(--ds-radius-lg);
        box-shadow:
          0 0 0 4px var(--ds-primary),
          0 0 0 9999px rgba(0, 0, 0, 0.45);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class Tour {
  steps = input.required<TourStep[]>();

  visible = model(false);
  currentIndex = signal(0);

  currentStep = computed(
    () => this.steps()[this.currentIndex()] || this.steps()[0],
  );
  isLast = computed(() => this.currentIndex() >= this.steps().length - 1);

  popupStyle = computed<Record<string, string>>(() => {
    const step = this.currentStep();
    if (!step.target) {
      return {};
    }
    const el = document.querySelector(step.target);
    if (!el) return {};
    const rect = el.getBoundingClientRect();
    const pos = step.position || "bottom";
    const gap = 12;

    const styles: Record<string, string> = { position: "fixed" };
    switch (pos) {
      case "top":
        styles.left = `${rect.left + rect.width / 2}px`;
        styles.top = `${rect.top - gap}px`;
        styles.transform = "translate(-50%, -100%)";
        break;
      case "bottom":
        styles.left = `${rect.left + rect.width / 2}px`;
        styles.top = `${rect.bottom + gap}px`;
        styles.transform = "translateX(-50%)";
        break;
      case "left":
        styles.left = `${rect.left - gap}px`;
        styles.top = `${rect.top + rect.height / 2}px`;
        styles.transform = "translate(-100%, -50%)";
        break;
      case "right":
        styles.left = `${rect.right + gap}px`;
        styles.top = `${rect.top + rect.height / 2}px`;
        styles.transform = "translateY(-50%)";
        break;
    }
    return styles;
  });

  highlightStyle = computed<Record<string, string>>(() => {
    const step = this.currentStep();
    if (!step.target) return { display: "none" };
    const el = document.querySelector(step.target);
    if (!el) return {};
    const rect = el.getBoundingClientRect();
    return {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      pointerEvents: "none",
    };
  });

  next(): void {
    if (!this.isLast()) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  prev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  skip(): void {
    this.visible.set(false);
    this.currentIndex.set(0);
  }

  finish(): void {
    this.visible.set(false);
    this.currentIndex.set(0);
  }

  start(): void {
    this.currentIndex.set(0);
    this.visible.set(true);
  }
}
