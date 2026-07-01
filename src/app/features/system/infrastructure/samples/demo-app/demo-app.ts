import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { FormsModule } from "@angular/forms";
import { BadgeModule } from "primeng/badge";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { IconFieldModule } from "primeng/iconfield";
import { InputNumberModule } from "primeng/inputnumber";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToolbarModule } from "primeng/toolbar";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface DemoMetric {
  label: string;
  value: string;
  detail: string;
  icon: string;
  tone: string;
}

interface ColorToken {
  name: string;
  token: string;
  value: string;
  usage: string;
}

interface TypographyRule {
  role: string;
  token: string;
  size: string;
  usage: string;
  example: string;
}

interface IdentityPillar {
  title: string;
  icon: string;
  summary: string;
  application: string;
  severity: TagSeverity;
}

interface ColorAssessment {
  role: string;
  current: string;
  verdict: string;
  recommendation: string;
  severity: TagSeverity;
}

interface IdentityScenario {
  title: string;
  context: string;
  typography: string;
  color: string;
  action: string;
  severity: TagSeverity;
}

interface ButtonRule {
  variant: string;
  usage: string;
  avoid: string;
  severity: TagSeverity;
  cardClass: string;
  iconClass: string;
}

interface CardPattern {
  title: string;
  subtitle: string;
  icon: string;
  usage: string;
  meta: string;
  severity: TagSeverity;
  cardClass: string;
  iconClass: string;
}

interface ComponentCatalogItem {
  family: string;
  selector: string;
  source: string;
  useCase: string;
  preferredFor: string;
  avoidWhen: string;
  status: "Usar" | "Web" | "Mobile" | "Especializado";
}

interface DemoOption {
  label: string;
  value: string;
}

interface TableRow {
  folio: string;
  area: string;
  responsible: string;
  dueDate: string;
  amount: number;
  status: "Aprobado" | "Revision" | "Pendiente" | "Riesgo";
}

interface RuleItem {
  title: string;
  description: string;
}

interface BusinessScenario {
  title: string;
  description: string;
  rule: string;
  icon: string;
}

interface InvoiceLine {
  id: string;
  concept: string;
  quantity: number;
  price: number;
  total: number;
}

@Component({
  selector: "app-demo-app",
  imports: [
    AppIcon,
    CommonModule,
    FormsModule,
    BadgeModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DatePickerModule,
    DialogModule,
    DividerModule,
    IconFieldModule,
    InputNumberModule,
    InputIconModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    ProgressSpinnerModule,
    RadioButtonModule,
    SelectModule,
    SkeletonModule,
    TableModule,
    TabsModule,
    TagModule,
    TextareaModule,
    ToggleSwitchModule,
    ToolbarModule,
  ],
  templateUrl: "./demo-app.html",
  styleUrls: ["./demo-app.scss"],
})
export class DemoApp {
  activeTab = "overview";
  dialogVisible = false;

  // Form State
  sampleName = "Torre Administrativa";
  sampleBudget = 125000;
  sampleDescription =
    "Descripcion breve, accionable y sin lenguaje ambiguo para el usuario operativo.";
  selectedArea: DemoOption | null = null;
  selectedModules: DemoOption[] = [];
  selectedDate = new Date(2026, 3, 22);
  enabled = true;
  accepted = true;
  priority = "media";
  search = "";

  // Master-Detail Scenario State
  invoiceLines: InvoiceLine[] = [
    { id: "1", concept: "Mantenimiento Elevadores", quantity: 1, price: 15000, total: 15000 },
    { id: "2", concept: "Limpieza Areas Comunes", quantity: 5, price: 1200, total: 6000 },
  ];

