/**
 * @file CatalogComponentUi — Design System & Component Catalog
 *
 * Catálogo central de diseño y componentes de LuxuryApp.
 * Funciona como admin template de referencia para todo el equipo de desarrollo.
 *
 * Framework: Angular 21 (standalone)
 * Web: PrimeNG 21
 * Móvil: Ionic 8
 * Estilos: Material Design cross-platform
 *
 * @module CatalogComponentUi
 */
import { CommonModule } from "@angular/common";
import { Component, computed, OnInit, signal, ViewEncapsulation } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

// --- Custom Components - Core ---
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { Loader } from "src/app/core/components/loader/loader";
import { NotificationItem } from "src/app/core/components/notification-center/notification-center";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { StatusBadge } from "src/app/core/components/status-badge/status-badge";
import { WizardStep } from "src/app/core/components/wizard/wizard";

// --- Enums & Helpers ---
import { AccordionModule } from "primeng/accordion";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { FloatLabelModule } from "primeng/floatlabel";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputNumberModule } from "primeng/inputnumber";
import { InputTextModule } from "primeng/inputtext";
import { MessageModule } from "primeng/message";
import { MultiSelectModule } from "primeng/multiselect";
import { PopoverModule } from "primeng/popover";
import { ProgressBarModule } from "primeng/progressbar";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { SkeletonModule } from "primeng/skeleton";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { ToolbarModule } from "primeng/toolbar";
import { TooltipModule } from "primeng/tooltip";

import { addIcons } from "ionicons";
import {
  addOutline,
  checkmarkDoneOutline,
  chevronForwardOutline,
  closeOutline,
  cloudUploadOutline,
  documentTextOutline,
  downloadOutline,
  ellipsisVertical,
  flashOutline,
  homeOutline,
  leafOutline,
  mailOutline,
  notificationsOutline,
  pencilOutline,
  saveOutline,
  searchOutline,
  trashOutline,
  waterOutline,
} from "ionicons/icons";

// Custom buttons — unified, auto-detect platform (PrimeNG web / Ionic mobile)
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";

// --- Custom Components - Inputs Web ---

// --- Custom Components - Others ---
import { ActionIconsGroupComponent } from "src/app/core/components/action-icons-group/action-icons-group.component";
import { EStatus } from "src/app/core/components/status-badge/status-badge";

import { resolveIconifyIcon } from "src/app/core/utils/prime-icon-resolver";
import { CatalogCharts } from "./pages/catalog-charts";
import { CatalogLayouts } from "./pages/catalog-layouts/catalog-layouts";
import { CatalogMobile } from "./pages/catalog-mobile";
import { CatalogWeb } from "./pages/catalog-web";
import { CommonCoreCoverage } from "./shared/common-core-coverage";
import { TokensColors } from "./shared/tokens-colors/tokens-colors";
import { TokensTypography } from "./shared/tokens-typography/tokens-typography";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface TipoDocumento {
  tipo: string;
  codigo: string;
  destinatario: string;
  confidencialidad: string;
  colorToken: string;
  severity: TagSeverity;
}

interface AccesoRol {
  documento: string;
  superUsuario: string;
  direccion: string;
  staff: string;
  condomino: string;
  proveedor: string;
}

interface ItemChecklist {
  numero: number;
  descripcion: string;
  aprobado: boolean;
}

interface NomenclaturaCampo {
  campo: string;
  valores: string;
}

interface BloqueVisual {
  titulo: string;
  icono: string;
  descripcion: string;
}

/**
 * CatalogComponentUi — Design System & Component Catalog
 *
 * Funciona como admin template de referencia. Exhibe design tokens,
 * componentes PrimeNG (web), Ionic (mobile), charts, patrones UX,
 * estándar documental y guía ERP en un layout de sidebar + contenido.
 *
 * @usageNotes
 * ```html
 * <app-catalog-component-ui />
 * ```
 * Ruteado en /settings/ui-catalog y /system/ui-catalog.
 */
