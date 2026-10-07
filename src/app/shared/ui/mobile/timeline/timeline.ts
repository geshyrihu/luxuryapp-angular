import { Component, ViewEncapsulation } from "@angular/core";
import { TimelineBase } from "@ui/core/timeline.base";
import { AppIconMobile } from "@ui/mobile/app-icon/app-icon";

@Component({
  selector: "lux-timeline-mobile",

  imports: [AppIconMobile],
  template: `
    <div class="lux-timeline-mobile">
      @for (event of events(); track $index; let last = $last) {
        <div class="lux-timeline-mobile-row">
          <div class="lux-timeline-mobile-rail">
            <div
              class="lux-timeline-mobile-marker"
              [style.background]="event.color || 'var(--ds-primary)'"
            >
              @if (event.icon) {
                <lux-icon-mobile [icon]="event.icon" class="text-white" />
              }
            </div>
            @if (!last) {
              <div class="lux-timeline-mobile-line"></div>
            }
          </div>

          <div class="lux-timeline-mobile-card">
            <div class="lux-timeline-mobile-head">
              <strong>{{ event.title }}</strong>
              @if (event.date) {
                <span class="lux-timeline-mobile-date">{{ event.date }}</span>
              }
            </div>
            @if (event.description) {
              <p class="lux-timeline-mobile-desc">{{ event.description }}</p>
            }
            @if (event.badge) {
              <span
                class="lux-timeline-mobile-badge"
                [style.background]="
                  event.badgeColor || 'var(--ds-primary-light)'
                "
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
      .lux-timeline-mobile {
        display: flex;
        flex-direction: column;
      }
      .lux-timeline-mobile-row {
        display: flex;
        gap: 0.75rem;
      }
      .lux-timeline-mobile-rail {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-shrink: 0;
      }
      .lux-timeline-mobile-marker {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--ds-on-primary);
        border: 2px solid var(--ds-bg-surface);
        box-shadow: 0 0 0 2px var(--ds-border);
      }
      .lux-timeline-mobile-line {
        flex: 1;
        width: 2px;
        min-height: 1rem;
        background: var(--ds-border);
        margin: 2px 0;
      }
      .lux-timeline-mobile-card {
        flex: 1;
        margin-bottom: 1.25rem;
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 0.75rem 1rem;
      }
      .lux-timeline-mobile-head {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
        color: var(--ds-text-primary);
        font-size: 0.9375rem;
      }
      .lux-timeline-mobile-date {
        font-size: 0.8125rem;
        color: var(--ds-text-muted);
        white-space: nowrap;
      }
      .lux-timeline-mobile-desc {
        margin: 0.25rem 0 0;
        font-size: 0.875rem;
        color: var(--ds-text-secondary);
      }
      .lux-timeline-mobile-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.125rem 0.5rem;
        border-radius: 999px;
        font-size: 0.75rem;
        color: var(--ds-text-primary);
        font-weight: 500;
      }
    `],
  encapsulation: ViewEncapsulation.None,
})
export class MobileTimeline extends TimelineBase {}

