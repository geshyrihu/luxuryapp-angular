import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { StepsBase } from "@ui/base/steps.base";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-steps",

  imports: [AppIcon],
  template: `
    <ol class="app-steps" [class]="styleClass()">
      @for (item of model() ?? []; track $index; let i = $index; let last = $last) {
        <li
          class="app-steps-item"
          [class.app-steps-item-active]="i === activeIndex()"
          [class.app-steps-item-done]="i < activeIndex()"
          [class.app-steps-item-clickable]="!readonly()"
        >
          <button
            type="button"
            class="app-steps-button"
            [disabled]="readonly()"
            [attr.aria-current]="i === activeIndex() ? 'step' : null"
            (click)="activeIndex.set(i)"
          >
            <span class="app-steps-index">
              @if (i < activeIndex()) {
                <app-icon icon="material-symbols-light:check" />
              } @else {
                {{ i + 1 }}
              }
            </span>
            <span class="app-steps-label">{{ item.label }}</span>
          </button>
          @if (!last) {
            <span class="app-steps-connector"></span>
          }
        </li>
      }
    </ol>
  `,
  styles: [
    `
      .app-steps { display: flex; list-style: none; padding: 0; margin: 0; width: 100%; }
      .app-steps-item { display: flex; align-items: center; flex: 1 1 0; }
      .app-steps-item:last-child { flex: 0 0 auto; }
      .app-steps-button {
        display: flex; align-items: center; gap: 0.5rem;
        background: none; border: 0; padding: 0; cursor: default;
      }
      .app-steps-item-clickable .app-steps-button { cursor: pointer; }
      .app-steps-index {
        width: 1.75rem; height: 1.75rem; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid var(--ds-border-strong, #adb5bd);
        color: var(--ds-text-secondary); font-size: 0.8rem; font-weight: 600;
        flex-shrink: 0;
      }
      .app-steps-item-active .app-steps-index { border-color: var(--ds-primary); color: var(--ds-primary); }
      .app-steps-item-done .app-steps-index { border-color: var(--ds-primary); background: var(--ds-primary); color: var(--ds-on-primary); }
      .app-steps-label { font-size: var(--ds-font-size-body); color: var(--ds-text-primary); white-space: nowrap; }
      .app-steps-connector { flex: 1 1 auto; height: 2px; background: var(--ds-border-strong, #dee2e6); margin: 0 0.5rem; }
      .app-steps-item-done .app-steps-connector { background: var(--ds-primary); }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class AppSteps extends StepsBase {}
