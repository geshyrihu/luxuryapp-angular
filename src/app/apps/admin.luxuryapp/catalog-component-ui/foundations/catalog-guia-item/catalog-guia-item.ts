import { CommonModule } from "@angular/common";
import {
  Component,
  inject,
  signal,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CheckboxModule } from "primeng/checkbox";
import { InputText } from "@ui/inputs/adaptive/input-text/input-text";
import { InputTextarea } from "@ui/inputs/adaptive/input-textarea/input-textarea";
import { InputNumber } from "@ui/inputs/adaptive/input-number/input-number";
import { CustomInputDatepicker } from "@ui/inputs/web/custom-input-datepicker-signal";
import { CustomInputToggleSwitch } from "@ui/inputs/web/custom-input-toggle-switch-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputMultiselectSignal } from "@ui/inputs/web/custom-input-multiselect-signal";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { ToolbarModule } from "primeng/toolbar";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { ButtonCatalog } from "./components/button-catalog/button-catalog";

type TagSeverity =
  "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

const GUIA_LABELS: Record<string, string> = {
  identitypillars: "Identity Pillars",
  colorvalidation: "Color Validation",
  componentcatalog: "Component Catalog",
  buttonrules: "Button Rules",
  referenceform: "Reference Form",
  buttoncatalog: "Button Catalog",
};