  readonly businessScenarios: BusinessScenario[] = [
    {
      title: "Master-Detail (Complejidad)",
      description: "Gestion de formularios con lineas dinamicas y calculos en tiempo real.",
      rule: "Usar botones outlined para acciones secundarias y primary para el cierre del flujo.",
      icon: "mdi:format-list-checks"
    },
    {
      title: "Dashboard de Lujo (Identidad)",
      description: "Uso de Luxury Gold para jerarquizar KPIs financieros y resultados premium.",
      rule: "Maximo 5% de presencia dorada en pantalla para mantener la elegancia.",
      icon: "mdi:star"
    },
    {
      title: "Responsive Total (Omnichannel)",
      description: "Transicion automatica de tablas densas a vistas de tarjetas en dispositivos moviles.",
      rule: "Obligatorio implementar app-data-view-mobile en cada listado operativo.",
      icon: "mdi:cellphone"
    }
  ];

  readonly areas: DemoOption[] = [
    { label: "Administracion", value: "admin" },
    { label: "Operaciones", value: "ops" },
    { label: "Finanzas", value: "finance" },
    { label: "Recursos Humanos", value: "hr" },
  ];

  readonly modules: DemoOption[] = [
    { label: "Cuentas por cobrar", value: "ar" },
    { label: "Mantenimiento", value: "maintenance" },
    { label: "Compras", value: "purchases" },
    { label: "Biblioteca", value: "library" },
  ];

  readonly metrics: DemoMetric[] = [
    {
      label: "Consistencia UI",
      value: "92%",
      detail: "Componentes alineados a DS",
      icon: "mdi:tune",
      tone: "primary",
    },
    {
      label: "Densidad ERP",
      value: "Alta",
      detail: "Lectura rapida sin perder aire visual",
      icon: "mdi:table",
      tone: "info",
    },
    {
      label: "Mobile ready",
      value: "AA",
      detail: "Controles tactiles y secciones apilables",
      icon: "mdi:cellphone",
      tone: "success",
    },
  ];

  readonly typographyScale: TypographyRule[] = [
    {
      role: "Display institucional",
      token: "--ds-font-size-display",
      size: "32px",
      usage: "Hero interno, portada de modulo o pantalla guia.",
      example: "Demo institucional de interfaz",
    },
    {
      role: "Titulo de pagina",
      token: "--ds-font-size-page-title",
      size: "28px",
      usage: "Una vez por vista; describe la tarea operativa principal.",
      example: "Solicitudes de mantenimiento",
    },
    {
      role: "Titulo de seccion",
      token: "--ds-font-size-section-title",
      size: "20px",
      usage: "Agrupa informacion relacionada dentro de cards o paneles.",
      example: "Datos generales",
    },
    {
      role: "Titulo de card/dialog",
      token: "--ds-font-size-card-title",
      size: "16px",
      usage: "Encabezados compactos en cards, dialogs y paneles secundarios.",
      example: "Resumen financiero",
    },
    {
      role: "Texto operativo",
      token: "--ds-font-size-body",
      size: "15px",
      usage: "Parrafos breves, instrucciones y lectura normal del ERP.",
      example: "Selecciona el area responsable del proceso.",
    },
    {
      role: "Label",
      token: "--ds-font-size-label",
      size: "14px",
      usage: "Siempre visible sobre el campo; no sustituir por placeholder.",
      example: "Importe autorizado",
    },
    {
      role: "Tabla y listas densas",
      token: "--ds-font-size-table",
      size: "14px",
      usage: "Contenido compacto, alineado y facil de comparar.",
      example: "ERP-2026-001 | Finanzas | Aprobado",
    },
    {
      role: "Ayuda y validacion",
      token: "--ds-font-size-help",
      size: "13px",
      usage: "Hints, restricciones, validaciones y textos secundarios.",
      example: "La busqueda consulta folio, area o responsable.",
    },
  ];

