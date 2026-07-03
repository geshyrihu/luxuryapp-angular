import { CommonModule } from "@angular/common";
import { Component, signal, ViewEncapsulation } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { TagModule } from "primeng/tag";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

@Component({
  selector: "app-catalog-layouts",
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, DividerModule, TagModule, AppIcon],
  template: `
    <div class="grid">

      <!-- -- Layouts de Página --------------------------------------- -->
      <div class="col-12">
        <p-card header="Layouts de Página é Patrones ERP">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Los 5 layouts base del ERP. Cada uno resuelve una clase distinta de tarea operativa.
            Selecciona el layout segón la <strong>densidad de información</strong> y el
            <strong>flujo de trabajo</strong> del módulo.
          </p>

          <div class="grid">
            @for (layout of pageLayouts; track layout.id) {
              <div class="col-12 md:col-6 xl:col-4">
                <div class="border-1 border-round overflow-hidden h-full flex flex-column"
                     [class.border-primary]="activeLayout() === layout.id"
                     (click)="activeLayout.set(layout.id)"
                     style="cursor:pointer; transition: border-color .15s">

                  <!-- Mockup visual -->
                  <div class="relative" style="height:160px; background:#f8fafc">
                    <ng-container *ngTemplateOutlet="layout.template" />
                  </div>

                  <!-- Info -->
                  <div class="p-3 flex flex-column gap-2 flex-grow-1">
                    <div class="flex align-items-center gap-2">
                      <strong class="text-sm">{{ layout.titulo }}</strong>
                      <p-tag [value]="layout.tag" [severity]="layout.tagSeverity" [rounded]="true" class="ml-auto" />
                    </div>
                    <p class="m-0 text-xs text-color-secondary line-height-3">{{ layout.descripcion }}</p>
                    <div class="mt-auto pt-2 border-top-1 surface-border">
                      <span class="text-xs font-bold text-color-secondary">USO: </span>
                      <span class="text-xs text-color-secondary">{{ layout.uso }}</span>
                    </div>
                  </div>

                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

      <!-- -- Templates de mockup -------------------------------------- -->
      <ng-template #fullWidthMockup>
        <div class="h-full flex flex-column" style="padding:8px;gap:6px">
          <div class="border-round" style="height:18px;background:var(--ds-primary);opacity:.9"></div>
          <div class="flex-grow-1 border-round" style="background:#e2e8f0"></div>
          <div class="border-round" style="height:12px;background:#cbd5e1"></div>
        </div>
      </ng-template>

      <!-- -- Form Layouts --------------------------------------------- -->
      <div class="col-12">
        <p-card header="Form Layouts é Organización de Campos">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Elige la densidad del formulario segón el contexto: mís columnas = mís densidad
            pero mayor riesgo de errores de captura. En mobile siempre usa una columna.
          </p>

          <div class="grid">

            <!-- 1 columna -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="border-1 border-round p-3 h-full flex flex-column gap-2">
                <strong class="text-sm flex align-items-center gap-2">
                  <span class="border-round px-2 py-1 text-xs text-white font-bold" style="background:var(--ds-primary)">1 col</span>
                  Una columna
                </strong>
                <div class="flex flex-column gap-2 flex-grow-1">
                  @for (i of [1,2,3,4]; track i) {
                    <div class="border-round" style="height:32px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                  }
                </div>
                <p class="m-0 text-xs text-color-secondary mt-auto">
                  Formularios simples, wizards, login, confirmar acción.
                </p>
              </div>
            </div>

            <!-- 2 columnas -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="border-1 border-round p-3 h-full flex flex-column gap-2">
                <strong class="text-sm flex align-items-center gap-2">
                  <span class="border-round px-2 py-1 text-xs text-white font-bold" style="background:var(--ds-info)">2 col</span>
                  Dos columnas
                </strong>
                <div class="flex flex-column gap-2 flex-grow-1">
                  @for (i of [1,2,3]; track i) {
                    <div class="flex gap-2">
                      <div class="flex-grow-1 border-round" style="height:32px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                      <div class="flex-grow-1 border-round" style="height:32px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                    </div>
                  }
                </div>
                <p class="m-0 text-xs text-color-secondary mt-auto">
                  Edición de entidad, alta de usuarios, ajustes de perfil.
                </p>
              </div>
            </div>

            <!-- 3 columnas -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="border-1 border-round p-3 h-full flex flex-column gap-2">
                <strong class="text-sm flex align-items-center gap-2">
                  <span class="border-round px-2 py-1 text-xs text-white font-bold" style="background:var(--ds-success)">3 col</span>
                  Tres columnas
                </strong>
                <div class="flex flex-column gap-2 flex-grow-1">
                  @for (i of [1,2]; track i) {
                    <div class="flex gap-2">
                      @for (j of [1,2,3]; track j) {
                        <div class="flex-grow-1 border-round" style="height:32px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                      }
                    </div>
                  }
                  <div class="border-round" style="height:52px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                </div>
                <p class="m-0 text-xs text-color-secondary mt-auto">
                  Solicitudes operativas con muchos campos, filtros avanzados.
                </p>
              </div>
            </div>

            <!-- Horizontal -->
            <div class="col-12 md:col-6 xl:col-3">
              <div class="border-1 border-round p-3 h-full flex flex-column gap-2">
                <strong class="text-sm flex align-items-center gap-2">
                  <span class="border-round px-2 py-1 text-xs text-white font-bold" style="background:var(--ds-warning)">H</span>
                  Horizontal
                </strong>
                <div class="flex flex-column gap-2 flex-grow-1">
                  @for (i of [1,2,3,4]; track i) {
                    <div class="flex align-items-center gap-2">
                      <div class="border-round flex-shrink-0" style="width:80px;height:24px;background:#cbd5e1"></div>
                      <div class="border-round flex-grow-1" style="height:28px;background:#e2e8f0;border:1px solid #cbd5e1"></div>
                    </div>
                  }
                </div>
                <p class="m-0 text-xs text-color-secondary mt-auto">
                  Configuración, preferencias, formularios de bósqueda en lónea.
                </p>
              </div>
            </div>

          </div>
        </p-card>
      </div>

      <!-- -- Dashboard Grid ------------------------------------------- -->
      <div class="col-12">
        <p-card header="Dashboard Grid é Composición esténdar ERP">
          <p class="m-0 mb-4 text-sm text-color-secondary">
            Patrón de dashboard para módulos analóticos. Combina KPIs, gróficas y listados
            en una sola vista de alto nivel.
          </p>

          <!-- Mockup visual de dashboard -->
          <div class="border-1 border-round overflow-hidden" style="background:#f8fafc">

            <!-- Header del dashboard -->
            <div class="flex align-items-center justify-content-between px-4 py-3 border-bottom-1 surface-border">
              <div>
                <strong class="text-sm block">Dashboard Operativo</strong>
                <span class="text-xs text-color-secondary">Junio 2026 é Actualizado hace 5 min</span>
              </div>
              <div class="flex gap-2">
                <div class="border-round px-3 py-1 text-xs surface-card border-1 border-round">Exportar</div>
                <div class="border-round px-3 py-1 text-xs surface-card border-1 border-round text-white" style="background:var(--ds-primary)">Nuevo</div>
              </div>
            </div>

            <div class="p-3">

              <!-- KPI row -->
              <div class="grid mb-3">
                @for (kpi of dashboardKpis; track kpi.label) {
                  <div class="col-6 md:col-3">
                    <div class="surface-card border-1 border-round p-3"
                         [style.border-left]="'3px solid ' + kpi.color">
                      <span class="text-xs text-color-secondary block">{{ kpi.label }}</span>
                      <strong class="text-xl block mt-1" [style.color]="kpi.color">{{ kpi.value }}</strong>
                      <span class="text-xs" [style.color]="kpi.trendColor">{{ kpi.trend }}</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Charts + Table row -->
              <div class="grid">
                <div class="col-12 md:col-8">
                  <div class="surface-card border-1 border-round p-3">
                    <strong class="text-xs text-color-secondary block mb-2">SOLICITUDES POR MES</strong>
                    <!-- Fake bar chart -->
                    <div class="flex align-items-end gap-1" style="height:80px">
                      @for (b of chartBars; track b) {
                        <div class="border-round-top flex-grow-1 transition-all"
                             [style.height.%]="b"
                             [style.background]="'var(--ds-primary)'"
                             [style.opacity]="0.5 + b/200">
                        </div>
                      }
                    </div>
                    <div class="flex justify-content-between mt-1">
                      @for (m of chartMonths; track m) {
                        <span class="text-xs text-color-secondary">{{ m }}</span>
                      }
                    </div>
                  </div>
                </div>
                <div class="col-12 md:col-4">
                  <div class="surface-card border-1 border-round p-3 h-full">
                    <strong class="text-xs text-color-secondary block mb-2">DISTRIBUCIóN</strong>
                    <!-- Fake pie -->
                    <div class="flex flex-column gap-2 mt-2">
                      @for (s of pieSlices; track s.label) {
                        <div>
                          <div class="flex justify-content-between text-xs mb-1">
                            <span>{{ s.label }}</span><span class="font-bold">{{ s.pct }}%</span>
                          </div>
                          <div class="border-round" style="height:6px;background:#e2e8f0">
                            <div class="border-round h-full" [style.width.%]="s.pct" [style.background]="s.color"></div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mini table -->
              <div class="surface-card border-1 border-round mt-3 overflow-hidden">
                <div class="flex align-items-center justify-content-between px-3 py-2 surface-section border-bottom-1 surface-border">
                  <strong class="text-xs">óLTIMAS SOLICITUDES</strong>
                  <span class="text-xs text-primary cursor-pointer">Ver todas ?</span>
                </div>
                @for (row of miniTableRows; track row.folio) {
                  <div class="flex align-items-center gap-3 px-3 py-2 border-bottom-1 surface-border text-xs">
                    <strong class="w-6rem flex-shrink-0">{{ row.folio }}</strong>
                    <span class="flex-grow-1 text-color-secondary">{{ row.nombre }}</span>
                    <span class="font-bold">{{ row.importe }}</span>
                    <span class="border-round px-2 py-1 text-white text-xs" [style.background]="row.statusColor">{{ row.status }}</span>
                  </div>
                }
              </div>

            </div>
          </div>
        </p-card>
      </div>

      <!-- -- Reglas de Layout ---------------------------------------- -->
      <div class="col-12">
        <p-card header="Reglas Generales de Layout ERP">
          <div class="grid">
            @for (r of layoutRules; track r.titulo) {
              <div class="col-12 md:col-6 xl:col-4">
                <div class="flex align-items-start gap-3 p-3 surface-ground border-round h-full">
                  <app-icon [icon]="r.icon" [style.color]="r.color" class="text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <strong class="block text-sm">{{ r.titulo }}</strong>
                    <p class="m-0 text-xs text-color-secondary mt-1 line-height-3">{{ r.descripcion }}</p>
                  </div>
                </div>
              </div>
            }
          </div>
        </p-card>
      </div>

    </div>
  `,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogLayouts {
  activeLayout = signal<string>("");

  readonly pageLayouts = [
    {
      id: "full",
      titulo: "Full Width",
      tag: "Simple",
      tagSeverity: "secondary" as const,
      descripcion: "Todo el ancho disponible. Sin sidebar de contenido. Para vistas de listado, tablas y dashboards de alto nivel.",
      uso: "Listados maestros, reportes, catálogos con tabla.",
      template: null,
      mockupColors: { header: "var(--ds-primary)", content: "#e2e8f0" },
    },
    {
      id: "sidebar-content",
      titulo: "Sidebar + Contenido",
      tag: "Esténdar",
      tagSeverity: "info" as const,
      descripcion: "Navegación lateral fija + órea de contenido principal. Layout base del ERP para la mayoróa de módulos.",
      uso: "Dashboard principal, navegación entre sub-módulos.",
      template: null,
      mockupColors: { sidebar: "var(--ds-primary)", content: "#f1f5f9" },
    },
    {
      id: "master-detail",
      titulo: "MasteróDetail",
      tag: "ERP Core",
      tagSeverity: "success" as const,
      descripcion: "Lista a la izquierda + detalle/formulario a la derecha. La selección en la lista actualiza el panel de detalle.",
      uso: "Contactos, proveedores, órdenes de trabajo, facturas.",
      template: null,
      mockupColors: { master: "#bfcfe4", detail: "#f8fafc" },
    },
    {
      id: "wizard",
      titulo: "Wizard (Stepper)",
      tag: "Flujo",
      tagSeverity: "warn" as const,
      descripcion: "Flujo lineal de N pasos con barra de progreso. Cada paso es una sección del formulario completo.",
      uso: "Alta de usuario, onboarding, flujo de aprobación, solicitud compleja.",
      template: null,
      mockupColors: { steps: "var(--ds-primary)", content: "#f8fafc" },
    },
    {
      id: "split",
      titulo: "Split Panels",
      tag: "Avanzado",
      tagSeverity: "danger" as const,
      descripcion: "Dos paneles redimensionables lado a lado. Para comparación o edición con vista previa en tiempo real.",
      uso: "Editor de documentos, comparación de versiones, preview de reportes.",
      template: null,
      mockupColors: { left: "#dce7f3", right: "#f8fafc" },
    },
  ];

  readonly dashboardKpis = [
    { label: "Solicitudes",  value: "348",    trend: "? 12%", color: "var(--ds-primary)", trendColor: "var(--ds-success)" },
    { label: "Aprobadas",    value: "271",    trend: "? 8%",  color: "var(--ds-success)", trendColor: "var(--ds-success)" },
    { label: "Pendientes",   value: "54",     trend: "? 3%",  color: "var(--ds-warning)", trendColor: "var(--ds-danger)"  },
    { label: "Monto total",  value: "$1.24M", trend: "? 22%", color: "var(--ds-info)",    trendColor: "var(--ds-success)" },
  ];

  readonly chartBars = [65, 82, 45, 91, 73, 88, 55, 79, 68, 95, 71, 83];
  readonly chartMonths = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  readonly pieSlices = [
    { label: "Sistemas",      pct: 35, color: "var(--ds-primary)" },
    { label: "Operaciones",   pct: 28, color: "var(--ds-success)" },
    { label: "Finanzas",      pct: 22, color: "var(--ds-info)"    },
    { label: "Otros",         pct: 15, color: "var(--ds-warning)" },
  ];

  readonly miniTableRows = [
    { folio: "ERP-001", nombre: "Compra equipo TI",    importe: "$45K", status: "Pendiente", statusColor: "var(--ds-warning)" },
    { folio: "ERP-002", nombre: "Mantenimiento elev.",  importe: "$12K", status: "Proceso",   statusColor: "var(--ds-info)"    },
    { folio: "ERP-003", nombre: "Mobiliario admin.",    importe: "$89K", status: "Aprobado",  statusColor: "var(--ds-success)" },
    { folio: "ERP-004", nombre: "Limpieza mensual",     importe: "$8K",  status: "Rechazado", statusColor: "var(--ds-danger)"  },
  ];

  readonly layoutRules = [
    { titulo: "Grid de 12 columnas",   icon: "mdi:grid",           color: "var(--ds-primary)", descripcion: "Usa siempre PrimeFlex con col-12, md:col-6, lg:col-4. Nunca anchos en px para elementos del grid." },
    { titulo: "Max-width de contenido",icon: "mdi:arrow-collapse-horizontal", color: "var(--ds-info)", descripcion: "En full-width, el contenido tiene max-width implócito del contenedor. En sidebar+content, el content ocupa el espacio restante." },
    { titulo: "Espaciado consistente", icon: "mdi:arrow-expand-vertical", color: "var(--ds-success)", descripcion: "gap-4 entre bloques principales, gap-3 entre campos relacionados, gap-2 entre elementos inline." },
    { titulo: "Mobile primero",        icon: "mdi:cellphone",       color: "var(--ds-warning)", descripcion: "Diseóa para col-12 primero. Expande con md:col-6 y lg:col-4. Los formularios siempre apilan en mobile." },
    { titulo: "Header fijo, no pegajoso", icon: "mdi:page-layout-header", color: "var(--ds-danger)", descripcion: "El header de la app es sticky. El contenido de la página hace scroll debajo. Nunca pongas sticky en elementos de contenido." },
    { titulo: "Jerarquóa de acciones", icon: "mdi:cursor-default-click", color: "var(--ds-primary)", descripcion: "Una acción primaria por vista. Las secundarias van a la derecha o en mení contextual. Danger siempre separado y confirmado." },
  ];
}
