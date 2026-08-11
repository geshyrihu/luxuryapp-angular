import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from "@angular/core";
import { TimelineBase } from "@ui/base/timeline.base";
import { TimelineModule } from "primeng/timeline";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export { type TimelineEvent } from "@ui/base/timeline.base";

@Component({
  selector: "app-timeline",

  imports: [TimelineModule, AppIcon],
  template: `
    <p-timeline [value]="events()" [align]="align()" [layout]="layout()">
      <ng-template #marker let-event>
        <div
          class="timeline-marker"
          [style.background]="event.color || 'var(--ds-primary)'"
        >
          @if (event.icon) {
            <app-icon [icon]="event.icon" class="text-sm text-white" />
          }
        </div>
      </ng-template>
      <ng-template #content let-event>
        <div class="timeline-card">
          <div class="timeline-card-header">
            <strong>{{ event.title }}</strong>
            @if (event.date) {
              <span class="timeline-date">{{ event.date }}</span>
            }
          </div>
          @if (event.description) {
            <p class="timeline-desc">{{ event.description }}</p>
          }
          @if (event.badge) {
            <span
              class="timeline-badge"
              [style.background]="event.badgeColor || 'var(--ds-primary-light)'"
            >
              {{ event.badge }}
            </span>
          }
        </div>
      </ng-template>
    </p-timeline>
  `,
  styles: [
    `
      .timeline-marker {
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
      .timeline-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-radius: var(--ds-radius-lg);
        padding: 0.75rem 1rem;
        box-shadow: var(--ds-shadow-sm);
      }
      .timeline-card-header {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.5rem;
        color: var(--ds-text-primary);
        font-size: var(--ds-font-size-body);
      }
      .timeline-date {
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-muted);
        white-space: nowrap;
      }
      .timeline-desc {
        margin: 0.25rem 0 0;
        font-size: var(--ds-font-size-table);
        color: var(--ds-text-secondary);
      }
      .timeline-badge {
        display: inline-block;
        margin-top: 0.5rem;
        padding: 0.125rem 0.5rem;
        border-radius: var(--ds-radius-full);
        font-size: var(--ds-font-size-micro);
        color: var(--ds-text-primary);
        font-weight: 500;
      }
      .p-timeline-event-opposite {
        display: none;
      }
      app-timeline .p-timeline-event {
        padding-bottom: 1.5rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class Timeline extends TimelineBase {}