@Component({
  selector: "app-catalog-component-ui",

  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    RadioButtonModule,
    SelectModule,
    MultiSelectModule,
    DatePickerModule,
    ToggleSwitchModule,
    SelectButtonModule,
    FloatLabelModule,
    IconFieldModule,
    InputIconModule,
    ProgressBarModule,
    TableModule,
    TabsModule,
    AccordionModule,
    CardModule,
    DividerModule,
    TagModule,
    TooltipModule,
    MessageModule,
    ToastModule,
    PopoverModule,
    DialogModule,
    ProgressSpinnerModule,
    SkeletonModule,
    ToolbarModule,
    // Custom Buttons
    CustomButtonDelete,
    CustomButtonEdit,
    // Custom Others
    StatusBadge,
    Loader,
    ActionMenu,
    AppIcon,
    PrimeNgCustomCaption,
    ActionIconsGroupComponent,
    // Coverage & Tokens
    CommonCoreCoverage,
    TokensColors,
    TokensTypography,
    CatalogCharts,
    CatalogLayouts,
    CatalogMobile,
    CatalogWeb,
  ],
  templateUrl: "./catalog-component-ui.html",
  styleUrls: ["./catalog-component-ui.scss"],
  encapsulation: ViewEncapsulation.None,
})
/**
 * Componente principal del catálogo de diseño.
 * Organiza la navegación por categorías mediante sidebar,
 * con preview mobile y toggle de tema oscuro.
 */
export class CatalogComponentUi implements OnInit {
  // --- Signals ---
  /** Categoría activa en el sidebar */
  activeCategory = signal<string>("tokens");
  /** Término de búsqueda local */
  searchTerm = signal<string>("");
  /** Tema oscuro activo */
  isDarkMode = signal<boolean>(
    document.documentElement.classList.contains("theme-dark"),
  );
  /** Vista previa móvil activa */
  mobilePreview = signal<boolean>(false);
  /** Sidebar colapsado en desktop */
  sidebarCollapsed = signal<boolean>(false);
  /** Sidebar abierto en mobile */
  sidebarMobileOpen = signal<boolean>(false);

  readonly categories = [
    { id: "tokens", label: "Tokens & Identidad", icon: "mdi:palette" },
    { id: "web", label: "Web (PrimeNG)", icon: "mdi:desktop-mac" },
    { id: "mobile", label: "Mobile (Ionic)", icon: "mdi:cellphone" },
    { id: "charts", label: "Gráficos", icon: "mdi:chart-bar" },
    { id: "core", label: "Core Components", icon: "mdi:cube" },
    { id: "patterns", label: "Patrones UX", icon: "mdi:content-copy" },
    { id: "docs", label: "Estándar Documental", icon: "mdi:file-pdf-box" },
    { id: "audit", label: "Auditoría", icon: "mdi:checkbox-marked" },
    { id: "layouts", label: "Layouts", icon: "mdi:page-layout-body" },
    { id: "guia", label: "Guía ERP", icon: "mdi:book-open-page-variant" },
  ];

  EStatus = EStatus;

  confirmVisible = signal(false);

  readonly sampleNotifications: NotificationItem[] = [
    {
      id: "1",
      icon: "mdi:file-document",
      title: "Documento aprobado",
      description: "El documento PROC-ADMI-012 ha sido aprobado.",
      time: "Hace 5 min",
      read: false,
      severity: "success",
    },
    {
      id: "2",
      icon: "mdi:alert",
      title: "Mantenimiento programado",
      description: "Corte de energía eléctrica el 25/06.",
      time: "Hace 2 h",
      read: false,
      severity: "warn",
    },
    {
      id: "3",
      icon: "mdi:check-circle",
      title: "Reporte completado",
      description: "Reporte mensual de finanzas disponible.",
      time: "Hace 1 d",
      read: true,
      severity: "info",
    },
  ];

