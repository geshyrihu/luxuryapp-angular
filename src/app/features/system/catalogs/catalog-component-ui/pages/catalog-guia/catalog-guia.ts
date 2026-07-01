import { CommonModule } from "@angular/common";
import { Component, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToolbarModule } from "primeng/toolbar";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";

type TagSeverity = "success" | "info" | "warn" | "danger" | "secondary" | "contrast";

@Component({
  selector: "app-catalog-guia",
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DatePickerModule,
    DialogModule,
    DividerModule,
    IconFieldModule,
    InputIconModule,
    InputNumberModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SelectModule,
    SkeletonModule,
    TableModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
    ToolbarModule,
    AppIcon,
  ],
  templateUrl: "./catalog-guia.html",
  styles: [`
    :host { display: contents; }
    @media (max-width: 767px) {
      .field { margin-bottom: 1rem; }
    }
  `],
  encapsulation: ViewEncapsulation.None,
})
export class CatalogGuia {
  dialogVisible = false;
  sampleName = "Torre Administrativa";
  sampleBudget = 125000;
  sampleDescription = "Descripcion breve, accionable y sin lenguaje ambiguo para el usuario operativo.";
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
    { label: "Consistencia UI", value: "92%", detail: "Componentes alineados a DS", icon: "mdi:tune", tone: "primary" },
    { label: "Densidad ERP", value: "Alta", detail: "Lectura rapida sin perder aire visual", icon: "mdi:table", tone: "info" },
    { label: "Mobile ready", value: "AA", detail: "Controles tactiles y secciones apilables", icon: "mdi:cellphone", tone: "success" },
  ];

  readonly identityPillars = [
    { title: "Autoridad tranquila", icon: "mdi:bank", summary: "LuxuryApp debe sentirse corporativa, confiable y precisa sin parecer pesada.", application: "Azul profundo como firma, superficies limpias y acciones primarias muy claras.", severity: "info" as TagSeverity },
    { title: "Operacion sin friccion", icon: "mdi:flash", summary: "El usuario ERP necesita decidir rapido, comparar datos y cerrar tareas.", application: "Tipografia compacta, tablas legibles, labels persistentes y estados visibles.", severity: "success" as TagSeverity },
    { title: "Jerarquia auditables", icon: "mdi:shield", summary: "Cada pantalla debe dejar claro que es dato, estado, decision o accion.", application: "Color semantico reservado, maximo una primaria por bloque y danger confirmado.", severity: "warn" as TagSeverity },
  ];

  readonly businessScenarios = [
    { title: "Master-Detail (Complejidad)", description: "Gestion de formularios con lineas dinamicas y calculos en tiempo real.", rule: "Usar botones outlined para acciones secundarias y primary para el cierre del flujo.", icon: "mdi:format-list-checks" },
    { title: "Dashboard de Lujo (Identidad)", description: "Uso de Luxury Gold para jerarquizar KPIs financieros y resultados premium.", rule: "Maximo 5% de presencia dorada en pantalla para mantener la elegancia.", icon: "mdi:star" },
    { title: "Responsive Total (Omnichannel)", description: "Transicion automatica de tablas densas a vistas de tarjetas en dispositivos moviles.", rule: "Obligatorio implementar app-data-view-mobile en cada listado operativo.", icon: "mdi:cellphone" },
  ];

  readonly colorAssessment = [
    { role: "Marca principal", current: "#00050e sobre blanco", verdict: "Consistente", recommendation: "Mantenerlo como azul corporativo.", severity: "success" as TagSeverity },
    { role: "Sidebar y header", current: "#18181b", verdict: "Aceptable", recommendation: "Migrar a #020811 para alinear con primary-950.", severity: "info" as TagSeverity },
    { role: "Acento Luxury", current: "#C9A74D", verdict: "Adoptado como soporte", recommendation: "Usarlo en documentos, reportes y detalles premium.", severity: "warn" as TagSeverity },
    { role: "Warning", current: "#d97706 + #fef3c7", verdict: "Consistente", recommendation: "Ambar claro sobre fondo crema.", severity: "warn" as TagSeverity },
    { role: "Danger", current: "#991b1b + #fee2e2", verdict: "Consistente", recommendation: "Adecuado para acciones destructivas.", severity: "danger" as TagSeverity },
  ];

  readonly buttonRules = [
    { variant: "Primary", usage: "Una accion principal por bloque: guardar, crear, aprobar.", avoid: "No usar para acciones destructivas ni acciones repetidas.", severity: "info" as TagSeverity, cardClass: "h-full border-left-3 border-primary surface-card shadow-1", iconClass: "mdi:check-circle text-primary text-xl" },
    { variant: "Secondary", usage: "Acciones de soporte: cancelar, regresar, limpiar filtros.", avoid: "No competir visualmente con la accion principal.", severity: "secondary" as TagSeverity, cardClass: "h-full border-left-3 surface-border surface-card shadow-1", iconClass: "mdi:arrow-left text-color-secondary text-xl" },
    { variant: "Danger", usage: "Eliminar, rechazar o revertir informacion sensible.", avoid: "Nunca ubicar sin confirmacion en acciones irreversibles.", severity: "danger" as TagSeverity, cardClass: "h-full border-left-3 border-red-500 surface-card shadow-1", iconClass: "mdi:delete text-red-600 text-xl" },
    { variant: "Text", usage: "Acciones de baja jerarquia dentro de toolbars o filas.", avoid: "No usar para el CTA principal de un formulario.", severity: "secondary" as TagSeverity, cardClass: "h-full border-left-3 border-300 surface-card shadow-1", iconClass: "mdi:dots-horizontal text-600 text-xl" },
  ];

  readonly componentCatalog = [
    { family: "Botones unificados", selector: "custom-button-*", source: "core/components/web/buttons", useCase: "Acciones estandarizadas. Auto-detectan plataforma.", preferredFor: "CRUD, acciones por fila, guardar, editar, eliminar.", avoidWhen: "Nunca — reemplazaron ios-button-* eliminados.", status: "Usar" as const },
    { family: "Inputs unificados", selector: "custom-input-*-signal", source: "core/components/web/inputs", useCase: "CVA completo. Auto-detectan plataforma.", preferredFor: "Todos los formularios — web y mobile.", avoidWhen: "Nunca — reemplazaron ion-input-* eliminados.", status: "Usar" as const },
    { family: "Mobile data", selector: "app-data-view-mobile", source: "core/components/data-view-mobile", useCase: "Listado mobile agrupado con template proyectado.", preferredFor: "Reemplazar tablas densas en pantallas pequenas.", avoidWhen: "Comparacion tabular de muchas columnas en desktop.", status: "Mobile" as const },
    { family: "Acciones contextuales", selector: "app-action-menu", source: "core/components/action-menu", useCase: "Menu de acciones por fila con PrimeNG Popover.", preferredFor: "Mas de dos acciones secundarias.", avoidWhen: "Accion primaria visible.", status: "Usar" as const },
    { family: "Tabla PrimeNG", selector: "primeng-custom-caption / footer", source: "core/components/primeng-custom-*", useCase: "Piezas auxiliares para tablas ERP.", preferredFor: "Listados con busqueda, caption y pie.", avoidWhen: "Listados mobile donde convenga DataViewMobile.", status: "Usar" as const },
    { family: "Estados y soporte", selector: "app-loader / app-status-badge", source: "core/components", useCase: "Feedback visual y estados normalizados.", preferredFor: "Carga, estados de negocio y errores.", avoidWhen: "Mensajes locales simples.", status: "Usar" as const },
    { family: "Documentos y reportes", selector: "app-pdf-viewer-* / report-header", source: "core/components", useCase: "Visualizacion PDF y cabeceras de reportes.", preferredFor: "Reportes, manuales y documentos formales.", avoidWhen: "Contenido operativo no imprimible.", status: "Especializado" as const },
    { family: "Graficas", selector: "app-custom-bar-chart / app-pie-chart", source: "core/components/charts", useCase: "Visualizaciones ejecutivas reutilizables.", preferredFor: "Dashboards y metricas.", avoidWhen: "Datos que requieren tabla para auditoria.", status: "Especializado" as const },
  ];

  readonly tableRows = [
    { folio: "ERP-2026-001", area: "Finanzas", responsible: "Direccion", dueDate: "22/04/2026", amount: 125000, status: "Aprobado" as const },
    { folio: "ERP-2026-002", area: "Operaciones", responsible: "Gerencia", dueDate: "25/04/2026", amount: 48000, status: "Revision" as const },
    { folio: "ERP-2026-003", area: "Mantenimiento", responsible: "Supervisor", dueDate: "28/04/2026", amount: 7600, status: "Pendiente" as const },
    { folio: "ERP-2026-004", area: "Compras", responsible: "Coordinacion", dueDate: "30/04/2026", amount: 23000, status: "Riesgo" as const },
  ];

  readonly globalRules = [
    { title: "Bordes", description: "Controles interactivos usan 1px; cards y paneles mantienen borde sutil y radio moderado." },
    { title: "Dialogs", description: "Reservar para decisiones breves; flujos largos deben navegar a una vista dedicada." },
    { title: "Iconos", description: "Acompanian el significado; no sustituyen labels en acciones criticas." },
    { title: "Acciones", description: "Maximo una primaria por bloque; destructivas separadas y confirmadas." },
    { title: "Mobile", description: "Apilar formularios, ampliar botones y reemplazar tablas densas por cards." },
    { title: "Sombras", description: "Usar sombra para jerarquia o hover, no como decoracion permanente." },
  ];

  readonly spacingRules = [
    { title: "Grid base", description: "Usar PrimeFlex con 12 columnas: col-12, md:col-6 y lg:col-4 segun densidad." },
    { title: "Separacion vertical", description: "Bloques principales con gap-4 o gap-5; campos relacionados con gap-3." },
    { title: "Densidad", description: "Tablas pueden ser compactas; formularios deben conservar aire para reducir errores." },
  ];

  readonly systemStates = [
    { title: "Loading", description: "Mostrar spinner o skeleton si el contenido tarda mas de 300ms." },
    { title: "Empty state", description: "Explicar que falta y ofrecer una accion clara para continuar." },
    { title: "Error", description: "Indicar causa, impacto y siguiente paso; evitar mensajes tecnicos crudos." },
    { title: "Sin permisos", description: "Ser claro sin revelar informacion sensible del modulo bloqueado." },
  ];

  getStatusSeverity(status: "Aprobado" | "Revision" | "Pendiente" | "Riesgo"): TagSeverity {
    const map: Record<string, TagSeverity> = { Aprobado: "success", Revision: "info", Pendiente: "warn", Riesgo: "danger" };
    return map[status];
  }

  getCatalogSeverity(status: "Usar" | "Web" | "Mobile" | "Especializado"): TagSeverity {
    const map: Record<string, TagSeverity> = { Usar: "success", Web: "info", Mobile: "warn", Especializado: "secondary" };
    return map[status];
  }

  openDialog(): void {
    this.dialogVisible = true;
  }
}

