import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnDestroy, signal, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

// --- PrimeNG Modules ---
import { AccordionModule } from "primeng/accordion";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { CheckboxModule } from "primeng/checkbox";
import { DatePickerModule } from "primeng/datepicker";
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
import { RadioButtonModule } from "primeng/radiobutton";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { SliderModule } from "primeng/slider";
import { TableModule } from "primeng/table";
import { TabsModule } from "primeng/tabs";
import { TagModule } from "primeng/tag";
import { TextareaModule } from "primeng/textarea";
import { ToastModule } from "primeng/toast";
import { ToggleButtonModule } from "primeng/togglebutton";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { TooltipModule } from "primeng/tooltip";

// --- Ionic Modules (Standalone) ---
import {
  IonAvatar,
  IonBadge,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonProgressBar,
  IonSpinner,
} from "@ionic/angular/standalone";
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

// --- Custom Components - Buttons Web ---
import {
  CustomButtonAdd,
  CustomButtonConfirm,
  CustomButtonDelete,
  CustomButtonDownload,
  CustomButtonEdit,
  CustomButtonSave,
  CustomButtonViewPdf,
} from "src/app/core/components/buttons/web";

// --- Custom Components - Buttons Mobile ---
import {
  IonButtonAdd,
  IonButtonDelete,
  IonButtonEdit,
  IonButtonSave,
} from "src/app/core/components/buttons/mobile";

// --- Custom Components - Inputs Web ---
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";

// --- Custom Components - Inputs Mobile ---
import {
  IonInputNumber,
  IonInputSelect,
  IonInputText,
  IonInputToggle,
} from "src/app/core/components/inputs/mobile";

// --- Custom Components - Others ---
import { ActionIconsGroupComponent } from "src/app/core/components/action-icons-group/action-icons-group.component";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import {
  EStatus,
  StatusBadge,
} from "src/app/core/components/status-badge/status-badge";

// --- Custom Charts ---
import { CustomBarChart } from "src/app/core/components/charts/custom-bar-chart";
import { PieChart } from "src/app/core/components/charts/pie-chart";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { resolveIconifyIcon } from "src/app/core/utils/prime-icon-resolver";

type TagSeverity =
  | "success"
  | "info"
  | "warn"
  | "danger"
  | "secondary"
  | "contrast";

interface PaletaColor {
  nombre: string;
  rol: string;
  token: string;
  uso: string;
}

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

