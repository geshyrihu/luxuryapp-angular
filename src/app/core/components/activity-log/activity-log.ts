import { Component, input, computed } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

export interface ActivityEntry {
  id: string;
  type: "call" | "meeting" | "note" | "email" | "task" | "system" | "approval";
  title: string;
  description?: string;
  user: string;
  avatar?: string;
  timestamp: Date;
  metadata?: Record<string, string>;
}

const ACTIVITY_ICONS: Record<string, string> = {
  call: "mdi:phone",
  meeting: "mdi:calendar-account",
  note: "mdi:note-text-outline",
  email: "mdi:email-outline",
  task: "mdi:checkbox-marked-circle-outline",
  system: "mdi:cog-outline",
  approval: "mdi:thumb-up-outline",
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: "var(--ds-info)",
  meeting: "var(--ds-warning)",
  note: "var(--ds-text-secondary)",
  email: "var(--ds-primary)",
  task: "var(--ds-success)",
  system: "var(--ds-text-muted)",
  approval: "var(--ds-help)",
};

@Component({
  selector: "app-activity-log",
  standalone: true,
  imports: [CommonModule, AppIcon],
  template: `
    <div class="activity-log-root">
      @if (title()) {
        <strong class="activity-log-title">{{ title() }}</strong>
      }

      @if (groupByDate()) {
        @for (group of groupedEntries(); track group.date) {
          <div class="activity-group">
            <span class="activity-date-header">{{ group.date }}</span>
            @for (entry of group.entries; track entry.id) {
              <div class="activity-entry" (click)="onEntryClick(entry)">
                <div class="activity-dot" [style.background]="getColor(entry.type)"></div>
                <div class="activity-line"></div>
                <div class="activity-card">
                  <div class="activity-header">
                    <app-icon
                      [icon]="getIcon(entry.type)"
                      class="activity-type-icon"
                      [style.color]="getColor(entry.type)"
                    />
                    <strong class="activity-entry-title">{{ entry.title }}</strong>
                    <span class="activity-time">{{ formatTime(entry.timestamp) }}</span>
                  </div>
                  @if (entry.description) {
                    <p class="activity-description">{{ entry.description }}</p>
                  }
                  <div class="activity-footer">
                    <span class="activity-user">{{ entry.user }}</span>
                  </div>
                </div>
              </div>
            }
          }
        } @else {
        @for (entry of entries(); track entry.id) {
          <div class="activity-entry" (click)="onEntryClick(entry)">
            <div class="activity-dot" [style.background]="getColor(entry.type)"></div>
            <div class="activity-line"></div>
            <div class="activity-card">
              <div class="activity-header">
                <app-icon
                  [icon]="getIcon(entry.type)"
                  class="activity-type-icon"
                  [style.color]="getColor(entry.type)"
                />
                <strong class="activity-entry-title">{{ entry.title }}</strong>
                <span class="activity-time">{{ formatTime(entry.timestamp) }}</span>
              </div>
              @if (entry.description) {
                <p class="activity-description">{{ entry.description }}</p>
              }
              <div class="activity-footer">
                <span class="activity-user">{{ entry.user }}</span>
              </div>
            </div>
          </div>
        }
      }

      @if (!entries().length) {
        <div class="activity-empty p-4 text-center text-color-secondary">
          <app-icon icon="mdi:clipboard-text-outline" class="text-3xl mb-2" />
          <p class="text-sm m-0">Sin actividad reciente</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .activity-log-root {
      position: relative;
    }
    .activity-log-title {
      display: block;
      font-size: var(--ds-font-size-section-title, 1.25rem);
      margin-bottom: 1rem;
      color: var(--ds-text-primary);
    }
    .activity-group {
      margin-bottom: 1.5rem;
    }
    .activity-date-header {
      display: block;
      font-size: var(--ds-font-size-help, 0.8125rem);
      font-weight: 600;
      color: var(--ds-text-muted);
      margin-bottom: 0.5rem;
      padding-left: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .activity-entry {
      display: flex;
      gap: 0.75rem;
      position: relative;
      padding-left: 0;
      cursor: pointer;
    }
    .activity-entry:hover .activity-card {
      background: var(--ds-bg-sunken);
    }
    .activity-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 0.5rem;
      flex-shrink: 0;
      z-index: 1;
    }
    .activity-line {
      position: absolute;
      left: 4px;
      top: 16px;
      bottom: -1rem;
      width: 2px;
      background: var(--ds-border, #e2e8f0);
    }
    .activity-group:last-child .activity-entry:last-child .activity-line {
      display: none;
    }
    .activity-card {
      flex: 1;
      padding: 0.5rem 0.75rem;
      border-radius: var(--ds-radius-md, 6px);
      transition: background 0.15s;
      margin-bottom: 0.25rem;
    }
    .activity-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .activity-type-icon {
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .activity-entry-title {
      flex: 1;
      font-size: var(--ds-font-size-body, 0.9375rem);
      color: var(--ds-text-primary);
    }
    .activity-time {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
      white-space: nowrap;
    }
    .activity-description {
      margin: 0.25rem 0 0 1.6rem;
      font-size: var(--ds-font-size-table, 0.875rem);
      color: var(--ds-text-secondary);
    }
    .activity-footer {
      display: flex;
      gap: 1rem;
      margin-top: 0.25rem;
      margin-left: 1.6rem;
    }
    .activity-user {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-muted);
    }
    .activity-meta {
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-disabled);
      background: var(--ds-bg-elevated);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ds-radius-xs, 2px);
    }
    .activity-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
  `],
})
export class ActivityLog {
  title = input<string>("");
  entries = input<ActivityEntry[]>([]);
  groupByDate = input<boolean>(true);

  groupedEntries = computed(() => {
    const items = this.entries();
    if (!items.length) return [];

    const groups = new Map<string, ActivityEntry[]>();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    for (const entry of items) {
      const date = new Date(entry.timestamp);
      let label: string;
      if (date.toDateString() === today.toDateString()) {
        label = "Hoy";
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = "Ayer";
      } else {
        label = date.toLocaleDateString("es-MX", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
      const group = groups.get(label) || [];
      group.push(entry);
      groups.set(label, group);
    }

    return Array.from(groups.entries()).map(([date, entries]) => ({ date, entries }));
  });

  getIcon(type: string): string {
    return ACTIVITY_ICONS[type] || "mdi:circle-small";
  }

  getColor(type: string): string {
    return ACTIVITY_COLORS[type] || "var(--ds-text-muted)";
  }

  formatTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return "Ahora";
    if (diff < 3600000) {
      const mins = Math.floor(diff / 60000);
      return `hace ${mins} min`;
    }
    if (diff < 86400000) {
      const hrs = Math.floor(diff / 3600000);
      return `hace ${hrs}h`;
    }
    return date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });
  }

  onEntryClick(entry: ActivityEntry): void {
    return;
  }
}
