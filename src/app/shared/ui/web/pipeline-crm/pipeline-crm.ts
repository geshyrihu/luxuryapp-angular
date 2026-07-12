import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
} from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

export interface PipelineDeal {
  id: string;
  title: string;
  company?: string;
  value?: number;
  owner?: string;
  daysInStage?: number;
  priority?: "low" | "medium" | "high";
}

export interface PipelineStage {
  id: string;
  name: string;
  color?: string;
  deals: PipelineDeal[];
  maxDeals?: number;
}

/**
 * AppPipelineCrm — Vista de pipeline CRM horizontal con etapas y tarjetas de deal.
 * Diferente de KanbanBoard genérico: orientado a valor de negocio, probabilidad y dueños de deal.
 */
@Component({
  selector: "app-pipeline-crm",

  imports: [ButtonModule, TagModule, LxTooltipDirective, AppIcon],
  template: `
    <div class="pipeline-root">
      <!-- Header -->
      <div class="pipeline-header">
        <h3 class="pipeline-title">{{ title() }}</h3>
        <div class="pipeline-summary">
          <span class="pipeline-stat">
            <app-icon icon="mdi:briefcase-outline" />
            {{ totalDeals() }} deals
          </span>
          <span class="pipeline-stat">
            <app-icon icon="mdi:currency-usd" />
            {{ formattedTotal() }}
          </span>
        </div>
      </div>

      <!-- Stages -->
      <div class="pipeline-stages">
        @for (stage of stages(); track stage.id) {
          <div class="pipeline-stage">
            <!-- Stage header -->
            <div
              class="pipeline-stage-header"
              [style.border-top-color]="stage.color || 'var(--ds-primary)'"
            >
              <span class="pipeline-stage-name">{{ stage.name }}</span>
              <div class="pipeline-stage-meta">
                <span class="pipeline-stage-count">{{
                  stage.deals.length
                }}</span>
                @if (stageTotal(stage) > 0) {
                  <span class="pipeline-stage-value">{{
                    formatCurrency(stageTotal(stage))
                  }}</span>
                }
              </div>
            </div>

            <!-- Deals -->
            <div class="pipeline-deals">
              @for (deal of stage.deals; track deal.id) {
                <div
                  class="pipeline-deal-card"
                  [class.pipeline-deal-priority-high]="deal.priority === 'high'"
                  [class.pipeline-deal-priority-medium]="
                    deal.priority === 'medium'
                  "
                  (click)="dealClick.emit({ deal, stageId: stage.id })"
                >
                  <div class="pipeline-deal-header">
                    <span class="pipeline-deal-title">{{ deal.title }}</span>
                    @if (deal.priority === "high") {
                      <app-icon
                        icon="mdi:flag"
                        class="text-sm"
                        style="color: var(--ds-danger)"
                        lxTooltip="Alta prioridad"
                      />
                    }
                  </div>

                  @if (deal.company) {
                    <span class="pipeline-deal-company">
                      <app-icon
                        icon="mdi:office-building-outline"
                        class="text-xs"
                      />
                      {{ deal.company }}
                    </span>
                  }

                  <div class="pipeline-deal-footer">
                    @if (deal.value) {
                      <strong class="pipeline-deal-value">{{
                        formatCurrency(deal.value)
                      }}</strong>
                    }
                    @if (deal.daysInStage !== undefined) {
                      <span
                        class="pipeline-deal-days"
                        [class.pipeline-deal-days-warn]="deal.daysInStage > 14"
                        [lxTooltip]="deal.daysInStage + ' días en esta etapa'"
                      >
                        <app-icon icon="mdi:clock-outline" class="text-xs" />
                        {{ deal.daysInStage }}d
                      </span>
                    }
                    @if (deal.owner) {
                      <span
                        class="pipeline-deal-owner"
                        [lxTooltip]="deal.owner"
                      >
                        {{ ownerInitials(deal.owner) }}
                      </span>
                    }
                  </div>
                </div>
              }

              <!-- Add deal button -->
              <button
                class="pipeline-add-deal"
                (click)="addDeal.emit(stage.id)"
                [attr.aria-label]="'Agregar deal a ' + stage.name"
              >
                <app-icon icon="mdi:plus" class="text-sm" />
                Agregar deal
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [
    `
      .pipeline-root {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        min-width: 0;
      }
      /* Header */
      .pipeline-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .pipeline-title {
        font-size: var(--ds-font-size-section-title, 1.25rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .pipeline-summary {
        display: flex;
        gap: 1rem;
      }
      .pipeline-stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: var(--ds-font-size-label, 0.875rem);
        color: var(--ds-text-secondary);
      }
      /* Stages scrollable row */
      .pipeline-stages {
        display: flex;
        gap: 0.75rem;
        overflow-x: auto;
        padding-bottom: 0.5rem;
        scrollbar-width: thin;
      }
      .pipeline-stage {
        flex: 0 0 240px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .pipeline-stage-header {
        border-top: 3px solid var(--ds-primary);
        padding-top: 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
      }
      .pipeline-stage-name {
        font-size: var(--ds-font-size-label, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      .pipeline-stage-meta {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .pipeline-stage-count {
        font-size: var(--ds-font-size-micro, 0.75rem);
        background: var(--ds-bg-elevated, #f1f3ff);
        color: var(--ds-text-secondary);
        border-radius: var(--ds-radius-full, 9999px);
        padding: 0.1rem 0.45rem;
        font-weight: 600;
      }
      .pipeline-stage-value {
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      /* Deals column */
      .pipeline-deals {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-height: 80px;
      }
      /* Deal card */
      .pipeline-deal-card {
        background: var(--ds-bg-surface, #fff);
        border: 1px solid var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        padding: 0.625rem;
        cursor: pointer;
        transition:
          box-shadow 0.15s,
          border-color 0.15s;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .pipeline-deal-card:hover {
        box-shadow: var(--ds-shadow-sm);
        border-color: var(--ds-primary, #003d9b);
      }
      .pipeline-deal-priority-high {
        border-left: 3px solid var(--ds-danger, #ba1a1a);
      }
      .pipeline-deal-priority-medium {
        border-left: 3px solid var(--ds-warning, #b45309);
      }
      .pipeline-deal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.25rem;
      }
      .pipeline-deal-title {
        font-size: var(--ds-font-size-table, 0.875rem);
        font-weight: 600;
        color: var(--ds-text-primary);
        line-height: 1.3;
      }
      .pipeline-deal-company {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .pipeline-deal-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 0.25rem;
      }
      .pipeline-deal-value {
        font-size: var(--ds-font-size-table, 0.875rem);
        color: var(--ds-primary, #003d9b);
      }
      .pipeline-deal-days {
        display: flex;
        align-items: center;
        gap: 0.15rem;
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
      }
      .pipeline-deal-days-warn {
        color: var(--ds-warning, #b45309);
      }
      .pipeline-deal-owner {
        width: 22px;
        height: 22px;
        border-radius: 50%;
        background: var(--ds-primary, #003d9b);
        color: #fff;
        font-size: 0.625rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
      }
      /* Add deal */
      .pipeline-add-deal {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        background: none;
        border: 1px dashed var(--ds-border, #e2e8f0);
        border-radius: var(--ds-radius-md, 6px);
        padding: 0.5rem;
        font-size: var(--ds-font-size-micro, 0.75rem);
        color: var(--ds-text-muted);
        cursor: pointer;
        width: 100%;
        justify-content: center;
        transition:
          border-color 0.15s,
          color 0.15s;
      }
      .pipeline-add-deal:hover {
        border-color: var(--ds-primary, #003d9b);
        color: var(--ds-primary, #003d9b);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class AppPipelineCrm {
  title = input<string>("Pipeline CRM");
  stages = input<PipelineStage[]>([]);

  dealClick = output<{ deal: PipelineDeal; stageId: string }>();
  addDeal = output<string>();

  totalDeals = computed(() =>
    this.stages().reduce((sum, s) => sum + s.deals.length, 0),
  );

  totalValue = computed(() =>
    this.stages().reduce(
      (sum, s) => sum + s.deals.reduce((ds, d) => ds + (d.value ?? 0), 0),
      0,
    ),
  );

  formattedTotal = computed(() => this.formatCurrency(this.totalValue()));

  stageTotal(stage: PipelineStage): number {
    return stage.deals.reduce((sum, d) => sum + (d.value ?? 0), 0);
  }

  formatCurrency(value: number): string {
    if (!value) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  }

  ownerInitials(owner: string): string {
    return owner
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }
}
