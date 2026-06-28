import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/shared/status-badge/status-badge";

const PATTERNS_LABELS: Record<string, string> = {
  complexcard: "Complex Card",
  datatablehybrid: "Data Table Hybrid",
  loginreference: "Login Reference",
  navigationreference: "Navigation Reference",
  navhub: "Navigation Hub Page (Estándar)",
};

@Component({
  selector: "app-catalog-patterns-item",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
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
          <p-card header="Complex Card Item">
            <div
              class="surface-card shadow-1 border-round-lg border-left-3 border-primary p-3"
            >
              <h3 class="m-0">Medidor Eléctrico A1</h3>
              <div class="flex align-items-center gap-2 mb-3 mt-2">
                <app-icon
                  icon="mdi:flash-outline"
                  class="text-xl text-primary"
                />
                <span class="text-xl font-bold">120 kWh</span>
              </div>
              <app-status-badge [status]="EStatus.Concluido" />
            </div>
          </p-card>
        }
        @case ("datatablehybrid") {
          <p-card header="Data Table Hybrid">
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
          </p-card>
        }
        @case ("loginreference") {
          <p-card header="Login de Referencia">
            <div
              class="surface-ground border-round p-4"
              style="max-width:400px"
            >
              <div class="text-center mb-3"><h3 class="m-0">LuxuryApp</h3></div>
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
                placeholder="Contraseña"
                class="w-full mb-2"
              />
              <p-button
                label="Iniciar Sesión"
                class="w-full"
                styleClass="w-full"
              />
            </div>
          </p-card>
        }
        @case ("navigationreference") {
          <p-card header="Navegación de Referencia">
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
          </p-card>
        }

        @case ("navhub") {
          <!-- ──────────────────────────────────────────────────────────── -->
          <!-- ESTÁNDAR: Navigation Hub Page                               -->
          <!-- Aplica a: settings-home, master-dashboard, cobranza-nativa  -->
          <!-- ──────────────────────────────────────────────────────────── -->

          <p-card header="Navigation Hub Page — Estándar DS">
            <p class="text-sm text-secondary m-0 mb-4">
              Patrón para páginas de entrada a módulos del ERP. Consolida grupos
              de navegación en cards visuales uniformes para web y lista
              agrupada para mobile.
            </p>
            <p-divider />

            <!-- 1. Modelo de datos requerido -->
            <h3 class="text-base font-bold mb-2">
              1. Modelo de datos — <code>DashboardCard</code>
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
              2. Card web — patrón visual
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
                        icon="mdi:arrow-up-right"
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
            <h3 class="text-base font-bold mb-2">3. Reglas del estándar</h3>
            <div class="grid text-sm">
              <div class="col-12 md:col-6">
                <p-card styleClass="border-round-lg p-2" header="✅ Web (≥ md)">
                  <ul class="m-0 pl-3 text-xs line-height-3">
                    <li>
                      <code>border-top: 3px solid card.color</code> (acento del
                      grupo)
                    </li>
                    <li>
                      Ícono 44×44px con <code>card.bgColor</code> de fondo
                    </li>
                    <li>
                      <code>app-icon</code> con
                      <code>[style.color]="card.color"</code>
                    </li>
                    <li>Flecha <code>mdi:arrow-up-right</code> en gris</li>
                    <li>Label en <code>font-bold text-900 text-sm</code></li>
                    <li>
                      Description opcional en
                      <code>text-xs text-secondary</code>
                    </li>
                    <li>
                      Grid:
                      <code>col-2 xl · col-3 lg · col-4 md · col-6 sm</code>
                    </li>
                    <li>Header de grupo: barra vertical + uppercase + línea</li>
                  </ul>
                </p-card>
              </div>
              <div class="col-12 md:col-6">
                <p-card
                  styleClass="border-round-lg p-2"
                  header="📱 Mobile (< md)"
                >
                  <ul class="m-0 pl-3 text-xs line-height-3">
                    <li>
                      <code>ion-list</code> con
                      <code>ion-item-divider</code> por grupo
                    </li>
                    <li>
                      <code>div slot="start"</code> — NUNCA <code>span</code> ni
                      <code>ion-avatar</code>
                    </li>
                    <li>Ícono 36-38px con <code>ml-3 mr-2</code></li>
                    <li>
                      <code>[ngClass]</code> para color (aditivo) — no
                      <code>[class]</code>
                    </li>
                    <li>
                      <code>detail="true"</code> para mostrar flecha nativa de
                      Ionic
                    </li>
                    <li>Grupos agrupados con <code>ion-item-divider</code></li>
                  </ul>
                </p-card>
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
          </p-card>
        }
      }
    </section>
  `,
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

  // ─── Navigation Hub Page demo data ───────────────────────────
  readonly navHubModel = `interface DashboardCard {
  title:       string;      // requerido
  description: string;      // requerido (puede ser '' si no aplica)
  route?:      string;      // undefined si abre modal
  icon:        string;      // MDI icon  e.g. "mdi:home"
  bgColor:     string;      // pastel hex  e.g. "#dbeafe"
  color:       string;      // acento hex  e.g. "#1d4ed8"  ← REQUERIDO
}

interface DashboardGroup {
  label:  string;           // nombre del grupo (uppercase en UI)
  icon:   string;           // MDI icon para el header del grupo
  cards:  DashboardCard[];
}`;

  readonly navHubDemo = [
    {
      title: "Clientes",
      icon: "mdi:domain",
      bgColor: "#dbeafe",
      color: "#1d4ed8",
      description: "Gestión de clientes.",
    },
    {
      title: "Roles",
      icon: "mdi:shield-account-outline",
      bgColor: "#e0e7ff",
      color: "#4338ca",
      description: "",
    },
    {
      title: "Cargos",
      icon: "mdi:cash-remove",
      bgColor: "#ffdad6",
      color: "#b91c1c",
      description: "Emisión de cargos.",
    },
    {
      title: "Pagos",
      icon: "mdi:cash-check",
      bgColor: "#d1fae5",
      color: "#15803d",
      description: "",
    },
    {
      title: "Reportes",
      icon: "mdi:chart-bar",
      bgColor: "#fef9c3",
      color: "#a16207",
      description: "Reportes contables.",
    },
    {
      title: "Configuración",
      icon: "mdi:cog-outline",
      bgColor: "#f3e8ff",
      color: "#7c3aed",
      description: "",
    },
  ];

  readonly navHubImplementations = [
    {
      label: "Configuración del Sistema",
      icon: "mdi:cog",
      route: "/settings/home",
    },
    {
      label: "Contabilidad (Master)",
      icon: "mdi:wallet",
      route: "/contabilidad",
    },
    { label: "Cobranza Nativa", icon: "mdi:cash", route: "/cobranza-nativa" },
  ];
}

