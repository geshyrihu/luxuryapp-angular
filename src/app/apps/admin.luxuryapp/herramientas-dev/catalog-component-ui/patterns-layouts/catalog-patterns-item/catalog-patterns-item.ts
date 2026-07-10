import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  ViewEncapsulation,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { EStatus, StatusBadge } from "@ui/web/status-badge/status-badge";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";

const PATTERNS_LABELS: Record<string, string> = {
  complexcard: "Complex Card",
  datatablehybrid: "Data Table Hybrid",
  loginreference: "Login Reference",
  navigationreference: "Navigation Reference",
  navhub: "Navigation Hub Page (Esténdar)",
};

@Component({
  selector: "app-catalog-patterns-item",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    MessageModule,
    TableModule,
    TabsModule,
    AppIcon,
    StatusBadge,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>
      @switch (item()) {
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
                <div class="flex align-items-center gap-2 mb-3 mt-2">
                  <app-icon
                    icon="icon.flash-outline"
                    class="text-xl text-primary"
                  />
                  <span class="text-xl font-bold">120 kWh</span>
                </div>
                <app-status-badge [status]="EStatus.Concluido" />
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
              <p-table [value]="[{ id: 1, name: 'Test' }]" class="mt-2">
                <ng-template #header
                  ><tr>
                    <th>Elemento</th>
                    <th>Status</th>
                  </tr></ng-template
                >
                <ng-template #body let-item
                  ><tr>
                    <td>{{ item.name }}</td>
                    <td><app-status-badge [status]="EStatus.Proceso" /></td></tr
                ></ng-template>
              </p-table>
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
                <input
                  pInputText
                  [(ngModel)]="email"
                  placeholder="admin@luxuryapp.com"
                  class="w-full mb-2"
                />
                <input
                  pInputText
                  type="password"
                  [(ngModel)]="password"
                  placeholder="Contraseóa"
                  class="w-full mb-2"
                />
                <p-button
                  label="Iniciar Sesión"
                  class="w-full"
                  class="w-full"
                />
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
              <p-tabs value="0">
                <p-tablist>
                  <p-tab value="0">Dashboard</p-tab>
                  <p-tab value="1">Reportes</p-tab>
                </p-tablist>
                <p-tabpanels>
                  <p-tabpanel value="0"><p>Contenido Dashboard.</p></p-tabpanel>
                  <p-tabpanel value="1"><p>Reportes.</p></p-tabpanel>
                </p-tabpanels>
              </p-tabs>
            </div>
          </div>
        }

        @case ("navhub") {
          <!-- ------------------------------------------------------------ -->
          <!-- ESTéNDAR: Navigation Hub Page                               -->
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
              <p-divider />

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
              <div class="grid mb-4">
                @for (card of navHubDemo; track card.title) {
                  <div class="col-12 sm:col-6 md:col-4 lg:col-3">
                    <div
                      class="surface-card border-round-xl p-3 h-full shadow-1 hover:shadow-3
                              transition-all transition-duration-200 flex flex-column gap-3 cursor-pointer"
                      [style]="{ 'border-top': '3px solid ' + card.color }"
                    >
                      <div
                        class="flex align-items-center justify-content-between"
                      >
                        <div
                          class="flex align-items-center justify-content-center border-round-lg flex-shrink-0"
                          style="width:44px;height:44px;"
                          [style.backgroundColor]="card.bgColor"
                        >
                          <app-icon
                            [icon]="card.icon"
                            style="font-size:1.35rem;"
                            [style.color]="card.color"
                          />
                        </div>
                        <app-icon
                          icon="icon.arrow-up-right"
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
              <div class="grid text-sm">
                <div class="col-12 md:col-6">
                  <div class="card border-round-lg p-2">
                    <div class="card-header">
                      <h3 class="card-title">? Web (= md)</h3>
                    </div>
                    <div class="card-body">
                      <ul class="m-0 pl-3 text-xs line-height-3">
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
                        <li>Flecha <code>mdi:arrow-up-right</code> en gris</li>
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
                          Header de grupo: barra vertical + uppercase + lónea
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="col-12 md:col-6">
                  <div class="card border-round-lg p-2">
                    <div class="card-header">
                      <h3 class="card-title">?? Mobile (< md)</h3>
                    </div>
                    <div class="card-body">
                      <ul class="m-0 pl-3 text-xs line-height-3">
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
              <div class="flex flex-wrap gap-2">
                @for (impl of navHubImplementations; track impl.route) {
                  <div
                    class="surface-ground border-round px-3 py-1 text-xs flex align-items-center gap-2"
                  >
                    <app-icon [icon]="impl.icon" class="text-primary" />
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
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogPatternsItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  get label(): string {
    return PATTERNS_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }
  EStatus = EStatus;
  email = "";
  password = "";

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

  readonly navHubDemo = [
    {
      title: "Clientes",
      icon: "icon.domain",
      bgColor: "#dbeafe",
      color: "#1d4ed8",
      description: "Gestión de clientes.",
    },
    {
      title: "Roles",
      icon: "icon.shield-account-outline",
      bgColor: "#e0e7ff",
      color: "#4338ca",
      description: "",
    },
    {
      title: "Cargos",
      icon: "icon.cash-remove",
      bgColor: "#ffdad6",
      color: "#b91c1c",
      description: "Emisión de cargos.",
    },
    {
      title: "Pagos",
      icon: "icon.cash-check",
      bgColor: "#d1fae5",
      color: "#15803d",
      description: "",
    },
    {
      title: "Reportes",
      icon: "icon.chart-bar",
      bgColor: "#fef9c3",
      color: "#a16207",
      description: "Reportes contables.",
    },
    {
      title: "Configuración",
      icon: "icon.cog-outline",
      bgColor: "#f3e8ff",
      color: "#7c3aed",
      description: "",
    },
  ];

  readonly navHubImplementations = [
    {
      label: "Configuración del Sistema",
      icon: "icon.cog",
      route: "/admin",
    },
    {
      label: "Contabilidad (Master)",
      icon: "icon.wallet",
      route: "/contabilidad",
    },
    { label: "Cobranza Nativa", icon: "icon.cash", route: "/cobranza-nativa" },
  ];
}
