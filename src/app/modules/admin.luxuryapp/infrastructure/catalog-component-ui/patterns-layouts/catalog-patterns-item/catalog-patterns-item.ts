import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import type { AppIconName } from "@ui/primitives/app-icon/app-icon.catalog";
import { AppDivider } from "@ui/web/divider/divider";
import { EStatus, StatusBadge } from "@ui/web/status-badge/status-badge";
import { AppTable } from "@ui/web/table/table";
import { Tabs } from "@ui/web/tabs/tabs";

import { AppCard } from "@ui/web/card/card";
import { ChartWrapper } from "@ui/web/charts/chart-wrapper";
import { AppToolbar } from "@ui/web/toolbar/toolbar";

const PATTERNS_LABELS: Record<string, string> = {
  complexcard: "Complex Card",
  datatablehybrid: "Data Table Hybrid",
  loginreference: "Login Reference",
  navigationreference: "Navigation Reference",
  navhub: "Navigation Hub Page (Estándar)",
  filterstable: "Encabezado + Filtros + Tabla",
  kpichart: "KPIs + Gráfico",
  detailtimeline: "Detalle + Timeline",
};

@Component({
  selector: "app-catalog-patterns-item",
  imports: [
    FormsModule,
    WebButtonLabel,
    AppDivider,
    CustomInputTextSignal,
    AppTable,
    Tabs,
    AppIcon,
    StatusBadge,
    AppCard,
    ChartWrapper,
    AppToolbar,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
        @case ("filterstable") {
          <!-- Receta: Encabezado + Filtros + Tabla -->
          <div class="d-flex flex-column gap-3">
            <lux-toolbar-web>
              <ng-template #start>
                <div class="d-flex align-items-center gap-2">
                  <h3 class="m-0 font-bold">Órdenes de Compra</h3>
                  <lux-status-badge-web [status]="EStatus.Aprobado" />
                </div>
              </ng-template>
              <ng-template #end>
                <il-button
                  label="Nueva Orden"
                  iconClass="material-symbols-light:add"
                />
              </ng-template>
            </lux-toolbar-web>

            <lux-card-web>
              <ng-template #content>
                <div class="row g-3">
                  <div class="col-12 col-md-4">
                    <custom-input-text-signal
                      [(ngModel)]="mockFilter"
                      placeholder="Buscar por folio..."
                    />
                  </div>
                  <div class="col-12 col-md-3">
                    <custom-input-text-signal
                      [(ngModel)]="mockFilter"
                      placeholder="Filtrar fecha"
                    />
                  </div>
                  <div
                    class="col-12 col-md-5 d-flex gap-2 justify-content-end align-items-end"
                  >
                    <il-button
                      variant="outlined"
                      label="Limpiar"
                      severity="secondary"
                    />
                    <il-button
                      label="Buscar"
                      iconClass="material-symbols-light:search"
                    />
                  </div>
                </div>
              </ng-template>
            </lux-card-web>

            <lux-card-web>
              <ng-template #content>
                <lux-table-web [value]="mockTableData" class="w-100">
                  <ng-template #header>
                    <tr>
                      <th>Folio</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th class="text-end">Acciones</th>
                    </tr>
                  </ng-template>
                  <ng-template #body let-row>
                    <tr>
                      <td class="font-bold">{{ row.folio }}</td>
                      <td>{{ row.fecha }}</td>
                      <td>{{ row.total }}</td>
                      <td><lux-status-badge-web [status]="EStatus.Aprobado" /></td>
                      <td class="text-end">
                        <iw-button-icon
                          icon="material-symbols-light:visibility"
                          variant="text"
                        />
                      </td>
                    </tr>
                  </ng-template>
                </lux-table-web>
              </ng-template>
            </lux-card-web>
          </div>
        }
        @case ("kpichart") {
          <!-- Receta: KPIs + Gráfico -->
          <div class="row g-4">
            <!-- KPIs -->
            <div class="col-12 col-md-4 d-flex flex-column gap-3">
              <lux-card-web class="flex-grow-1" [elevated]="true">
                <ng-template #content>
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-secondary m-0 text-sm">Ingresos Totales</p>
                      <h3 class="m-0 mt-2 text-2xl font-bold">$125,000</h3>
                    </div>
                    <div class="bg-success-light text-success p-2 rounded">
                      <lux-icon
                        icon="material-symbols-light:trending-up"
                        class="text-xl"
                      />
                    </div>
                  </div>
                  <p class="text-xs text-secondary mt-3 m-0">
                    +14% respecto al mes anterior
                  </p>
                </ng-template>
              </lux-card-web>
              <lux-card-web class="flex-grow-1" [elevated]="true">
                <ng-template #content>
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <p class="text-secondary m-0 text-sm">Órdenes Activas</p>
                      <h3 class="m-0 mt-2 text-2xl font-bold">42</h3>
                    </div>
                    <div class="bg-primary-light text-primary p-2 rounded">
                      <lux-icon
                        icon="material-symbols-light:shopping-cart"
                        class="text-xl"
                      />
                    </div>
                  </div>
                  <p class="text-xs text-secondary mt-3 m-0">
                    5 requieren atención
                  </p>
                </ng-template>
              </lux-card-web>
            </div>
            <!-- Gráfico -->
            <div class="col-12 col-md-8">
              <lux-card-web class="h-100" [elevated]="true">
                <ng-template #content>
                  <lux-chart-wrapper-web
                    type="bar"
                    [data]="mockChartData"
                    height="300px"
                    title="Ingresos Mensuales"
                  />
                </ng-template>
              </lux-card-web>
            </div>
          </div>
        }
        @case ("detailtimeline") {
          <!-- Receta: Detalle + Timeline -->
          <div class="row g-4">
            <div class="col-12 col-md-8">
              <lux-card-web header="Detalles del Ticket #4502" [elevated]="true">
                <ng-template #content>
                  <p class="text-secondary">
                    El aire acondicionado de la sala de juntas principal no está
                    enfriando. Se requiere revisión urgente antes de la reunión
                    de consejo.
                  </p>
                  <lux-divider-web />
                  <div class="row">
                    <div class="col-6 mb-3">
                      <span class="text-sm text-secondary d-block"
                        >Reportado por</span
                      >
                      <strong class="text-primary">Juan Pérez</strong>
                    </div>
                    <div class="col-6 mb-3">
                      <span class="text-sm text-secondary d-block"
                        >Ubicación</span
                      >
                      <strong>Sala de Juntas A</strong>
                    </div>
                  </div>
                </ng-template>
              </lux-card-web>
            </div>
            <div class="col-12 col-md-4">
              <lux-card-web header="Historial" [elevated]="true">
                <ng-template #content>
                  <div class="timeline-simple">
                    <div class="d-flex gap-3 mb-3">
                      <div class="d-flex flex-column align-items-center">
                        <div
                          class="rounded-full bg-primary text-white p-1 d-flex"
                        >
                          <lux-icon
                            icon="material-symbols-light:check"
                            class="text-sm"
                          />
                        </div>
                        <div
                          class="flex-grow-1 border-start border-2 border-primary mt-1 mb-1"
                          style="min-height: 20px;"
                        ></div>
                      </div>
                      <div>
                        <p class="m-0 text-sm font-bold">Ticket Asignado</p>
                        <p class="m-0 text-xs text-secondary">Ayer 14:30</p>
                      </div>
                    </div>
                    <div class="d-flex gap-3">
                      <div class="d-flex flex-column align-items-center">
                        <div
                          class="rounded-full bg-surface border border-2 border-secondary text-secondary p-1 d-flex"
                        >
                          <lux-icon
                            icon="material-symbols-light:pending"
                            class="text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <p class="m-0 text-sm font-bold">En Revisión</p>
                        <p class="m-0 text-xs text-secondary">Hoy 09:00</p>
                      </div>
                    </div>
                  </div>
                </ng-template>
              </lux-card-web>
            </div>
          </div>
        }
        @case ("complexcard") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Complex Card Item</h3>
            </div>
            <div class="card-body">
              <div
                class="surface-card shadow-1 border-round-lg border-left-3 border-primary p-3"
              >
                <h3 class="m-0">Medidor Elóctrico A1</h3>
                <div class="d-flex align-items-center gap-2 mb-3 mt-2">
                  <lux-icon
                    icon="material-symbols-light:flash-on"
                    class="text-xl text-primary"
                  />
                  <span class="text-xl font-bold">120 kWh</span>
                </div>
                <lux-status-badge-web [status]="EStatus.Concluido" />
              </div>
            </div>
          </div>
        }
        @case ("datatablehybrid") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Data Table Hybrid</h3>
            </div>
            <div class="card-body">
              <lux-table-web [value]="[{ id: 1, name: 'Test' }]" class="mt-2">
                <ng-template #header
                  ><tr>
                    <th>Elemento</th>
                    <th>Status</th>
                  </tr></ng-template
                >
                <ng-template #body let-item
                  ><tr>
                    <td>{{ item.name }}</td>
                    <td><lux-status-badge-web [status]="EStatus.Proceso" /></td></tr
                ></ng-template>
              </lux-table-web>
            </div>
          </div>
        }
        @case ("loginreference") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Login de Referencia</h3>
            </div>
            <div class="card-body">
              <div
                class="surface-ground border-round p-4"
                style="max-width:400px"
              >
                <div class="text-center mb-3">
                  <h3 class="m-0">LuxuryApp</h3>
                </div>
                <custom-input-text-signal
                  [(ngModel)]="email"
                  placeholder="admin@luxuryapp.com"
                  [onlyInput]="true"
                  class="w-full mb-2"
                />
                <custom-input-text-signal
                  type="password"
                  [(ngModel)]="password"
                  placeholder="Contraseña"
                  [onlyInput]="true"
                  class="w-full mb-2"
                />
                <il-button label="Iniciar Sesión" class="w-full" />
              </div>
            </div>
          </div>
        }
        @case ("navigationreference") {
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Navegación de Referencia</h3>
            </div>
            <div class="card-body">
              <lux-tabs-web
                [tabs]="[
                  { id: '0', label: 'Dashboard' },
                  { id: '1', label: 'Reportes' },
                ]"
                [(activeId)]="patternsTabActiveId"
              >
                <div tab="0"><p>Contenido Dashboard.</p></div>
                <div tab="1"><p>Reportes.</p></div>
              </lux-tabs-web>
            </div>
          </div>
        }

        @case ("navhub") {
          <!-- ------------------------------------------------------------ -->
          <!-- ESTÁNDAR: Navigation Hub Page                               -->
          <!-- Aplica a: settings-home, master-dashboard, cobranza-nativa  -->
          <!-- ------------------------------------------------------------ -->

          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Navigation Hub Page é Esténdar DS</h3>
            </div>
            <div class="card-body">
              <p class="text-sm text-secondary m-0 mb-4">
                Patrón para páginas de entrada a módulos del ERP. Consolida
                grupos de navegación en cards visuales uniformes para web y
                lista agrupada para mobile.
              </p>
              <lux-divider-web />

              <!-- 1. Modelo de datos requerido -->
              <h3 class="text-base font-bold mb-2">
                1. Modelo de datos é <code>DashboardCard</code>
              </h3>
              <div
                class="surface-ground border-round p-3 mb-4 font-mono text-xs line-height-3"
              >
                <pre style="margin:0;white-space:pre-wrap;">{{
                  navHubModel
                }}</pre>
              </div>

              <!-- 2. Demo visual: card web -->
              <h3 class="text-base font-bold mb-2">
                2. Card web é patrón visual
              </h3>
              <div class="row mb-4">
                @for (card of navHubDemo; track card.title) {
                  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div
                      class="surface-card border-round-xl p-3 h-full shadow-1 hover:shadow-3
                              transition-all transition-duration-200 d-flex flex-column gap-3 cursor-pointer"
                      [style]="{ 'border-top': '3px solid ' + card.color }"
                    >
                      <div
                        class="d-flex align-items-center justify-content-between"
                      >
                        <div
                          class="d-flex align-items-center justify-content-center border-round-lg flex-shrink-0"
                          style="width:44px;height:44px;"
                          [style.backgroundColor]="card.bgColor"
                        >
                          <lux-icon
                            [icon]="card.icon"
                            style="font-size:1.35rem;"
                            [style.color]="card.color"
                          />
                        </div>
                        <lux-icon
                          icon="material-symbols-light:north-east"
                          class="text-400 text-lg"
                        />
                      </div>
                      <span class="font-bold text-900 text-sm line-height-2">{{
                        card.title
                      }}</span>
                      @if (card.description) {
                        <p class="text-xs text-secondary m-0 line-height-3">
                          {{ card.description }}
                        </p>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- 3. Reglas -->
              <h3 class="text-base font-bold mb-2">3. Reglas del esténdar</h3>
              <div class="row text-sm">
                <div class="col-12 col-md-6">
                  <div class="card border-round-lg p-2">
                    <div class="card-header">
                      <h3 class="card-title">? Web (= md)</h3>
                    </div>
                    <div class="card-body">
                      <ul class="m-0 ps-3 text-xs line-height-3">
                        <li>
                          <code>border-top: 3px solid card.color</code> (acento
                          del grupo)
                        </li>
                        <li>
                          ócono 44ó44px con <code>card.bgColor</code> de fondo
                        </li>
                        <li>
                          <code>app-icon</code> con
                          <code>[style.color]="card.color"</code>
                        </li>
                        <li>
                          Flecha
                          <code>material-symbols-light:north-east</code> en gris
                        </li>
                        <li>
                          Label en <code>font-bold text-900 text-sm</code>
                        </li>
                        <li>
                          Description opcional en
                          <code>text-xs text-secondary</code>
                        </li>
                        <li>
                          Grid:
                          <code>col-2 xl é col-3 lg é col-4 md é col-6 sm</code>
                        </li>
                        <li>
                          Header de grupo: barra vertical + uppercase + línea
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-12 col-md-6">
                  <div class="card border-round-lg p-2">
                    <div class="card-header">
                      <h3 class="card-title">?? Mobile (< md)</h3>
                    </div>
                    <div class="card-body">
                      <ul class="m-0 ps-3 text-xs line-height-3">
                        <li>
                          <code>ion-list</code> con
                          <code>ion-item-divider</code> por grupo
                        </li>
                        <li>
                          <code>div slot="start"</code> é NUNCA
                          <code>span</code> ni
                          <code>ion-avatar</code>
                        </li>
                        <li>ócono 36-38px con <code>ml-3 mr-2</code></li>
                        <li>
                          <code>[ngClass]</code> para color (aditivo) é no
                          <code>[class]</code>
                        </li>
                        <li>
                          <code>detail="true"</code> para mostrar flecha nativa
                          de Ionic
                        </li>
                        <li>
                          Grupos agrupados con <code>ion-item-divider</code>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 4. Páginas que usan este patrón -->
              <h3 class="text-base font-bold mt-4 mb-2">
                4. Implementaciones en producción
              </h3>
              <div class="d-flex flex-wrap gap-2">
                @for (impl of navHubImplementations; track impl.route) {
                  <div
                    class="surface-ground border-round px-3 py-1 text-xs d-flex align-items-center gap-2"
                  >
                    <lux-icon [icon]="impl.icon" class="text-primary" />
                    <span class="font-medium">{{ impl.label }}</span>
                    <code class="text-color-secondary">{{ impl.route }}</code>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogPatternsItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  patternsTabActiveId = signal("0");
  get label(): string {
    return PATTERNS_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }
  EStatus = EStatus;
  email = "";
  password = "";

  // Data mocks for new patterns
  mockFilter = "";
  mockTableData = [
    { folio: "OC-10495", fecha: "2026-09-30", total: "$12,450.00" },
    { folio: "OC-10496", fecha: "2026-09-30", total: "$3,200.00" },
    { folio: "OC-10497", fecha: "2026-09-29", total: "$45,900.00" },
  ];
  mockChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
    datasets: [
      {
        label: "Ingresos",
        data: [65000, 59000, 80000, 81000, 56000, 125000],
        backgroundColor: "var(--ds-primary)",
      },
    ],
  };

  // --- Navigation Hub Page demo data ---------------------------
  readonly navHubModel = `interface DashboardCard {
  title:       string;      // requerido
  description: string;      // requerido (puede ser '' si no aplica)
  route?:      string;      // undefined si abre modal
  icon:        string;      // MDI icon  e.g. "icon.home"
  bgColor:     string;      // pastel hex  e.g. "#dbeafe"
  color:       string;      // acento hex  e.g. "#1d4ed8"  ? REQUERIDO
}

interface DashboardGroup {
  label:  string;           // nombre del grupo (uppercase en UI)
  icon:   string;           // MDI icon para el header del grupo
  cards:  DashboardCard[];
}`;

  readonly navHubDemo: {
    title: string;
    icon: AppIconName;
    bgColor: string;
    color: string;
    description: string;
  }[] = [
    {
      title: "Clientes",
      icon: "material-symbols-light:domain",
      bgColor: "#dbeafe",
      color: "#1d4ed8",
      description: "Gestión de clientes.",
    },
    {
      title: "Roles",
      icon: "material-symbols-light:shield-person",
      bgColor: "#e0e7ff",
      color: "#4338ca",
      description: "",
    },
    {
      title: "Cargos",
      icon: "material-symbols-light:paid",
      bgColor: "#ffdad6",
      color: "#b91c1c",
      description: "Emisión de cargos.",
    },
    {
      title: "Pagos",
      icon: "material-symbols-light:paid",
      bgColor: "#d1fae5",
      color: "#15803d",
      description: "",
    },
    {
      title: "Reportes",
      icon: "material-symbols-light:bar-chart",
      bgColor: "#fef9c3",
      color: "#a16207",
      description: "Reportes contables.",
    },
    {
      title: "Configuración",
      icon: "material-symbols-light:settings-outline",
      bgColor: "#f3e8ff",
      color: "#7c3aed",
      description: "",
    },
  ];

  readonly navHubImplementations: {
    label: string;
    icon: AppIconName;
    route: string;
  }[] = [
    {
      label: "Configuración del Sistema",
      icon: "material-symbols-light:settings",
      route: "/admin",
    },
    {
      label: "Contabilidad (Master)",
      icon: "material-symbols-light:wallet",
      route: "/contabilidad",
    },
    {
      label: "Cobranza Nativa",
      icon: "material-symbols-light:paid",
      route: "/cobranza-nativa",
    },
  ];
}
