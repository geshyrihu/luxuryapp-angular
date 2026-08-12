import { Component, input, output, ViewEncapsulation } from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

export interface Territory {
  id: string;
  name: string;
  region?: string;
  owner?: string;
  ownerAvatar?: string;
  accounts: number;
  revenue: number;
  target?: number;
  active?: boolean;
  color?: string;
}

/**
 * AppTerritoryMap — Vista de territorios de ventas CRM en formato grid.
 * Muestra asignación de zonas, responsables, cuentas y cumplimiento de meta.
 * (No usa mapas externos; layout visual tabular para uso enterprise.)
 */
@Component({
  selector: "app-territory-map",

  imports: [TagModule, LxTooltipDirective, AppIcon],
  template: `
    <div class="tm-root">
      <!-- Header -->
      <div class="tm-header">
        <h3 class="tm-title">{{ title() }}</h3>
        <div class="tm-summary">
          <span class="tm-stat"
            ><app-icon
              icon="material-symbols-light:location-on"
            />{{ territories().length }} territorios</span
          >
          <span class="tm-stat"
            ><app-icon
              icon="material-symbols-light:groups"
            />{{ totalAccounts() }} cuentas</span
          >
          <span class="tm-stat"
            ><app-icon icon="material-symbols-light:attach-money" />{{
              formatCurrency(totalRevenue())
            }}</span
          >
        </div>
      </div>

      <!-- Region groups -->
      @for (region of regions(); track region) {
        <div class="tm-region">
          @if (region) {
            <h4 class="tm-region-title">
              <app-icon icon="material-symbols-light:map" />
              {{ region }}
            </h4>
          }
          <div class="tm-grid">
            @for (t of territoriesByRegion(region); track t.id) {
              <div
                class="tm-card"
                [class.tm-card-inactive]="t.active === false"
                [style.border-left-color]="t.color || 'var(--ds-primary)'"
                (click)="territoryClick.emit(t)"
              >
                <!-- Card header -->
                <div class="tm-card-header">
                  <div class="tm-territory-info">
                    <span class="tm-territory-name">{{ t.name }}</span>
                    @if (t.active === false) {
                      <p-tag
                        value="Inactivo"
                        severity="secondary"
                        styleClass="text-xs"
                      />
                    }
                  </div>
                  <div
                    class="tm-owner-avatar"
                    [style.background]="avatarBg(t)"
                    [lxTooltip]="t.owner ?? ''"
                    tooltipPosition="top"
                  >
                    {{ ownerInitials(t) }}
                  </div>
                </div>

                <!-- Metrics -->
                <div class="tm-metrics">
                  <div class="tm-metric">
                    <span class="tm-metric-val">{{ t.accounts }}</span>
                    <span class="tm-metric-lbl">Cuentas</span>
                  </div>
                  <div class="tm-metric">
                    <span class="tm-metric-val">{{
                      formatCurrencyShort(t.revenue)
                    }}</span>
                    <span class="tm-metric-lbl">Revenue</span>
                  </div>
                  @if (t.target) {
                    <div class="tm-metric">
                      <span
                        class="tm-metric-val"
                        [class.tm-on-target]="attainment(t) >= 100"
                        [class.tm-off-target]="attainment(t) < 70"
                      >
                        {{ attainment(t).toFixed(0) }}%
                      </span>
                      <span class="tm-metric-lbl">Meta</span>
                    </div>
                  }
                </div>

                <!-- Progress bar toward target -->
                @if (t.target) {
                  <div class="tm-progress-bar">
                    <div
                      class="tm-progress-fill"
                      [style.width.%]="Math.min(100, attainment(t))"
                      [style.background]="
                        attainment(t) >= 100
                          ? 'var(--ds-success)'
                          : attainment(t) >= 70
                            ? 'var(--ds-primary)'
                            : 'var(--ds-warning)'
                      "
                    ></div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .tm-root {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      /* Header */
      .tm-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      .tm-title {
        font-size: var(--ds-font-size-section-title);
        font-weight: 600;
        color: var(--ds-text-primary);
        margin: 0;
      }
      .tm-summary {
        display: flex;
        gap: 1rem;
      }
      .tm-stat {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: var(--ds-font-size-help);
        color: var(--ds-text-secondary);
      }
      /* Region */
      .tm-region {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .tm-region-title {
        display: flex;
        align-items: center;
        gap: 0.375rem;
        font-size: var(--ds-font-size-label);
        font-weight: 600;
        color: var(--ds-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        margin: 0;
      }
      .tm-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
        gap: 0.75rem;
      }
      /* Card */
      .tm-card {
        background: var(--ds-bg-surface);
        border: 1px solid var(--ds-border);
        border-left: 4px solid var(--ds-primary);
        border-radius: var(--ds-radius-md);
        padding: 0.75rem;
        cursor: pointer;
        transition: box-shadow 0.15s;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .tm-card:hover {
        box-shadow: var(--ds-shadow-sm);
      }
      .tm-card-inactive {
        opacity: 0.55;
      }
      /* Card header */
      .tm-card-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 0.5rem;
      }
      .tm-territory-info {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        flex-wrap: wrap;
      }
      .tm-territory-name {
        font-size: var(--ds-font-size-label);
        font-weight: 600;
        color: var(--ds-text-primary);
      }
      /* Avatar */
      .tm-owner-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        font-weight: 700;
        color: var(--ds-on-primary);
        cursor: default;
      }
      /* Metrics */
      .tm-metrics {
        display: flex;
        gap: 0;
      }
      .tm-metric {
        flex: 1;
        text-align: center;
        padding: 0.25rem;
        border-right: 1px solid var(--ds-border);
      }
      .tm-metric:last-child {
        border-right: none;
      }
      .tm-metric-val {
        display: block;
        font-size: var(--ds-font-size-label);
        font-weight: 700;
        color: var(--ds-text-primary);
      }
      .tm-metric-lbl {
        font-size: 0.625rem;
        color: var(--ds-text-muted);
        text-transform: uppercase;
      }
      .tm-on-target {
        color: var(--ds-success);
      }
      .tm-off-target {
        color: var(--ds-accent-text-warning);
      }
      /* Progress */
      .tm-progress-bar {
        height: 4px;
        background: var(--ds-bg-elevated);
        border-radius: 2px;
        overflow: hidden;
      }
      .tm-progress-fill {
        height: 100%;
        border-radius: 2px;
        transition: width 0.4s ease;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class AppTerritoryMap {
  territories = input<Territory[]>([]);
  title = input<string>("Mapa de Territorios");

  territoryClick = output<Territory>();

  protected readonly Math = Math;

  regions() {
    return [...new Set(this.territories().map((t) => t.region ?? ""))];
  }

  territoriesByRegion(region: string): Territory[] {
    return this.territories().filter((t) => (t.region ?? "") === region);
  }

  totalAccounts(): number {
    return this.territories().reduce((s, t) => s + t.accounts, 0);
  }
  totalRevenue(): number {
    return this.territories().reduce((s, t) => s + t.revenue, 0);
  }

  attainment(t: Territory): number {
    if (!t.target || t.target === 0) return 0;
    return (t.revenue / t.target) * 100;
  }

  avatarBg(t: Territory): string {
    if (!t.owner) return "var(--ds-bg-muted)";
    const colors = [
      "var(--ds-cat-1)",
      "var(--ds-cat-8)",
      "var(--ds-cat-7)",
      "var(--ds-cat-5)",
      "var(--ds-cat-2)",
      "var(--ds-cat-4)",
    ];
    let h = 0;
    for (const c of t.owner) h = c.charCodeAt(0) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  }

  ownerInitials(t: Territory): string {
    if (!t.owner) return "?";
    return t.owner
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  formatCurrency(v: number): string {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(v);
  }

  formatCurrencyShort(v: number): string {
    if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
    if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
    return `$${v}`;
  }
}
