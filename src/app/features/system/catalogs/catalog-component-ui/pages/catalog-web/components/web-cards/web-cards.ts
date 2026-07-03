import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { SkeletonModule } from "primeng/skeleton";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { StatusBadge, EStatus } from "src/app/core/components/shared/status-badge/status-badge";

@Component({
  selector: "app-web-cards",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, SkeletonModule, TagModule, AppIcon, StatusBadge],
  template: `
    <div class="grid">

      <!-- KPI Cards -->
      <div class="col-12">
        <p-card header="KPI Cards é Mítricas de Dashboard">
          <div class="grid">
            @for (kpi of kpis; track kpi.label) {
              <div class="col-12 md:col-6 xl:col-3">
                <div class="surface-card border-1 border-round p-4 flex flex-column gap-3 h-full"
                     [style.border-left]="'4px solid ' + kpi.color">
                  <div class="flex justify-content-between align-items-start">
                    <div>
                      <span class="text-xs font-bold text-color-secondary uppercase" style="letter-spacing:.06em">{{ kpi.label }}</span>
                      <div class="text-3xl font-bold text-color mt-1">{{ kpi.value }}</div>
                    </div>
                    <div class="border-round p-2" [style.background]="kpi.bg">
                      <app-icon [icon]="kpi.icon" [style.color]="kpi.color" class="text-2xl" />
                    </div>
                  </div>
                  <div class="flex align-items-center gap-2">
                    <app-icon [icon]="kpi.trend > 0 ? 'mdi:trending-up' : 'mdi:trending-down'"
                              [style.color]="kpi.trend > 0 ? 'var(--ds-success)' : 'var(--ds-danger)'" />
                    <span class="text-sm font-semibold" [style.color]="kpi.trend > 0 ? 'var(--ds-success)' : 'var(--ds-danger)'">
                      {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
                    </span>
                    <span class="text-xs text-color-secondary">vs mes anterior</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Cards con borde de color -->
      <div class="col-12 lg:col-6">
        <p-card header="Cards con Acento de Color">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            El borde izquierdo comunica la severidad del contenido.
            ósalo en listas de items con estado o en paneles de resumen.
          </p>
          <div class="flex flex-column gap-2">
            @for (c of accentCards; track c.severity) {
              <div class="surface-card border-1 border-round p-3 flex align-items-center gap-3"
                   [style.border-left]="'4px solid ' + c.color">
                <app-icon [icon]="c.icon" [style.color]="c.color" class="text-xl flex-shrink-0" />
                <div class="flex-grow-1">
                  <strong class="text-sm block">{{ c.title }}</strong>
                  <span class="text-xs text-color-secondary">{{ c.subtitle }}</span>
                </div>
                <app-status-badge [status]="c.status" />
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Card con acciones en header -->
      <div class="col-12 lg:col-6">
        <p-card header="Cards con Acciones">
          <div class="flex flex-column gap-3">

            <!-- Card con botún en header (via template) -->
            <div class="surface-card border-1 border-round overflow-hidden">
              <div class="flex align-items-center justify-content-between px-4 py-3 border-bottom-1 surface-border">
                <strong class="text-sm">Solicitudes Recientes</strong>
                <p-button label="Ver todas" size="small" [text]="true" icon="mdi:arrow-right" iconPos="right" />
              </div>
              <div class="p-3 flex flex-column gap-2">
                @for (item of cardListItems; track item.folio) {
                  <div class="flex align-items-center gap-2 p-2 hover:surface-hover border-round cursor-pointer">
                    <app-icon icon="mdi:file-document-outline" class="text-color-secondary" />
                    <div class="flex-grow-1">
                      <span class="text-sm font-semibold block">{{ item.folio }}</span>
                      <span class="text-xs text-color-secondary">{{ item.area }}</span>
                    </div>
                    <app-status-badge [status]="item.status" />
                  </div>
                }
              </div>
            </div>

            <!-- Card con footer de acciones -->
            <div class="surface-card border-1 border-round overflow-hidden">
              <div class="p-4">
                <strong class="block mb-1">Solicitud de Compra</strong>
                <span class="text-xs text-color-secondary">Requiere aprobación de Dirección</span>
                <div class="mt-3 flex align-items-center gap-2">
                  <app-icon icon="mdi:currency-usd" class="text-color-secondary" />
                  <span class="text-2xl font-bold text-color">$45,000</span>
                  <p-tag value="Pendiente" severity="warn" [rounded]="true" />
                </div>
              </div>
              <div class="flex gap-2 px-4 py-3 border-top-1 surface-border">
                <p-button label="Rechazar" severity="danger"    [outlined]="true" class="flex-grow-1" size="small" />
                <p-button label="Aprobar"  severity="success"                     class="flex-grow-1" size="small" />
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- Card horizontal -->
      <div class="col-12 lg:col-6">
        <p-card header="Card Horizontal">
          <div class="flex flex-column gap-3">
            @for (h of horizontalCards; track h.title) {
              <div class="surface-card border-1 border-round flex overflow-hidden">
                <div class="flex align-items-center justify-content-center p-4 flex-shrink-0"
                     [style.background]="h.bg" style="width:72px">
                  <app-icon [icon]="h.icon" [style.color]="h.color" class="text-3xl" />
                </div>
                <div class="p-3 flex-grow-1">
                  <strong class="block text-sm">{{ h.title }}</strong>
                  <span class="text-xs text-color-secondary">{{ h.sub }}</span>
                  <div class="mt-2">
                    <p-tag [value]="h.tag" [severity]="h.severity" [rounded]="true" />
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- Skeleton (loading state) -->
      <div class="col-12 lg:col-6">
        <p-card header="Skeleton é Estado de Carga">
          <p class="m-0 mb-3 text-sm text-color-secondary">
            Muestra el skeleton cuando el contenido tarda mís de 300 ms.
            Anticipa el layout real para reducir el efecto de salto visual.
          </p>
          <div class="flex flex-column gap-4">
            <!-- Skeleton de card KPI -->
            <div class="surface-card border-1 border-round p-4">
              <div class="flex justify-content-between align-items-start mb-3">
                <div class="flex-grow-1">
                  <p-skeleton width="6rem" height=".75rem" styleClass="mb-2" />
                  <p-skeleton width="4rem" height="1.75rem" />
                </div>
                <p-skeleton shape="circle" size="3rem" />
              </div>
              <p-skeleton width="8rem" height=".75rem" />
            </div>
            <!-- Skeleton de lista -->
            <div class="surface-card border-1 border-round p-3">
              @for (i of [1,2,3]; track i) {
                <div class="flex align-items-center gap-3 mb-3">
                  <p-skeleton shape="circle" size="2.5rem" />
                  <div class="flex-grow-1">
                    <p-skeleton width="70%" height=".85rem" styleClass="mb-1" />
                    <p-skeleton width="45%" height=".65rem" />
                  </div>
                  <p-skeleton width="4rem" height="1.5rem" borderRadius="16px" />
                </div>
              }
            </div>
          </div>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class WebCards {
  readonly EStatus = EStatus;

  readonly kpis = [
    { label: "Ingresos del mes", value: "$1.24M",  icon: "mdi:currency-usd",    color: "var(--ds-primary)",  bg: "var(--ds-primary-container)", trend: 12 },
    { label: "Solicitudes",      value: "348",      icon: "mdi:file-document",   color: "var(--ds-info)",     bg: "var(--ds-info-light)",        trend:  8 },
    { label: "Tareas pendientes",value: "24",       icon: "mdi:clock-outline",   color: "var(--ds-warning)",  bg: "var(--ds-warning-light)",     trend: -3 },
    { label: "Uptime del sistema",value: "99.8%",   icon: "mdi:server-network",  color: "var(--ds-success)",  bg: "var(--ds-success-light)",     trend:  1 },
  ];

  readonly accentCards = [
    { severity: EStatus.Concluido,    title: "Pago procesado correctamente",     subtitle: "Ref. PAG-2026-0412 é Finanzas",       icon: "mdi:check-circle",   color: "var(--ds-success)",  status: EStatus.Concluido    },
    { severity: EStatus.Proceso,      title: "Revisión de contrato en curso",    subtitle: "Ref. CONT-2026-0089 é Legal",          icon: "mdi:file-search",    color: "var(--ds-warning)",  status: EStatus.Proceso      },
    { severity: EStatus.Pendiente,    title: "Aprobación de presupuesto",        subtitle: "Ref. PRES-2026-0031 é Dirección",      icon: "mdi:clock-alert",    color: "var(--ds-info)",     status: EStatus.Pendiente    },
    { severity: EStatus.noAutorizado, title: "Solicitud rechazada por política", subtitle: "Ref. SOL-2026-0218 é Administración",  icon: "mdi:close-circle",   color: "var(--ds-danger)",   status: EStatus.noAutorizado },
  ];

  readonly cardListItems = [
    { folio: "ERP-2026-001", area: "Finanzas",     status: EStatus.Concluido },
    { folio: "ERP-2026-002", area: "Operaciones",  status: EStatus.Proceso   },
    { folio: "ERP-2026-003", area: "Mantenimiento",status: EStatus.Pendiente },
  ];

  readonly horizontalCards = [
    { title: "Mantenimiento preventivo", sub: "Próxima revisión: 30 Jun 2026",  icon: "mdi:wrench",         color: "var(--ds-warning)", bg: "var(--ds-warning-light)", tag: "Programado",  severity: "warn"      as const },
    { title: "Factura #INV-0089",        sub: "Vence el 15 Jul 2026 é $12,500", icon: "mdi:receipt",        color: "var(--ds-info)",    bg: "var(--ds-info-light)",    tag: "Pendiente",   severity: "info"      as const },
    { title: "Acceso de contratista",    sub: "Aprobado por Dirección",          icon: "mdi:account-hard-hat",color: "var(--ds-success)", bg: "var(--ds-success-light)", tag: "Autorizado",  severity: "success"   as const },
  ];
}