  readonly colors: ColorToken[] = [
    {
      name: "Primario corporativo",
      token: "--ds-primary",
      value: "#0b3164",
      usage: "Accion principal, navegacion activa, foco y acento institucional.",
    },
    {
      name: "Success",
      token: "--ds-success",
      value: "#065f46",
      usage: "Confirmaciones, estados completos y metricas positivas.",
    },
    {
      name: "Warning",
      token: "--ds-warning",
      value: "#92400e",
      usage: "Pendientes, atencion operativa y riesgos moderados.",
    },
    {
      name: "Danger",
      token: "--ds-danger",
      value: "#991b1b",
      usage: "Errores, eliminacion y estados bloqueantes.",
    },
    {
      name: "Info",
      token: "--ds-info",
      value: "#0891b2",
      usage: "Contexto, ayuda y mensajes informativos no criticos.",
    },
    {
      name: "Dorado Luxury",
      token: "--ds-luxury-gold",
      value: "#c9a84c",
      usage:
        "Acento premium para documentos, portadas, reportes formales y separadores.",
    },
    {
      name: "Gris documental",
      token: "--ds-document-neutral",
      value: "#6b7280",
      usage: "Metadatos, fechas, versionado y texto secundario documental.",
    },
    {
      name: "Borde",
      token: "--ds-border",
      value: "#e2e8f0",
      usage: "Separacion de superficies; controles usan borde base de 1px.",
    },
    {
      name: "Fondo pagina",
      token: "--ds-bg-page",
      value: "#f8fafc",
      usage: "Fondo general para vistas administrativas.",
    },
    {
      name: "Superficie",
      token: "--ds-bg-surface",
      value: "#ffffff",
      usage: "Cards, tablas, formularios y modales.",
    },
  ];

  readonly identityPillars: IdentityPillar[] = [
    {
      title: "Autoridad tranquila",
      icon: "mdi:bank",
      summary:
        "LuxuryApp debe sentirse corporativa, confiable y precisa sin parecer pesada.",
      application:
        "Azul profundo como firma, superficies limpias y acciones primarias muy claras.",
      severity: "info",
    },
    {
      title: "Operacion sin friccion",
      icon: "mdi:flash",
      summary:
        "El usuario ERP necesita decidir rapido, comparar datos y cerrar tareas.",
      application:
        "Tipografia compacta, tablas legibles, labels persistentes y estados visibles.",
      severity: "success",
    },
    {
      title: "Jerarquia auditables",
      icon: "mdi:shield",
      summary:
        "Cada pantalla debe dejar claro que es dato, estado, decision o accion.",
      application:
        "Color semantico reservado, maximo una primaria por bloque y danger confirmado.",
      severity: "warn",
    },
  ];

  readonly colorAssessment: ColorAssessment[] = [
    {
      role: "Marca principal",
      current: "#0b3164 sobre blanco",
      verdict: "Consistente",
      recommendation:
        "Mantenerlo como azul corporativo. Tiene presencia ERP y buen contraste para botones.",
      severity: "success",
    },
    {
      role: "Primary hover/active",
      current: "#092953 / #072042",
      verdict: "Consistente",
      recommendation:
        "Correcto para profundidad. Evitar aclararlo demasiado porque perderia autoridad.",
      severity: "success",
    },
    {
      role: "Sidebar y header",
      current: "#18181b",
      verdict: "Aceptable",
      recommendation:
        "Funciona como neutro premium. Si se quiere mas identidad, migrar a #020811 para alinear con primary-950.",
      severity: "info",
    },
    {
      role: "Info",
      current: "#0891b2",
      verdict: "Buena separacion",
      recommendation:
        "Mantenerlo para informacion contextual; no usarlo como accion principal.",
      severity: "info",
    },
    {
      role: "Acento Luxury",
      current: "#C9A84C",
      verdict: "Adoptado como soporte",
      recommendation:
        "Usarlo en documentos, reportes y detalles premium; no como primary ni como estado operativo.",
      severity: "warn",
    },
    {
      role: "Warning",
      current: "#92400e + #fef3c7",
      verdict: "Consistente",
      recommendation:
        "Buen contraste para alertas operativas. Reservarlo para atencion, no para errores.",
      severity: "warn",
    },
    {
      role: "Danger",
      current: "#991b1b + #fee2e2",
      verdict: "Consistente",
      recommendation:
        "Adecuado para acciones destructivas y bloqueos. Siempre acompanarlo con texto claro.",
      severity: "danger",
    },
  ];