@Component({
  selector: "app-catalog-component-ui",

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    SliderModule,
    ToggleSwitchModule,
    ToggleButtonModule,
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
    IonIcon,
    IonList,
    IonBadge,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonSpinner,
    IonAvatar,
    IonChip,
    // Custom Buttons Web
    CustomButtonAdd,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonSave,
    CustomButtonDownload,
    CustomButtonConfirm,
    CustomButtonViewPdf,
    // Custom Buttons Mobile
    IonButtonAdd,
    IonButtonEdit,
    IonButtonDelete,
    IonButtonSave,
    // Custom Inputs Web
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputSwitch,
    // Custom Inputs Mobile
    IonInputText,
    IonInputNumber,
    IonInputSelect,
    IonInputToggle,
    // Custom Others
    StatusBadge,
    PrimeNgCustomCaption,
    ActionIconsGroupComponent,
    ActionMenu,
    // Charts
    CustomBarChart,
    PieChart,
    AppIcon,
  ],
  templateUrl: "./catalog-component-ui.html",
  styleUrls: ["./catalog-component-ui.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class CatalogComponentUi implements OnDestroy {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  // --- Forms ---
  webForm: FormGroup = this.fb.group({
    nombre: [""],
    edad: [null],
    categoria: [null],
    fecha: [null],
    activo: [true],
  });

  mobileForm: FormGroup = this.fb.group({
    nombre: [""],
    edad: [null],
    categoria: [null],
    fecha: [null],
    activo: [true],
  });

  // --- Signals ---
  activeCategory = signal<string>("tokens");
  searchTerm = signal<string>("");
  isDarkMode = signal<boolean>(document.documentElement.classList.contains("theme-dark"));
  mobilePreview = signal<boolean>(false);

  // --- Constants ---
  readonly categories = [
    { id: "tokens", label: "Tokens & Identidad", icon: "mdi:palette" },
    { id: "web", label: "Web (PrimeNG)", icon: "mdi:desktop-mac" },
    { id: "mobile", label: "Mobile (Ionic)", icon: "mdi:cellphone" },
    { id: "charts", label: "Gráficos", icon: "mdi:chart-bar" },
    { id: "patterns", label: "Patrones UX", icon: "mdi:content-copy" },
    { id: "docs", label: "Estándar Documental", icon: "mdi:file-pdf-box" },
    { id: "audit", label: "Auditoría", icon: "mdi:checkbox-marked" },
  ];

  EStatus = EStatus;

  readonly options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];

  // --- Paleta de UI y Documental ---
  readonly paleta: PaletaColor[] = [
    {
      nombre: "Primary",
      rol: "Acción principal",
      token: "--ds-primary",
      uso: "Botones principales, foco, navegación activa y encabezados.",
    },
    {
      nombre: "Success",
      rol: "Estado de éxito",
      token: "--ds-success",
      uso: "Mensajes de éxito, insignias de aprobado.",
    },
    {
      nombre: "Danger",
      rol: "Estado de error",
      token: "--ds-danger",
      uso: "Acciones destructivas, errores y alertas graves.",
    },
    {
      nombre: "Warning",
      rol: "Estado de advertencia",
      token: "--ds-warning",
      uso: "Avisos, pendientes o estados precautorios.",
    },
    {
      nombre: "Info",
      rol: "Información",
      token: "--ds-info",
      uso: "Notificaciones y estados informativos.",
    },
    {
      nombre: "Surface Base",
      rol: "Superficie general",
      token: "--ds-bg-surface",
      uso: "Fondos de tarjetas, modales y contenedores.",
    },
    {
      nombre: "Document Gold",
      rol: "Acento premium documental",
      token: "--ds-luxury-gold",
      uso: "Portadas, separadores, reportes formales y detalles institucionales.",
    },
    {
      nombre: "Document Neutral",
      rol: "Texto secundario documental",
      token: "--ds-document-neutral",
      uso: "Metadatos, versión, responsable, fecha y notas de soporte.",
    },
    {
      nombre: "Document Muted",
      rol: "Superficie suave documental",
      token: "--ds-document-bg-muted",
      uso: "Bandas de portada, bloques de metadatos y fondo de muestras.",
    },
    {
      nombre: "Document Ink",
      rol: "Texto formal documental",
      token: "--ds-document-ink",
      uso: "Contenido principal en documentos y muestras imprimibles.",
    },
  ];

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
        "La tipografia corresponde al estandar: DM Sans para UI, familia documental segun aplique en exportación.",
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

  readonly estilosTipografia = [
    {
      elemento: "UI ERP",
      familia: "DM Sans / Inter",
      tamano: "13-32px",
      uso: "Pantallas Angular, PrimeNG, Ionic y operaciones diarias.",
    },
    {
      elemento: "Titulo de documento",
      familia: "DM Sans / Montserrat",
      tamano: "24-28pt",
      uso: "Portadas y encabezados de documentos exportables.",
    },
    {
      elemento: "Cuerpo documental",
      familia: "DM Sans / Inter",
      tamano: "10-11pt",
      uso: "Contenido extenso imprimible o PDF corporativo.",
    },
    {
      elemento: "Codigo y nomenclatura",
      familia: "Roboto Mono / Consolas",
      tamano: "9-10pt",
      uso: "Folios, codigos, versiones y nombres de archivo.",
    },
  ];

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

  // --- Datos para Gráficos ---
  readonly barChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Consumo Eléctrico",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#0b3164",
      },
    ],
  };

  readonly pieChartData = {
    labels: ["Completado", "En Proceso", "Pendiente"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#065f46", "#c9a84c", "#991b1b"],
      },
    ],
  };

  constructor() {
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
    document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
  }

  async copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      this.messageService.add({
        severity: "success",
        summary: "Copiado",
        detail: text,
        life: 1500,
      });
    } catch {
      this.messageService.add({
        severity: "error",
        summary: "Error al copiar",
        detail: "No se pudo copiar al portapapeles",
        life: 3000,
      });
    }
  }

  // --- Computadas Estándar Documental ---
  puntajeChecklist = computed(() =>
    this.checklist().filter((item) => item.aprobado).length
  );

  puntajeAprobatorio = computed(() => this.puntajeChecklist() >= 12);

  toggleChecklistItem(numero: number) {
    this.checklist.update(items =>
      items.map(item =>
        item.numero === numero ? { ...item, aprobado: !item.aprobado } : item
      )
    );
  }

  getColorAcceso(valor: string): TagSeverity {
    if (valor === "Sin acceso") return "danger";
    if (valor === "Editar" || valor === "Publicar") return "success";
    if (valor === "Aprobar") return "info";
    if (valor === "Leer" || valor === "Consultar" || valor === "Leer parcial" || valor === "Version simplificada") {
      return "secondary";
    }
    if (valor === "Si aplica") return "warn";
    return "warn";
  }

  iconifyIcon(primeClass: string): string {
    return resolveIconifyIcon(primeClass, "mdi:cog");
  }

  getNomenclaturaEjemplo(doc: TipoDocumento): string {
    return `${doc.codigo}-DEPTO-001_v1.0_2026-04_VIGENTE.pdf`;
  }

  ngOnDestroy() {
    // Cleanup if needed
  }
}
