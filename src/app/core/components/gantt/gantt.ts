import {
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";

export interface GanttTask {
  id: string;
  name: string;
  group?: string;
  startDate: Date;
  endDate: Date;
  progress?: number; // 0-100
  color?: string;
  assignee?: string;
  dependencies?: string[];
}

/**
 * AppGantt — Diagrama de Gantt SVG para proyectos y mantenimiento programado.
 * Renderiza tareas como barras horizontales sobre una línea de tiempo.
 * No requiere librerías externas — SVG + CSS puro.
 */
@Component({
  selector: "app-gantt",
  standalone: true,
  imports: [CommonModule, TooltipModule, AppIcon],
  template: `
    <div class="gantt-root">
      <!-- Header -->
      <div class="gantt-header">
        <h3 class="gantt-title">{{ title() }}</h3>
        <div class="gantt-nav">
          <button class="gantt-nav-btn" (click)="shiftDays(-7)" title="Semana anterior">
            <app-icon icon="mdi:chevron-left" />
          </button>
          <span class="gantt-nav-range">{{ rangeLabel() }}</span>
          <button class="gantt-nav-btn" (click)="shiftDays(7)" title="Semana siguiente">
            <app-icon icon="mdi:chevron-right" />
          </button>
        </div>
      </div>

      <!-- Chart body -->
      <div class="gantt-body">
        <!-- Row labels (left panel) -->
        <div class="gantt-labels">
          <div class="gantt-labels-header"></div>
          @for (task of tasks(); track task.id) {
            <div class="gantt-row-label" [title]="task.name">
              <span class="gantt-task-name">{{ task.name }}</span>
              @if (task.assignee) {
                <span class="gantt-task-assignee">{{ task.assignee }}</span>
              }
            </div>
          }
        </div>

        <!-- Timeline area -->
        <div class="gantt-timeline-wrap">
          <!-- Day headers -->
          <div class="gantt-day-headers">
            @for (day of visibleDays(); track day.date.getTime()) {
              <div
                class="gantt-day-header"
                [class.gantt-day-today]="isToday(day.date)"
                [class.gantt-day-weekend]="isWeekend(day.date)"
                [style.width.px]="dayWidth"
              >
                <span class="gantt-day-num">{{ day.date.getDate() }}</span>
                @if (day.date.getDate() === 1 || day.isFirst) {
                  <span class="gantt-month-label">{{ monthLabel(day.date) }}</span>
                }
              </div>
            }
          </div>

          <!-- Task rows -->
          <div class="gantt-rows">
            @for (task of tasks(); track task.id) {
              <div class="gantt-row">
                <!-- Grid lines -->
                @for (day of visibleDays(); track day.date.getTime()) {
                  <div
                    class="gantt-grid-cell"
                    [class.gantt-cell-today]="isToday(day.date)"
                    [class.gantt-cell-weekend]="isWeekend(day.date)"
                    [style.width.px]="dayWidth"
                  ></div>
                }
                <!-- Task bar -->
                @if (taskInView(task)) {
                  <div
                    class="gantt-bar"
                    [style.left.px]="barLeft(task)"
                    [style.width.px]="barWidth(task)"
                    [style.background]="task.color || 'var(--ds-primary)'"
                    [pTooltip]="barTooltip(task)"
                    tooltipPosition="top"
                    (click)="taskClick.emit(task)"
                  >
                    <!-- Progress fill -->
                    @if (task.progress !== undefined && task.progress > 0) {
                      <div
                        class="gantt-bar-progress"
                        [style.width.%]="task.progress"
                      ></div>
                    }
                    <span class="gantt-bar-label">{{ task.name }}</span>
                    @if (task.progress !== undefined) {
                      <span class="gantt-bar-pct">{{ task.progress }}%</span>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gantt-root { display: flex; flex-direction: column; gap: 0.625rem; }
    /* Header */
    .gantt-header { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
    .gantt-title { font-size: var(--ds-font-size-section-title, 1.25rem); font-weight: 600; color: var(--ds-text-primary); margin: 0; }
    .gantt-nav { display: flex; align-items: center; gap: 0.5rem; }
    .gantt-nav-btn { width: 28px; height: 28px; border: 1px solid var(--ds-border); border-radius: var(--ds-radius-sm); background: none; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--ds-text-secondary); font-size: 1rem; transition: all 0.15s; }
    .gantt-nav-btn:hover { background: var(--ds-bg-elevated); color: var(--ds-primary); }
    .gantt-nav-range { font-size: var(--ds-font-size-help, 0.8125rem); font-weight: 600; color: var(--ds-text-primary); white-space: nowrap; }
    /* Body */
    .gantt-body { display: flex; border: 1px solid var(--ds-border, #e2e8f0); border-radius: var(--ds-radius-md, 6px); overflow: hidden; }
    /* Labels */
    .gantt-labels { width: 200px; flex-shrink: 0; border-right: 1px solid var(--ds-border, #e2e8f0); background: var(--ds-bg-surface, #fff); }
    .gantt-labels-header { height: 36px; border-bottom: 1px solid var(--ds-border); background: var(--ds-bg-elevated, #f1f3ff); }
    .gantt-row-label { height: 40px; padding: 0 0.625rem; display: flex; flex-direction: column; justify-content: center; border-bottom: 1px solid var(--ds-border); }
    .gantt-task-name { font-size: var(--ds-font-size-help, 0.8125rem); font-weight: 600; color: var(--ds-text-primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .gantt-task-assignee { font-size: var(--ds-font-size-micro, 0.75rem); color: var(--ds-text-muted); }
    /* Timeline */
    .gantt-timeline-wrap { flex: 1; overflow-x: auto; min-width: 0; }
    /* Day headers */
    .gantt-day-headers { display: flex; height: 36px; background: var(--ds-bg-elevated, #f1f3ff); border-bottom: 1px solid var(--ds-border); position: sticky; top: 0; z-index: 2; }
    .gantt-day-header { display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; position: relative; border-right: 1px solid var(--ds-border); font-size: 0.65rem; color: var(--ds-text-muted); }
    .gantt-day-today { background: var(--ds-primary-100, #dae2ff); color: var(--ds-primary, #003d9b); font-weight: 700; }
    .gantt-day-weekend { background: var(--ds-bg-sunken, #e8edff); }
    .gantt-day-num { font-weight: 600; }
    .gantt-month-label { position: absolute; top: 1px; left: 2px; font-size: 0.55rem; color: var(--ds-text-secondary); font-weight: 600; }
    /* Rows */
    .gantt-rows { position: relative; }
    .gantt-row { display: flex; height: 40px; border-bottom: 1px solid var(--ds-border); position: relative; }
    .gantt-grid-cell { height: 100%; flex-shrink: 0; border-right: 1px solid var(--ds-border); }
    .gantt-cell-today { background: rgba(0,61,155,0.04); }
    .gantt-cell-weekend { background: var(--ds-bg-sunken, #e8edff); }
    /* Bar */
    .gantt-bar {
      position: absolute;
      top: 6px;
      height: 28px;
      border-radius: var(--ds-radius-sm, 4px);
      display: flex;
      align-items: center;
      padding: 0 6px;
      gap: 4px;
      overflow: hidden;
      cursor: pointer;
      transition: opacity 0.15s;
      z-index: 1;
      min-width: 4px;
    }
    .gantt-bar:hover { opacity: 0.88; }
    .gantt-bar-progress {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.2);
      border-radius: inherit;
    }
    .gantt-bar-label { font-size: 0.65rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; position: relative; z-index: 1; }
    .gantt-bar-pct { font-size: 0.6rem; color: rgba(255,255,255,0.8); position: relative; z-index: 1; flex-shrink: 0; }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class AppGantt {
  tasks   = input<GanttTask[]>([]);
  title   = input<string>("Gantt");
  startAt = input<Date | undefined>(undefined);

  taskClick = output<GanttTask>();

  readonly dayWidth = 36;
  readonly visibleDayCount = 28;

  private offsetDays = 0;

  private viewStart = computed(() => {
    const base = this.startAt() ?? this.earliestDate();
    const d = new Date(base);
    d.setDate(d.getDate() + this.offsetDays - 3);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  visibleDays = computed(() => {
    const start = this.viewStart();
    return Array.from({ length: this.visibleDayCount }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return { date: d, isFirst: i === 0 };
    });
  });

  rangeLabel = computed(() => {
    const days = this.visibleDays();
    const fmt = (d: Date) => d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
    return `${fmt(days[0].date)} – ${fmt(days[days.length - 1].date)}`;
  });

  shiftDays(delta: number): void {
    this.offsetDays += delta;
    // Force recompute by modifying a tracked property — Angular 21 computed will re-eval
    (this as unknown as { _shift: number })._shift = this.offsetDays;
  }

  private earliestDate(): Date {
    if (!this.tasks().length) return new Date();
    return new Date(Math.min(...this.tasks().map((t) => t.startDate.getTime())));
  }

  isToday(d: Date): boolean {
    const now = new Date();
    return d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }

  isWeekend(d: Date): boolean { return d.getDay() === 0 || d.getDay() === 6; }

  monthLabel(d: Date): string {
    return d.toLocaleDateString("es-MX", { month: "short" });
  }

  taskInView(task: GanttTask): boolean {
    const start = this.viewStart();
    const end   = this.visibleDays()[this.visibleDayCount - 1].date;
    return task.startDate <= end && task.endDate >= start;
  }

  barLeft(task: GanttTask): number {
    const diff = Math.max(0, (task.startDate.getTime() - this.viewStart().getTime()) / 86400000);
    return diff * this.dayWidth;
  }

  barWidth(task: GanttTask): number {
    const start = this.viewStart();
    const endView = this.visibleDays()[this.visibleDayCount - 1].date;
    const s = Math.max(task.startDate.getTime(), start.getTime());
    const e = Math.min(task.endDate.getTime(), endView.getTime() + 86400000);
    return Math.max(4, ((e - s) / 86400000) * this.dayWidth);
  }

  barTooltip(task: GanttTask): string {
    const fmt = (d: Date) => d.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
    const prog = task.progress !== undefined ? ` — ${task.progress}% completado` : "";
    return `${task.name}: ${fmt(task.startDate)} → ${fmt(task.endDate)}${prog}`;
  }
}