  readonly identityScenarios: IdentityScenario[] = [
    {
      title: "Dashboard ejecutivo",
      context: "Vista de direccion con KPIs, tendencia y alertas de operacion.",
      typography: "Metricas en 24px; labels y contexto en 13-14px.",
      color:
        "Primario para navegacion activa; success/warning/danger solo para estado real.",
      action: "CTA principal: Ver detalle o Exportar reporte, no ambos con primary.",
      severity: "info",
    },
    {
      title: "Formulario operativo",
      context: "Captura o edicion de registros con validacion de negocio.",
      typography: "Labels 14px semibold; ayuda 13px; cuerpo 15px.",
      color:
        "Bordes neutros de 1px, foco primary y errores danger con mensaje accionable.",
      action: "Guardar primary, Cancelar secondary outlined, Eliminar danger separado.",
      severity: "success",
    },
    {
      title: "Tabla de auditoria",
      context: "Listado denso con filtros, estados y acciones por fila.",
      typography: "Celdas 14px; folios semibold; importes alineados a la derecha.",
      color:
        "Tags semanticos para estado; no colorear filas completas salvo riesgo critico.",
      action: "Ver y editar como text buttons; acciones extra en menu contextual.",
      severity: "secondary",
    },
  ];

  readonly buttonRules: ButtonRule[] = [
    {
      variant: "Primary",
      usage: "Una accion principal por bloque: guardar, crear, aprobar.",
      avoid: "No usar para acciones destructivas ni acciones repetidas.",
      severity: "info",
      cardClass: "h-full border-left-3 border-primary surface-card shadow-1",
      iconClass: "mdi:check-circle text-primary text-xl",
    },
    {
      variant: "Secondary",
      usage: "Acciones de soporte: cancelar, regresar, limpiar filtros.",
      avoid: "No competir visualmente con la accion principal.",
      severity: "secondary",
      cardClass: "h-full border-left-3 surface-border surface-card shadow-1",
      iconClass: "mdi:arrow-left text-color-secondary text-xl",
    },
    {
      variant: "Success",
      usage: "Confirmar procesos positivos o cierre exitoso.",
      avoid: "No usar solo porque el boton guarda; guardar suele ser primary.",
      severity: "success",
      cardClass: "h-full border-left-3 border-green-500 surface-card shadow-1",
      iconClass: "mdi:check text-green-600 text-xl",
    },
    {
      variant: "Danger",
      usage: "Eliminar, rechazar o revertir informacion sensible.",
      avoid: "Nunca ubicar sin confirmacion en acciones irreversibles.",
      severity: "danger",
      cardClass: "h-full border-left-3 border-red-500 surface-card shadow-1",
      iconClass: "mdi:delete text-red-600 text-xl",
    },
    {
      variant: "Text",
      usage: "Acciones de baja jerarquia dentro de toolbars o filas.",
      avoid: "No usar para el CTA principal de un formulario.",
      severity: "secondary",
      cardClass: "h-full border-left-3 border-300 surface-card shadow-1",
      iconClass: "mdi:dots-horizontal text-600 text-xl",
    },
  ];

  readonly cards: CardPattern[] = [
    {
      title: "Card de acceso",
      subtitle: "Entrada a modulo",
      icon: "mdi:view-grid",
      usage: "Menu, navegacion y accesos frecuentes.",
      meta: "Altura consistente, hover discreto y titulo corto.",
      severity: "info",
      cardClass: "h-full border-top-3 border-primary surface-card shadow-2 hover:shadow-4 transition-all transition-duration-200",
      iconClass: "mdi:view-grid text-primary text-2xl",
    },
    {
      title: "Card de metrica",
      subtitle: "Resumen ejecutivo",
      icon: "mdi:chart-line",
      usage: "KPIs, totales y alertas de gestion.",
      meta: "Valor dominante, contexto breve y estado claro.",
      severity: "success",
      cardClass: "h-full border-top-3 border-cyan-500 surface-card shadow-2 hover:shadow-4 transition-all transition-duration-200",
      iconClass: "mdi:chart-line text-cyan-600 text-2xl",
    },
    {
      title: "Card de estado",
      subtitle: "Operacion actual",
      icon: "mdi:shield",
      usage: "Bloques de validacion, permisos o salud del sistema.",
      meta: "Tag visible, texto accionable y sin saturar la pantalla.",
      severity: "warn",
      cardClass: "h-full border-top-3 border-green-500 surface-card shadow-2 hover:shadow-4 transition-all transition-duration-200",
      iconClass: "mdi:shield text-green-600 text-2xl",
    },
  ];

