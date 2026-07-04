import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TimelineBase } from "@ui/base/timeline.base";

@Component({
  selector: "ili-timeline",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="ili-tl">
      @for (event of events(); track $index; let last = $last) {
        <div class="ili-tl-row">
          <div class="ili-tl-rail">
            <div
              class="ili-tl-marker"
              [style.background]="event.color || 'var(--ds-primary)'"
            >
              @if (event.icon) {
                <app-icon [icon]="event.icon" class="text-white" />
              }
            </div>
            @if (!last) {
              <div class="ili-tl-line"></div>
            }
          </div>

          <div class="ili-tl-card">
            <div class="ili-tl-head">
              <strong>{{ event.title }}</strong>
              @if (event.date) {
                <span class="ili-tl-date">{{ event.date }}</span>
              }
            </div>
            @if (event.description) {
              <p class="ili-tl-desc">{{ event.description }}</p>
            }
            @if (event.badge) {
              <span
                class="ili-tl-badge"
                [style.background]="event.badgeColor || 'var(--ds-primary-light)'"
              >
                {{ event.badge }}
              </span>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .ili-tl {
        display: flex;
        flex-direction: column;
      }
      .ili-tl-row {
        display: flex;
        gap: 0.75rem;
      }
      .ili-tl-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
      }
      .ili-tl-marker {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        border: 2px solid var(--ds-bg-surface, #fff);
        box-shadow: 0 0 0 2px var(--ds-border, #e2e8f0);
      }
      .ili-tl-line {
        flex: 1;
        width: 2px;
        min-height: 1rem;
        background: var(--ds-border, #e2e8f0);
        margin: 2px 0;
      }
      .ili-tl-card {
        flex: 1;
        margin-bottom: 1.25rem;
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-lg, 8px);
        padding: 0.75rem 1rem;
      }
      .ili-tl-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
        color: var(--ds-text-primary);
        font-size: 0.9375rem;
      }
      .ili-tl-date {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
        white-space: nowrap;
      }
      .ili-tl-desc {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
      }
      .ili-tl-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.125rem 0.5rem;
        border-radius: 999px;
        font-size: 0.75rem;
        color: var(--ds-text-primary);
        font-weight: 500;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTimeline extends TimelineBase {}