@Component({
  selector: "app-catalog-guia-item",
  imports: [
    CommonModule,
    FormsModule,
    WebButtonLabel,
    CheckboxModule,
    InputText,
    InputTextarea,
    InputNumber,
    CustomInputDatepicker,
    CustomInputToggleSwitch,
    CustomInputSelectSignal,
    CustomInputMultiselectSignal,
    CustomSearchInput,
    DialogModule,
    DividerModule,
    MessageModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SkeletonModule,
    TableModule,
    TagModule,
    ToolbarModule,
    AppIcon,
    ButtonCatalog,
  ],
  template: `
    <section class="fadein">
      <div class="section-header mb-4">
        <h2 class="text-3xl font-bold m-0">{{ label }}</h2>
      </div>

      @switch (item()) {
        @case ("identitypillars") {
          <div class="grid mb-5">
            @for (m of metrics; track m.label) {
              <div class="col-12 md:col-4">
                <div class="card h-full">
                  <div class="flex align-items-center gap-3">
                    <app-icon [icon]="m.icon" class="text-primary text-3xl" />
                    <div>
                      <div class="text-2xl font-bold">{{ m.value }}</div>
                      <div class="font-semibold">{{ m.label }}</div>
                      <small class="text-color-secondary">{{ m.detail }}</small>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <h3 class="text-xl font-bold mb-3">Casos de Uso de Negocio</h3>
          <div class="grid mb-5">
            @for (s of businessScenarios; track s.title) {
              <div class="col-12 lg:col-4">
                <div class="card h-full border-top-3 border-primary surface-card">
                  <div class="flex align-items-center gap-3 mb-3">
                    <app-icon [icon]="s.icon" class="text-primary text-2xl" />
                    <strong class="text-xl">{{ s.title }}</strong>
                  </div>
                  <p class="text-color-secondary line-height-3 mb-3">
                    {{ s.description }}
                  </p>
                  <div
                    class="p-3 border-round bg-primary-50 text-primary-900 text-sm"
                  >
                    <strong>Regla:</strong> {{ s.rule }}
                  </div>
                </div>
              </div>
            }
          </div>

          <h3 class="text-xl font-bold mb-3">Identidad LuxuryApp ERP</h3>
          <p-message
            severity="success"
            text="Diagnostico: la paleta actual es consistente para ERP corporativo. El azul #00050e es la firma principal y el gold #c9a74d es el acento premium documental."
            class="mb-4 block"
          />
          <div class="grid mb-4">
            @for (p of identityPillars; track p.title) {
              <div class="col-12 lg:col-4">
                <div
                  class="h-full border-left-3 border-primary surface-card shadow-1"
                 class="card">
                  <div class="flex align-items-start gap-3">
                    <app-icon [icon]="p.icon" class="text-primary text-2xl" />
                    <div>
                      <div class="flex align-items-center gap-2 mb-2">
                        <strong>{{ p.title }}</strong>
                        <p-tag [value]="p.severity" [severity]="p.severity" />
                      </div>
                      <p class="m-0 line-height-3 text-color-secondary">
                        {{ p.summary }}
                      </p>
                      <small class="block mt-3 text-color-secondary">{{
                        p.application
                      }}</small>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @case ("colorvalidation") {
          <p-message
            severity="info"
            class="mb-4 block"
            text="Tipografóa y paleta de color estén centralizados en la sección 'Tokens &amp; Identidad Visual'. Ve allé para la referencia completa con tokens CSS copiables."
          />
          <div class="card">
            <p-table [value]="colorAssessment" class="p-datatable-sm">
              <ng-template #header
                ><tr>
                  <th>Rol</th>
                  <th>Actual</th>
                  <th>Veredicto</th>
                  <th>Sugerencia</th>
                </tr></ng-template
              >
              <ng-template #body let-item>
                <tr>
                  <td>
                    <strong>{{ item.role }}</strong>
                  </td>
                  <td>
                    <code>{{ item.current }}</code>
                  </td>
                  <td>
                    <p-tag [value]="item.verdict" [severity]="item.severity" />
                  </td>
                  <td>{{ item.recommendation }}</td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        }

        @case ("componentcatalog") {
          <p-message
            severity="info"
            text="Regla: si el componente core ya resuelve el caso, usarlo antes de crear HTML nuevo. Inputs y botones son unificados (web+mobile auto-detect)."
            class="mb-3 block"
          />
          <div class="card">
            <p-table
              [value]="componentCatalog"
              [paginator]="true"
              [rows]="8"
              class="p-datatable-sm"
            >
              <ng-template #header>
                <tr>
                  <th>Familia</th>
                  <th>Selector</th>
                  <th>Ubicación</th>
                  <th>Caso de uso</th>
                  <th>Preferir cuando</th>
                  <th>Evitar cuando</th>
                  <th>Estado</th>
                </tr>
              </ng-template>
              <ng-template #body let-item>
                <tr>
                  <td>
                    <strong>{{ item.family }}</strong>
                  </td>
                  <td>
                    <code>{{ item.selector }}</code>
                  </td>
                  <td>
                    <span class="text-sm text-color-secondary">{{
                      item.source
                    }}</span>
                  </td>
                  <td>{{ item.useCase }}</td>
                  <td>{{ item.preferredFor }}</td>
                  <td>{{ item.avoidWhen }}</td>
                  <td>
                    <p-tag
                      [value]="item.status"
                      [severity]="getCatalogSeverity(item.status)"
                    />
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </div>
        }

        @case ("buttonrules") {
          <div class="grid">
            @for (r of buttonRules; track r.variant) {
              <div class="col-12 md:col-6 xl:col-3">
                <div [class]="'card ' + r.cardClass">
                  <div class="flex align-items-start gap-3">
                    <app-icon [icon]="r.iconClass" />
                    <div>
                      <div class="flex align-items-center gap-2 mb-2">
                        <strong>{{ r.variant }}</strong>
                        <p-tag [value]="r.variant" [severity]="r.severity" />
                      </div>
                      <p class="m-0 text-color-secondary line-height-3">
                        {{ r.usage }}
                      </p>
                      <small class="block mt-2 text-color-secondary">{{
                        r.avoid
                      }}</small>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @case ("buttoncatalog") {
          <app-button-catalog />
        }

        @case ("referenceform") {
          <div class="card mb-5">
            <div class="grid formgrid">
              <div class="field col-12 md:col-6 xl:col-4">
                <custom-input-text-signal
                  [ngModel]="sampleName"
                  (ngModelChange)="sampleName = $event"
                  label="Nombre del registro"
                  [horizontal]="false"
                  [noMargin]="true"
                  customClass="w-full"
                  description="Usar nombres cortos, auditables y faciles de buscar."
                />
              </div>
              <div class="field col-12 md:col-6 xl:col-4">
                <custom-input-select-signal
                  [ngModel]="selectedArea"
                  (ngModelChange)="selectedArea = $event"
                  [data]="areas"
                  label="Area responsable"
                  placeholder="Selecciona area"
                  optionLabel="label"
                  [optionValue]="undefined"
                  [horizontal]="false"
                  [noMargin]="true"
                  customClass="w-full"
                />
              </div>
              <div class="field col-12 md:col-6 xl:col-4">
                <custom-input-multiselect-signal
                  [ngModel]="selectedModules"
                  (ngModelChange)="selectedModules = $event"
                  [options]="modules"
                  label="Modulos relacionados"
                  placeholder="Selecciona modulos"
                  optionLabel="label"
                  [optionValue]="undefined"
                  [horizontal]="false"
                  [noMargin]="true"
                  customClass="w-full"
                />
              </div>
              <div class="field col-12 md:col-6 xl:col-4">
                <custom-input-number-signal
                  [ngModel]="sampleBudget"
                  (ngModelChange)="sampleBudget = $event"
                  label="Importe autorizado"
                  mode="currency"
                  currency="MXN"
                  locale="es-MX"
                  [horizontal]="false"
                  [noMargin]="true"
                  customClass="w-full"
                />
              </div>
              <div class="field col-12 md:col-6 xl:col-4">
                <custom-input-datepicker-signal
                  [ngModel]="selectedDate"
                  (ngModelChange)="selectedDate = $event"
                  label="Fecha compromiso"
                  dateFormat="dd/mm/yy"
                  [horizontal]="false"
                  [noMargin]="true"
                  [dateStyle]="{ width: '100%' }"
                />
              </div>
              <div class="field col-12 md:col-6 xl:col-4">
                <label class="block mb-2">Busqueda</label>
                <custom-search-input-signal
                  placeholder="Buscar por folio, area o responsable"
                  (searchChange)="search = $event"
                />
              </div>
              <div class="field col-12">
                <custom-input-textarea-signal
                  [ngModel]="sampleDescription"
                  (ngModelChange)="sampleDescription = $event"
                  label="Descripcion ejecutiva"
                  [rows]="3"
                  [horizontal]="false"
                  [noMargin]="true"
                  customClass="w-full"
                />
              </div>
              <div class="field col-12 md:col-4">
                <custom-input-toggle-switch-signal
                  [ngModel]="enabled"
                  (ngModelChange)="enabled = $event"
                  label="Activo"
                  [horizontal]="false"
                  [noMargin]="true"
                />
              </div>
              <div class="field col-12 md:col-4 flex align-items-center gap-3">
                <p-checkbox
                  [(ngModel)]="accepted"
                  [binary]="true"
                  inputId="accepted"
                />
                <label for="accepted" class="font-normal"
                  >Confirmacion requerida</label
                >
              </div>
              <div class="field col-12 md:col-4 flex align-items-center gap-3">
                <label>Prioridad</label>
                <div class="flex gap-3">
                  <div class="flex align-items-center gap-1">
                    <p-radiobutton
                      name="priority"
                      value="baja"
                      [(ngModel)]="priority"
                      inputId="pbaja"
                    /><label for="pbaja" class="font-normal">Baja</label>
                  </div>
                  <div class="flex align-items-center gap-1">
                    <p-radiobutton
                      name="priority"
                      value="media"
                      [(ngModel)]="priority"
                      inputId="pmedia"
                    /><label for="pmedia" class="font-normal">Media</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-content-end gap-2 mt-4">
              <il-button
                label="Cancelar"
                severity="secondary"
                variant="outline"
              />
              <il-button
                label="Guardar cambios"
                iconClass="icon.content-save"
              />
            </div>
          </div>
          <p-message
            severity="warn"
            text="Regla: en mobile los botones de cierre de formulario deben ocupar el ancho disponible y mantener orden Cancelar -> Guardar."
            class="block"
          />
        }
      }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  encapsulation: ViewEncapsulation.None,
})
export class CatalogGuiaItem {
  private route = inject(ActivatedRoute);
  item = signal("");
  get label(): string {
    return GUIA_LABELS[this.item()] ?? this.item();
  }

  constructor() {
    this.route.paramMap.subscribe((p) => this.item.set(p.get("item") ?? ""));
  }

  dialogVisible = false;
  sampleName = "Torre Administrativa";
  sampleBudget = 125000;
  sampleDescription =
    "Descripcion breve, accionable y sin lenguaje ambiguo para el usuario operativo.";
  selectedArea: { label: string; value: string } | null = null;
  selectedModules: { label: string; value: string }[] = [];
  selectedDate = new Date(2026, 3, 22);
  enabled = true;
  accepted = true;
  priority = "media";
  search = "";

  readonly areas = [
    { label: "Administracion", value: "admin" },
    { label: "Operaciones", value: "ops" },
    { label: "Finanzas", value: "finance" },
    { label: "Recursos Humanos", value: "hr" },
  ];

  readonly modules = [
    { label: "Cuentas por cobrar", value: "ar" },
    { label: "Mantenimiento", value: "maintenance" },
    { label: "Compras", value: "purchases" },
    { label: "Biblioteca", value: "library" },
  ];

  readonly metrics = [
    {
      label: "Consistencia UI",
      value: "92%",
      detail: "Componentes alineados a DS",
      icon: "icon.tune",
      tone: "primary",
    },
    {
      label: "Densidad ERP",
      value: "Alta",
      detail: "Lectura rapida sin perder aire visual",
      icon: "icon.table",
      tone: "info",
    },
    {
      label: "Mobile ready",
      value: "AA",
      detail: "Controles tactiles y secciones apilables",
      icon: "icon.cellphone",
      tone: "success",
    },
  ];

  readonly identityPillars = [
    {
      title: "Autoridad tranquila",
      icon: "icon.bank",
      summary:
        "LuxuryApp debe sentirse corporativa, confiable y precisa sin parecer pesada.",
      application:
        "Azul profundo como firma, superficies limpias y acciones primarias muy claras.",
      severity: "info" as TagSeverity,
    },
    {
      title: "Operacion sin friccion",
      icon: "icon.flash",
      summary:
        "El usuario ERP necesita decidir rapido, comparar datos y cerrar tareas.",
      application:
        "Tipografia compacta, tablas legibles, labels persistentes y estados visibles.",
      severity: "success" as TagSeverity,
    },
    {
      title: "Jerarquia auditables",
      icon: "icon.shield",
      summary:
        "Cada pantalla debe dejar claro que es dato, estado, decision o accion.",
      application:
        "Color semantico reservado, maximo una primaria por bloque y danger confirmado.",
      severity: "warn" as TagSeverity,
    },
  ];

  readonly businessScenarios = [
    {
      title: "Master-Detail (Complejidad)",
      description:
        "Gestion de formularios con lineas dinamicas y calculos en tiempo real.",
      rule: "Usar botones outlined para acciones secundarias y primary para el cierre del flujo.",
      icon: "icon.format-list-checks",
    },
    {
      title: "Dashboard de Lujo (Identidad)",
      description:
        "Uso de Luxury Gold para jerarquizar KPIs financieros y resultados premium.",
      rule: "Maximo 5% de presencia dorada en pantalla para mantener la elegancia.",
      icon: "icon.star",
    },
    {
      title: "Responsive Total (Omnichannel)",
      description:
        "Transicion automatica de tablas densas a vistas de tarjetas en dispositivos moviles.",
      rule: "Obligatorio implementar app-data-view-mobile en cada listado operativo.",
      icon: "icon.cellphone",
    },
  ];

  readonly colorAssessment = [
    {
      role: "Marca principal",
      current: "#00050e sobre blanco",
      verdict: "Consistente",
      recommendation: "Mantenerlo como azul corporativo.",
      severity: "success" as TagSeverity,
    },
    {
      role: "Sidebar y header",
      current: "#18181b",
      verdict: "Aceptable",
      recommendation: "Migrar a #020811 para alinear con primary-950.",
      severity: "info" as TagSeverity,
    },
    {
      role: "Acento Luxury",
      current: "#C9A84C",
      verdict: "Adoptado como soporte",
      recommendation: "Usarlo en documentos, reportes y detalles premium.",
      severity: "warn" as TagSeverity,
    },
    {
      role: "Warning",
      current: "#d97706 + #fef3c7",
      verdict: "Consistente",
      recommendation: "Ambar claro sobre fondo crema.",
      severity: "warn" as TagSeverity,
    },
    {
      role: "Danger",
      current: "#991b1b + #fee2e2",
      verdict: "Consistente",
      recommendation: "Adecuado para acciones destructivas.",
      severity: "danger" as TagSeverity,
    },
  ];

  readonly buttonRules = [
    {
      variant: "Primary",
      usage: "Una accion principal por bloque: guardar, crear, aprobar.",
      avoid: "No usar para acciones destructivas ni acciones repetidas.",
      severity: "info" as TagSeverity,
      cardClass: "h-full border-left-3 border-primary surface-card shadow-1",
      iconClass: "icon.check-circle text-primary text-xl",
    },
    {
      variant: "Secondary",
      usage: "Acciones de soporte: cancelar, regresar, limpiar filtros.",
      avoid: "No competir visualmente con la accion principal.",
      severity: "secondary" as TagSeverity,
      cardClass: "h-full border-left-3 surface-border surface-card shadow-1",
      iconClass: "icon.arrow-left text-color-secondary text-xl",
    },
    {
      variant: "Danger",
      usage: "Eliminar, rechazar o revertir informacion sensible.",
      avoid: "Nunca ubicar sin confirmacion en acciones irreversibles.",
      severity: "danger" as TagSeverity,
      cardClass: "h-full border-left-3 border-red-500 surface-card shadow-1",
      iconClass: "icon.delete text-red-600 text-xl",
    },
    {
      variant: "Text",
      usage: "Acciones de baja jerarquia dentro de toolbars o filas.",
      avoid: "No usar para el CTA principal de un formulario.",
      severity: "secondary" as TagSeverity,
      cardClass: "h-full border-left-3 border-300 surface-card shadow-1",
      iconClass: "icon.dots-horizontal text-600 text-xl",
    },
  ];

  readonly componentCatalog = [
    {
      family: "Botones unificados",
      selector: "custom-button-*",
      source: "core/components/web/buttons",
      useCase: "Acciones estandarizadas. Auto-detectan plataforma.",
      preferredFor: "CRUD, acciones por fila, guardar, editar, eliminar.",
      avoidWhen: "Nunca — reemplazaron ios-button-* eliminados.",
      status: "Usar" as const,
    },
    {
      family: "Inputs unificados",
      selector: "custom-input-*-signal",
      source: "core/components/web/inputs",
      useCase: "CVA completo. Auto-detectan plataforma.",
      preferredFor: "Todos los formularios — web y mobile.",
      avoidWhen: "Nunca — reemplazaron ion-input-* eliminados.",
      status: "Usar" as const,
    },
    {
      family: "Mobile data",
      selector: "app-data-view-mobile",
      source: "core/components/data-view-mobile",
      useCase: "Listado mobile agrupado con template proyectado.",
      preferredFor: "Reemplazar tablas densas en pantallas pequenas.",
      avoidWhen: "Comparacion tabular de muchas columnas en desktop.",
      status: "Mobile" as const,
    },
    {
      family: "Acciones contextuales",
      selector: "app-action-menu",
      source: "core/components/action-menu",
      useCase: "Menu de acciones por fila con PrimeNG Popover.",
      preferredFor: "Mas de dos acciones secundarias.",
      avoidWhen: "Accion primaria visible.",
      status: "Usar" as const,
    },
    {
      family: "Tabla PrimeNG",
      selector: "primeng-custom-caption / footer",
      source: "core/components/primeng-custom-*",
      useCase: "Piezas auxiliares para tablas ERP.",
      preferredFor: "Listados con busqueda, caption y pie.",
      avoidWhen: "Listados mobile donde convenga DataViewMobile.",
      status: "Usar" as const,
    },
    {
      family: "Estados y soporte",
      selector: "app-loader / app-status-badge",
      source: "core/components",
      useCase: "Feedback visual y estados normalizados.",
      preferredFor: "Carga, estados de negocio y errores.",
      avoidWhen: "Mensajes locales simples.",
      status: "Usar" as const,
    },
    {
      family: "Documentos y reportes",
      selector: "app-pdf-viewer-* / report-header",
      source: "core/components",
      useCase: "Visualizacion PDF y cabeceras de reportes.",
      preferredFor: "Reportes, manuales y documentos formales.",
      avoidWhen: "Contenido operativo no imprimible.",
      status: "Especializado" as const,
    },
    {
      family: "Graficas",
      selector: "app-custom-bar-chart / app-pie-chart",
      source: "core/components/charts",
      useCase: "Visualizaciones ejecutivas reutilizables.",
      preferredFor: "Dashboards y metricas.",
      avoidWhen: "Datos que requieren tabla para auditoria.",
      status: "Especializado" as const,
    },
  ];

  getCatalogSeverity(
    status: "Usar" | "Web" | "Mobile" | "Especializado",
  ): TagSeverity {
    const map: Record<string, TagSeverity> = {
      Usar: "success",
      Web: "info",
      Mobile: "warn",
      Especializado: "secondary",
    };
    return map[status];
  }
}
