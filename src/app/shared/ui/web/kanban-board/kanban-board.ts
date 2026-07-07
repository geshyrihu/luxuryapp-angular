import { Component, input, output, signal, ViewEncapsulation, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ButtonModule } from "primeng/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

export interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  value?: number;
  currency?: string;
  assignee?: string;
  assigneeAvatar?: string;
  stage: string;
  priority?: "low" | "medium" | "high" | "critical";
  tags?: string[];
  dueDate?: Date;
  metadata?: Record<string, string>;
}

export interface KanbanStage {
  id: string;
  title: string;
  color: string;
  cards: KanbanCard[];
}

const PRIORITY_ICONS: Record<string, string> = {
  low: "mdi:arrow-down-circle-outline",
  medium: "mdi:circle-outline",
  high: "mdi:arrow-up-circle-outline",
  critical: "mdi:alert-circle-outline",
};

const PRIORITY_COLORS: Record<string, string> = {
  low: "var(--ds-text-muted)",
  medium: "var(--ds-info)",
  high: "var(--ds-warning)",
  critical: "var(--ds-danger)",
};

@Component({
  selector: "app-kanban-board",
  standalone: true,
  imports: [CommonModule, ButtonModule, AppIcon],
  template: `
    <div class="kanban-root">
      <div class="kanban-columns">
        @for (stage of stages(); track stage.id) {
          <div class="kanban-column" [style.border-top-color]="stage.color">
            <div class="kanban-column-header" [style.background]="stage.color + '15'">
              <div class="flex align-items-center gap-2 flex-1">
                <div class="kanban-stage-dot" [style.background]="stage.color"></div>
                <strong class="kanban-stage-title">{{ stage.title }}</strong>
                <span class="kanban-card-count">{{ stage.cards.length }}</span>
              </div>
              @if (showAddCard()) {
                <p-button
                  [rounded]="true"
                  [text]="true"
                  size="small"
                  severity="secondary"
                  (onClick)="addCard.emit(stage.id)"
                >
                  <app-icon icon="mdi:plus" />
                </p-button>
              }
            </div>

            <div
              class="kanban-cards"
              (dragover)="onDragOver($event)"
              (dragleave)="onDragLeave($event)"
              (drop)="onDrop($event, stage.id)"
              [class.kanban-drop-target]="dragTarget() === stage.id"
            >
              @for (card of stage.cards; track card.id) {
                <div
                  class="kanban-card"
                  [draggable]="true"
                  [class.kanban-card-dragging]="dragCard() === card.id"
                  (dragstart)="onDragStart($event, card, stage.id)"
                  (dragend)="onDragEnd()"
                  (click)="onCardClick(card)"
                >
                  <div class="kanban-card-header">
                    <strong class="kanban-card-title">{{ card.title }}</strong>
                    @if (card.priority) {
                      <app-icon
                        [icon]="getPriorityIcon(card.priority)"
                        [style.color]="getPriorityColor(card.priority)"
                        class="kanban-priority"
                        [title]="card.priority"
                      />
                    }
                  </div>

                  @if (card.description) {
                    <p class="kanban-card-desc">{{ card.description }}</p>
                  }

                  @if (card.tags?.length) {
                    <div class="flex gap-1 flex-wrap">
                      @for (tag of card.tags; track tag) {
                        <span class="kanban-tag">{{ tag }}</span>
                      }
                    </div>
                  }

                  <div class="kanban-card-footer">
                    @if (card.value != null) {
                      <span class="kanban-value">
                        {{ formatCurrency(card.value, card.currency) }}
                      </span>
                    }
                    @if (card.assignee) {
                      <div class="kanban-assignee" [title]="card.assignee">
                        @if (card.assigneeAvatar) {
                          <img [src]="card.assigneeAvatar" [alt]="card.assignee" class="kanban-avatar" />
                        } @else {
                          <div class="kanban-avatar-text">
                            {{ card.assignee.charAt(0).toUpperCase() }}
                          </div>
                        }
                      </div>
                    }
                  </div>

                  @if (card.dueDate) {
                    <div class="kanban-duedate" [class.kanban-overdue]="isOverdue(card.dueDate)">
                      <app-icon icon="mdi:calendar-clock" class="text-xs" />
                      {{ formatDate(card.dueDate) }}
                    </div>
                  }
                </div>
              } @empty {
                <div class="kanban-empty">
                  <app-icon icon="mdi:inbox-outline" class="text-xl text-color-muted" />
                  <span class="text-xs text-color-muted">Sin elementos</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .kanban-root {
      width: 100%;
      overflow-x: auto;
      padding-bottom: 1rem;
    }
    .kanban-columns {
      display: flex;
      gap: 1rem;
      min-height: 400px;
    }
    .kanban-column {
      flex: 1;
      min-width: 280px;
      max-width: 360px;
      background: var(--ds-bg-elevated, #f1f3ff);
      border-radius: var(--ds-radius-lg, 8px);
      border-top: 3px solid;
      display: flex;
      flex-direction: column;
    }
    .kanban-column-header {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: var(--ds-radius-lg, 8px) var(--ds-radius-lg, 8px) 0 0;
    }
    .kanban-stage-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .kanban-stage-title {
      font-size: var(--ds-font-size-table, 0.875rem);
      color: var(--ds-text-primary);
    }
    .kanban-card-count {
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
      background: var(--ds-bg-surface);
      padding: 0.1rem 0.4rem;
      border-radius: var(--ds-radius-full, 9999px);
      min-width: 1.2rem;
      text-align: center;
    }
    .kanban-cards {
      padding: 0.5rem;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-height: 100px;
      transition: background 0.15s;
    }
    .kanban-drop-target {
      background: var(--ds-bg-sunken, #e8edff);
      border-radius: var(--ds-radius-sm, 4px);
    }
    .kanban-card {
      background: var(--ds-bg-surface, #ffffff);
      border: 1px solid var(--ds-border, #e2e8f0);
      border-radius: var(--ds-radius-md, 6px);
      padding: 0.75rem;
      cursor: pointer;
      transition: box-shadow 0.15s, transform 0.15s;
    }
    .kanban-card:hover {
      box-shadow: var(--ds-shadow-sm);
      transform: translateY(-1px);
    }
    .kanban-card-dragging {
      opacity: 0.5;
      transform: rotate(3deg);
    }
    .kanban-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
    }
    .kanban-card-title {
      font-size: var(--ds-font-size-table, 0.875rem);
      color: var(--ds-text-primary);
      line-height: 1.3;
    }
    .kanban-priority {
      font-size: 1.1rem;
      flex-shrink: 0;
    }
    .kanban-card-desc {
      font-size: var(--ds-font-size-help, 0.8125rem);
      color: var(--ds-text-secondary);
      margin: 0.25rem 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .kanban-tag {
      font-size: var(--ds-font-size-micro, 0.75rem);
      padding: 0.1rem 0.4rem;
      background: var(--ds-primary-50, #edf1ff);
      color: var(--ds-primary);
      border-radius: var(--ds-radius-xs, 2px);
    }
    .kanban-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
    }
    .kanban-value {
      font-size: var(--ds-font-size-table, 0.875rem);
      font-weight: 600;
      color: var(--ds-text-primary);
    }
    .kanban-assignee {
      flex-shrink: 0;
    }
    .kanban-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      object-fit: cover;
    }
    .kanban-avatar-text {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--ds-primary);
      color: var(--ds-text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--ds-font-size-micro, 0.75rem);
      font-weight: 600;
    }
    .kanban-duedate {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: var(--ds-font-size-micro, 0.75rem);
      color: var(--ds-text-muted);
      margin-top: 0.25rem;
    }
    .kanban-overdue {
      color: var(--ds-danger);
    }
    .kanban-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      padding: 1rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class KanbanBoard {
  stages = input.required<KanbanStage[]>();
  showAddCard = input<boolean>(true);

  cardMoved = output<{ cardId: string; fromStage: string; toStage: string }>();
  cardClicked = output<KanbanCard>();
  addCard = output<string>();

  dragCard = signal<string | null>(null);
  dragSource = signal<string | null>(null);
  dragTarget = signal<string | null>(null);

  onDragStart(event: DragEvent, card: KanbanCard, stageId: string): void {
    this.dragCard.set(card.id);
    this.dragSource.set(stageId);
    event.dataTransfer?.setData("text/plain", JSON.stringify({ cardId: card.id, fromStage: stageId }));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
  }

  onDragLeave(_event: DragEvent): void {
    this.dragTarget.set(null);
  }

  onDrop(event: DragEvent, targetStage: string): void {
    event.preventDefault();
    this.dragTarget.set(null);

    const sourceStage = this.dragSource();
    const cardId = this.dragCard();

    if (sourceStage && cardId && sourceStage !== targetStage) {
      this.cardMoved.emit({ cardId, fromStage: sourceStage, toStage: targetStage });
    }

    this.dragCard.set(null);
    this.dragSource.set(null);
  }

  onDragEnd(): void {
    this.dragCard.set(null);
    this.dragSource.set(null);
    this.dragTarget.set(null);
  }

  onCardClick(card: KanbanCard): void {
    this.cardClicked.emit(card);
  }

  getPriorityIcon(priority: string): string {
    return PRIORITY_ICONS[priority] || "mdi:circle-outline";
  }

  getPriorityColor(priority: string): string {
    return PRIORITY_COLORS[priority] || "var(--ds-text-muted)";
  }

  formatCurrency(value: number, currency?: string): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: currency || "MXN",
    }).format(value);
  }

  isOverdue(date: Date): boolean {
    return new Date(date) < new Date();
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
    });
  }
}