  readonly componentCatalog: ComponentCatalogItem[] = [
    {
      family: "Botones web",
      selector: "custom-button-*",
      source: "core/components/web/buttons",
      useCase: "Acciones estandarizadas en vistas Angular web/tablet/desktop.",
      preferredFor:
        "CRUD, acciones por fila, guardar, editar, eliminar, descargar y confirmar.",
      avoidWhen: "La pantalla vive dentro de ion-page; usar familia ion-button-*.",
      status: "Web",
    },
    {
      family: "Botones mobile",
      selector: "ion-button-*",
      source: "core/components/web/buttons",
      useCase: "Acciones equivalentes optimizadas para render Ionic.",
      preferredFor:
        "Pantallas mobile, FAB, acciones tactiles y confirmaciones nativas.",
      avoidWhen: "Vistas web administrativas con PrimeNG.",
      status: "Mobile",
    },
    {
      family: "Inputs web signal",
      selector: "custom-input-*-signal",
      source: "core/components/web/inputs",
      useCase:
        "Campos reutilizables con ControlValueAccessor y validacion integrada.",
      preferredFor:
        "Formularios de negocio con labels, errores y tipos especializados.",
      avoidWhen: "Prototipos simples donde un pInputText directo sea suficiente.",
      status: "Web",
    },
    {
      family: "Inputs unificados (web + mobile)",
      selector: "custom-input-*-signal",
      source: "core/components/web/inputs",
      useCase: "Un solo componente detecta plataforma: PrimeNG en desktop, Ionic en mobile (<768px).",
      preferredFor: "Todos los formularios é web y mobile. No importar Ionic raw en features.",
      avoidWhen: "Nunca é estos reemplazan los antiguos ion-input-* eliminados.",
      status: "Usar",
    },
    {
      family: "Tabla PrimeNG",
      selector: "primeng-custom-caption / footer / global-filter",
      source: "core/components/primeng-custom-*",
      useCase: "Piezas auxiliares para tablas ERP consistentes.",
      preferredFor: "Listados con busqueda, caption institucional y pie de tabla.",
      avoidWhen: "Listados mobile donde convenga DataViewMobile.",
      status: "Usar",
    },
    {
      family: "Mobile data",
      selector: "app-data-view-mobile",
      source: "core/components/data-view-mobile",
      useCase: "Listado mobile agrupado o plano con template proyectado.",
      preferredFor: "Reemplazar tablas densas en pantallas pequenas.",
      avoidWhen: "Comparacion tabular de muchas columnas en desktop.",
      status: "Mobile",
    },
    {
      family: "Acciones contextuales",
      selector: "app-action-menu",
      source: "core/components/action-menu",
      useCase:
        "Menu de acciones por fila con PrimeNG en web e Ionic en mobile.",
      preferredFor:
        "Mas de dos acciones secundarias o acciones poco frecuentes.",
      avoidWhen:
        "Accion primaria visible que el usuario debe reconocer de inmediato.",
      status: "Usar",
    },
    {
      family: "Estados y soporte",
      selector: "app-loader / app-status-badge / global-error-alert",
      source: "core/components",
      useCase: "Feedback visual, errores globales y estados normalizados.",
      preferredFor: "Carga, estados de negocio y errores transversales.",
      avoidWhen: "Mensajes locales simples donde p-message sea suficiente.",
      status: "Usar",
    },
    {
      family: "Documentos y reportes",
      selector: "app-pdf-viewer-* / app-report-header / page-title-report",
      source: "core/components",
      useCase: "Visualizacion PDF, cabeceras y titulos de reportes.",
      preferredFor: "Reportes, manuales, solicitudes y documentos formales.",
      avoidWhen: "Contenido operativo que no sera impreso/exportado.",
      status: "Especializado",
    },
    {
      family: "Graficas",
      selector: "app-custom-bar-chart / app-pie-chart / app-primeng-radar-chart",
      source: "core/components/charts",
      useCase: "Visualizaciones ejecutivas reutilizables.",
      preferredFor: "Dashboards, comparativos y analisis de metricas.",
      avoidWhen: "Datos que requieren tabla para auditoria o exportacion.",
      status: "Especializado",
    },
  ];