  readonly wizardSteps: WizardStep[] = [
    { value: 1, label: "Datos", icon: "mdi:file-document-outline" },
    { value: 2, label: "Revisión", icon: "mdi:eye-outline" },
    { value: 3, label: "Confirmar", icon: "mdi:check-circle-outline" },
  ];

  wizardActiveStep = signal(1);

  readonly tiposDocumento: TipoDocumento[] = [
    {
      tipo: "Procedimiento Operativo",
      codigo: "PROC",
      destinatario: "Staff / Contractor",
      confidencialidad: "Interno",
      colorToken: "var(--ds-primary)",
      severity: "info",
    },
    {
      tipo: "Manual Tecnico",
      codigo: "MANT",
      destinatario: "Staff especializado",
      confidencialidad: "Restringido",
      colorToken: "var(--ds-help, #7c3aed)",
      severity: "danger",
    },
    {
      tipo: "Instructivo Residentes",
      codigo: "INST",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-document-neutral)",
      severity: "success",
    },
    {
      tipo: "Protocolo de Emergencia",
      codigo: "PROT",
      destinatario: "Todos",
      confidencialidad: "Critico",
      colorToken: "var(--ds-warning)",
      severity: "warn",
    },
    {
      tipo: "Politica Corporativa",
      codigo: "POLI",
      destinatario: "Executive / Corporate",
      confidencialidad: "Confidencial",
      colorToken: "var(--ds-success)",
      severity: "danger",
    },
    {
      tipo: "Comunicado a Residentes",
      codigo: "COMU",
      destinatario: "Condomino",
      confidencialidad: "Publico",
      colorToken: "var(--ds-luxury-gold)",
      severity: "success",
    },
  ];

  readonly matrizAcceso: AccesoRol[] = [
    {
      documento: "Procedimiento Operativo",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Leer",
      condomino: "Sin acceso",
      proveedor: "Leer parcial",
    },
    {
      documento: "Manual Tecnico",
      superUsuario: "Editar",
      direccion: "Consultar",
      staff: "Leer",
      condomino: "Sin acceso",
      proveedor: "Si aplica",
    },
    {
      documento: "Instructivo Residentes",
      superUsuario: "Publicar",
      direccion: "Aprobar",
      staff: "Consultar",
      condomino: "Leer",
      proveedor: "Sin acceso",
    },
    {
      documento: "Protocolo Emergencia",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Leer",
      condomino: "Version simplificada",
      proveedor: "Leer",
    },
    {
      documento: "Politica Corporativa",
      superUsuario: "Editar",
      direccion: "Aprobar",
      staff: "Sin acceso",
      condomino: "Sin acceso",
      proveedor: "Sin acceso",
    },
  ];

  checklist = signal<ItemChecklist[]>([
    {
      numero: 1,
      descripcion: "El codigo sigue nomenclatura estandar TIPO-DEPTO-NNN.",
      aprobado: true,
    },
    {
      numero: 2,
      descripcion:
        "La portada incluye titulo, codigo, version, fecha, clasificacion y estado.",
      aprobado: true,
    },
    {
      numero: 3,
      descripcion:
        "Existe tabla de control de versiones con al menos una entrada.",
      aprobado: true,
    },
    {
      numero: 4,
      descripcion: "Todas las secciones obligatorias del tipo estan presentes.",
      aprobado: true,
    },
    {
      numero: 5,
      descripcion:
        "Los terminos del glosario base son usados consistentemente.",
      aprobado: false,
    },
    {
      numero: 6,
      descripcion: "No hay siglas sin definir en su primera aparicion.",
      aprobado: true,
    },
    {
      numero: 7,
      descripcion:
        "El nivel de confidencialidad esta marcado en encabezado o pie.",
      aprobado: true,
    },
    {
      numero: 8,
      descripcion:
        "La tipografia corresponde al estandar: Inter para UI, Hanken Grotesk para headings, JetBrains Mono para código.",
      aprobado: false,
    },
    {
      numero: 9,
      descripcion:
        "Los colores pertenecen a tokens DS y no a hexadecimales locales.",
      aprobado: true,
    },
    {
      numero: 10,
      descripcion: "El flujograma, si existe, usa notacion BPMN simplificada.",
      aprobado: true,
    },
    {
      numero: 11,
      descripcion:
        "La matriz RACI identifica al menos un responsable y un aprobador.",
      aprobado: true,
    },
    {
      numero: 12,
      descripcion: "El tono es apropiado para la audiencia objetivo.",
      aprobado: true,
    },
    {
      numero: 13,
      descripcion:
        "El documento fue revisado por supervisor antes de aprobacion.",
      aprobado: false,
    },
    {
      numero: 14,
      descripcion: "Los metadatos para repositorio digital estan completos.",
      aprobado: true,
    },
    {
      numero: 15,
      descripcion:
        "El documento cumple contraste WCAG 2.1 AA en version digital.",
      aprobado: true,
    },
  ]);

  readonly camposNomenclatura: NomenclaturaCampo[] = [
    { campo: "TIPO", valores: "PROC, MANT, INST, PROT, POLI, COMU" },
    {
      campo: "DEPTO",
      valores: "ADMI, LEGA, MANT, SIST, RRHH, CONT, OPER, SECU, LIMP, JARD",
    },
    {
      campo: "CODIGO",
      valores: "Numero secuencial de 3 digitos: 001, 002, 003",
    },
    {
      campo: "Version",
      valores: "v1.0 para publicacion inicial; v1.1 para ajuste menor",
    },
    { campo: "Fecha", valores: "AAAA-MM de publicacion o vigencia" },
    {
      campo: "ESTADO",
      valores: "BORRADOR, REVISION, APROBADO, VIGENTE, OBSOLETO",
    },
  ];

  readonly ejemploNomenclaturas = [
    "PROC-MANT-012_v2.1_2026-04_APROBADO.pdf",
    "INST-ADMI-005_v1.0_2026-04_VIGENTE.pdf",
    "POLI-LEGA-001_v1.0_2026-04_CONFIDENCIAL.pdf",
    "PROT-OPER-003_v3.0_2026-04_VIGENTE.pdf",
  ];

  readonly bloquesVisuales: BloqueVisual[] = [
    {
      titulo: "Advertencia",
      icono: "mdi:alert",
      descripcion:
        "Usar cuando el incumplimiento genera riesgo fisico, legal, economico u operativo.",
    },
    {
      titulo: "Nota",
      icono: "mdi:information",
      descripcion:
        "Informacion complementaria que aclara el procedimiento sin ser un paso obligatorio.",
    },
    {
      titulo: "Buena practica",
      icono: "mdi:check-circle",
      descripcion:
        "Recomendacion validada por el equipo para elevar calidad y consistencia.",
    },
  ];

  // --- Datos para Ejemplos Móviles ---
  readonly groupedDataExample = {
    "Hoy (23 Abr)": [
      {
        id: 1,
        title: "Revisión de Extintores",
        module: "Mantenimiento",
        status: "Pendiente",
      },
      {
        id: 2,
        title: "Corte de Caja Diario",
        module: "Finanzas",
        status: "Proceso",
      },
    ],
    "Mañana (24 Abr)": [
      {
        id: 3,
        title: "Junta de Comité",
        module: "Administración",
        status: "Urgente",
      },
    ],
  };

  readonly complexDataExample = [
    {
      id: 1,
      name: "Medidor Eléctrico A1",
      folio: "E-1002",
      consumption: "120 kWh",
      status: EStatus.Concluido,
      icon: "mdi:flash-outline",
      color: "success",
    },
    {
      id: 2,
      name: "Medidor Agua Central",
      folio: "W-2005",
      consumption: "45 m³",
      status: EStatus.Proceso,
      icon: "mdi:water-outline",
      color: "primary",
    },
  ];


  constructor(private readonly route: ActivatedRoute) {
    addIcons({
      addOutline,
      pencilOutline,
      trashOutline,
      saveOutline,
      downloadOutline,
      checkmarkDoneOutline,
      mailOutline,
      notificationsOutline,
      documentTextOutline,
      chevronForwardOutline,
      ellipsisVertical,
      searchOutline,
      closeOutline,
      cloudUploadOutline,
      flashOutline,
      waterOutline,
      leafOutline,
      homeOutline,
    });
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);

    // Mantenemos document.body para Angular/Ionic y agregamos documentElement por si ThemeService lo requiere.
    document.body.classList.toggle("theme-dark", newTheme);
    document.body.setAttribute("data-theme", newTheme ? "dark" : "light");

    document.documentElement.classList.toggle("theme-dark", newTheme);
    document.documentElement.setAttribute(
      "data-theme",
      newTheme ? "dark" : "light",
    );
  }

  // --- Computadas Estándar Documental ---
  puntajeChecklist = computed(
    () => this.checklist().filter((item) => item.aprobado).length,
  );

  puntajeAprobatorio = computed(() => this.puntajeChecklist() >= 12);

  toggleChecklistItem(numero: number) {
    this.checklist.update((items) =>
      items.map((item) =>
        item.numero === numero ? { ...item, aprobado: !item.aprobado } : item,
      ),
    );
  }

  getColorAcceso(valor: string): TagSeverity {
    if (valor === "Sin acceso") return "danger";
    if (valor === "Editar" || valor === "Publicar") return "success";
    if (valor === "Aprobar") return "info";
    if (
      valor === "Leer" ||
      valor === "Consultar" ||
      valor === "Leer parcial" ||
      valor === "Version simplificada"
    ) {
      return "secondary";
    }
    if (valor === "Si aplica") return "warn";
    return "warn";
  }

  /** Resuelve un icono MDI a su clase CSS válida */
  iconifyIcon(primeClass: string): string {
    return resolveIconifyIcon(primeClass, "mdi:cog");
  }

  getNomenclaturaEjemplo(doc: TipoDocumento): string {
    return `${doc.codigo}-DEPTO-001_v1.0_2026-04_VIGENTE.pdf`;
  }

  /** Alterna colapso del sidebar en desktop */
  toggleSidebar(): void {
    this.sidebarCollapsed.update((v) => !v);
  }

  /** Lee el fragment de la URL al iniciar y navega a la sección */
  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        this.navigateTo(fragment);
      }
    });
  }

  /** Abre/cierra sidebar en mobile */
  toggleMobileSidebar(): void {
    this.sidebarMobileOpen.update((v) => !v);
  }

  /** Navega a una categoría y cierra sidebar mobile si el ancho es < 768px */
  navigateTo(categoryId: string): void {
    this.activeCategory.set(categoryId);
    if (window.innerWidth < 768) this.sidebarMobileOpen.set(false);
  }

  // ─── DATOS DE LOGIN DE REFERENCIA ────────────────────────────────────────

  /** Datos del formulario de login de referencia */
  loginForm = {
    email: "",
    password: "",
    remember: false,
  };

  /** Mensaje de estado del login demo */
  loginMessage = signal<string | null>(null);

  /** Simula un inicio de sesión de referencia */
  mockLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.loginMessage.set("Completa ambos campos para continuar.");
      return;
    }
    this.loginMessage.set(
      `Inicio de sesión exitoso (demo). Bienvenido, ${this.loginForm.email}`,
    );
  }

  // ─── GUÍA ERP (migrado desde demo-app) ───────────────────────────────────

  // Form state
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

  invoiceLines = [
    {
      id: "1",
      concept: "Mantenimiento Elevadores",
      quantity: 1,
      price: 15000,
      total: 15000,
    },
    {
      id: "2",
      concept: "Limpieza Areas Comunes",
      quantity: 5,
      price: 1200,
      total: 6000,
    },
  ];

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

  readonly identityPillars = [
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

  readonly colorAssessment = [
    {
      role: "Marca principal",
      current: "#0b3164 sobre blanco",
      verdict: "Consistente",
      recommendation:
        "Mantenerlo como azul corporativo. Tiene presencia ERP y buen contraste para botones.",
      severity: "success",
    },
    {
      role: "Sidebar y header",
      current: "#18181b",
      verdict: "Aceptable",
      recommendation:
        "Funciona como neutro premium. Migrar a #020811 para alinear con primary-950 si se quiere mas identidad.",
      severity: "info",
    },
    {
      role: "Acento Luxury",
      current: "#C9A84C",
      verdict: "Adoptado como soporte",
      recommendation:
        "Usarlo en documentos, reportes y detalles premium; no como primary ni estado operativo.",
      severity: "warn",
    },
    {
      role: "Warning",
      current: "#d97706 + #fef3c7",
      verdict: "Consistente",
      recommendation:
        "Ambar claro sobre fondo crema — claramente diferenciado del rojo peligro. Reservarlo para atencion, no para errores.",
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

  readonly businessScenarios = [
    {
      title: "Master-Detail (Complejidad)",
      description:
        "Gestion de formularios con lineas dinamicas y calculos en tiempo real.",
      rule: "Usar botones outlined para acciones secundarias y primary para el cierre del flujo.",
      icon: "mdi:format-list-checks",
    },
    {
      title: "Dashboard de Lujo (Identidad)",
      description:
        "Uso de Luxury Gold para jerarquizar KPIs financieros y resultados premium.",
      rule: "Maximo 5% de presencia dorada en pantalla para mantener la elegancia.",
      icon: "mdi:star",
    },
    {
      title: "Responsive Total (Omnichannel)",
      description:
        "Transicion automatica de tablas densas a vistas de tarjetas en dispositivos moviles.",
      rule: "Obligatorio implementar app-data-view-mobile en cada listado operativo.",
      icon: "mdi:cellphone",
    },
  ];

  readonly buttonRules = [
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

  readonly tableRows = [
    {
      folio: "ERP-2026-001",
      area: "Finanzas",
      responsible: "Direccion",
      dueDate: "22/04/2026",
      amount: 125000,
      status: "Aprobado" as const,
    },
    {
      folio: "ERP-2026-002",
      area: "Operaciones",
      responsible: "Gerencia",
      dueDate: "25/04/2026",
      amount: 48000,
      status: "Revision" as const,
    },
    {
      folio: "ERP-2026-003",
      area: "Mantenimiento",
      responsible: "Supervisor",
      dueDate: "28/04/2026",
      amount: 7600,
      status: "Pendiente" as const,
    },
    {
      folio: "ERP-2026-004",
      area: "Compras",
      responsible: "Coordinacion",
      dueDate: "30/04/2026",
      amount: 23000,
      status: "Riesgo" as const,
    },
  ];

  readonly globalRules = [
    {
      title: "Bordes",
      description:
        "Controles interactivos usan 1px; cards y paneles mantienen borde sutil y radio moderado.",
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
    {
      title: "Sombras",
      description:
        "Usar sombra para jerarquia o hover, no como decoracion permanente excesiva.",
    },
  ];

  readonly spacingRules = [
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
      title: "Densidad",
      description:
        "Tablas pueden ser compactas; formularios deben conservar aire para reducir errores.",
    },
  ];

  readonly systemStates = [
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

  readonly componentCatalog = [
    {
      family: "Botones unificados",
      selector: "custom-button-*",
      source: "core/components/buttons/web",
      useCase:
        "Acciones estandarizadas. Auto-detectan plataforma: DS button en web, ion-item en mobile.",
      preferredFor:
        "CRUD, acciones por fila, guardar, editar, eliminar, descargar y confirmar.",
      avoidWhen: "Nunca — reemplazaron ios-button-* eliminados.",
      status: "Usar" as const,
    },
    {
      family: "Inputs unificados",
      selector: "custom-input-*-signal",
      source: "core/components/inputs/web",
      useCase:
        "CVA completo. Auto-detectan plataforma: PrimeNG en desktop, Ionic en mobile (<768px).",
      preferredFor: "Todos los formularios — web y mobile.",
      avoidWhen: "Nunca — reemplazaron ion-input-* eliminados.",
      status: "Usar" as const,
    },
    {
      family: "Mobile data",
      selector: "app-data-view-mobile",
      source: "core/components/data-view-mobile",
      useCase: "Listado mobile agrupado o plano con template proyectado.",
      preferredFor: "Reemplazar tablas densas en pantallas pequenas.",
      avoidWhen: "Comparacion tabular de muchas columnas en desktop.",
      status: "Mobile" as const,
    },
    {
      family: "Acciones contextuales",
      selector: "app-action-menu",
      source: "core/components/action-menu",
      useCase: "Menu de acciones por fila con PrimeNG Popover.",
      preferredFor:
        "Mas de dos acciones secundarias o acciones poco frecuentes.",
      avoidWhen:
        "Accion primaria visible que el usuario debe reconocer de inmediato.",
      status: "Usar" as const,
    },
    {
      family: "Tabla PrimeNG",
      selector: "primeng-custom-caption / footer",
      source: "core/components/primeng-custom-*",
      useCase: "Piezas auxiliares para tablas ERP consistentes.",
      preferredFor:
        "Listados con busqueda, caption institucional y pie de tabla.",
      avoidWhen: "Listados mobile donde convenga DataViewMobile.",
      status: "Usar" as const,
    },
    {
      family: "Estados y soporte",
      selector: "app-loader / app-status-badge",
      source: "core/components",
      useCase: "Feedback visual, errores globales y estados normalizados.",
      preferredFor: "Carga, estados de negocio y errores transversales.",
      avoidWhen: "Mensajes locales simples donde p-message sea suficiente.",
      status: "Usar" as const,
    },
    {
      family: "Documentos y reportes",
      selector: "app-pdf-viewer-* / report-header",
      source: "core/components",
      useCase: "Visualizacion PDF, cabeceras y titulos de reportes.",
      preferredFor: "Reportes, manuales, solicitudes y documentos formales.",
      avoidWhen: "Contenido operativo que no sera impreso/exportado.",
      status: "Especializado" as const,
    },
    {
      family: "Graficas",
      selector: "app-custom-bar-chart / app-pie-chart",
      source: "core/components/charts",
      useCase: "Visualizaciones ejecutivas reutilizables.",
      preferredFor: "Dashboards, comparativos y analisis de metricas.",
      avoidWhen: "Datos que requieren tabla para auditoria o exportacion.",
      status: "Especializado" as const,
    },
  ];

  getStatusSeverity(
    status: "Aprobado" | "Revision" | "Pendiente" | "Riesgo",
  ): TagSeverity {
    const map = {
      Aprobado: "success" as TagSeverity,
      Revision: "info" as TagSeverity,
      Pendiente: "warn" as TagSeverity,
      Riesgo: "danger" as TagSeverity,
    };
    return map[status];
  }

  getCatalogSeverity(
    status: "Usar" | "Web" | "Mobile" | "Especializado",
  ): TagSeverity {
    const map = {
      Usar: "success" as TagSeverity,
      Web: "info" as TagSeverity,
      Mobile: "warn" as TagSeverity,
      Especializado: "secondary" as TagSeverity,
    };
    return map[status];
  }

  openDialog(): void {
    this.dialogVisible = true;
  }
}