  readonly tableRows: TableRow[] = [
    {
      folio: "ERP-2026-001",
      area: "Finanzas",
      responsible: "Direccion",
      dueDate: "22/04/2026",
      amount: 125000,
      status: "Aprobado",
    },
    {
      folio: "ERP-2026-002",
      area: "Operaciones",
      responsible: "Gerencia",
      dueDate: "25/04/2026",
      amount: 48000,
      status: "Revision",
    },
    {
      folio: "ERP-2026-003",
      area: "Mantenimiento",
      responsible: "Supervisor",
      dueDate: "28/04/2026",
      amount: 7600,
      status: "Pendiente",
    },
    {
      folio: "ERP-2026-004",
      area: "Compras",
      responsible: "Coordinacion",
      dueDate: "30/04/2026",
      amount: 23000,
      status: "Riesgo",
    },
  ];

  readonly spacingRules: RuleItem[] = [
    {
      title: "Grid base",
      description:
        "Usar PrimeFlex con 12 columnas: col-12, md:col-6 y lg:col-4 segun densidad.",
    },
    {
      title: "Separacion vertical",
      description:
        "Bloques principales con gap-4 o gap-5; campos relacionados con gap-3.",
    },
    {
      title: "Ancho maximo",
      description:
        "Formularios complejos deben limitar lectura y dividirse en secciones, no extenderse sin jerarquia.",
    },
    {
      title: "Densidad",
      description:
        "Tablas pueden ser compactas; formularios deben conservar aire para reducir errores.",
    },
  ];

  readonly systemStates: RuleItem[] = [
    {
      title: "Loading",
      description:
        "Mostrar spinner o skeleton si el contenido tarda mas de 300ms.",
    },
    {
      title: "Empty state",
      description:
        "Explicar que falta y ofrecer una accion clara para continuar.",
    },
    {
      title: "Error",
      description:
        "Indicar causa, impacto y siguiente paso; evitar mensajes tecnicos crudos.",
    },
    {
      title: "Sin permisos",
      description:
        "Ser claro sin revelar informacion sensible del modulo bloqueado.",
    },
  ];

  readonly globalRules: RuleItem[] = [
    {
      title: "Bordes",
      description:
        "Controles interactivos usan 1px; cards y paneles mantienen borde sutil y radio moderado.",
    },
    {
      title: "Sombras",
      description:
        "Usar sombra para jerarquia o hover, no como decoracion permanente excesiva.",
    },
    {
      title: "Dialogs",
      description:
        "Reservar para decisiones breves; flujos largos deben navegar a una vista dedicada.",
    },
    {
      title: "Iconos",
      description:
        "Acompanian el significado; no sustituyen labels en acciones criticas.",
    },
    {
      title: "Acciones",
      description:
        "Maximo una primaria por bloque; destructivas separadas y confirmadas.",
    },
    {
      title: "Mobile",
      description:
        "Apilar formularios, ampliar botones y reemplazar tablas densas por cards cuando sea necesario.",
    },
  ];

  getStatusSeverity(status: TableRow["status"]): TagSeverity {
    const map: Record<TableRow["status"], TagSeverity> = {
      Aprobado: "success",
      Revision: "info",
      Pendiente: "warn",
      Riesgo: "danger",
    };
    return map[status];
  }

  getCatalogSeverity(status: ComponentCatalogItem["status"]): TagSeverity {
    const map: Record<ComponentCatalogItem["status"], TagSeverity> = {
      Usar: "success",
      Web: "info",
      Mobile: "warn",
      Especializado: "secondary",
    };
    return map[status];
  }

  openDialog(): void {
    this.dialogVisible = true;
  }
}

