import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnDestroy, signal, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";

import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { SelectModule } from "primeng/select";
import { SelectButtonModule } from "primeng/selectbutton";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { ToastModule } from "primeng/toast";
import { TabsModule } from "primeng/tabs";
import { CheckboxModule } from "primeng/checkbox";
import { CardModule } from "primeng/card";
import { TableModule } from "primeng/table";

import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { resolveIconifyIcon } from "src/app/core/utils/prime-icon-resolver";

// --- Page Components ---
import { CatalogWeb } from "./pages/catalog-web";
import { CatalogMobile } from "./pages/catalog-mobile";
import { CatalogDocuments } from "./pages/catalog-documents";
import { CatalogCharts } from "./pages/catalog-charts";

// --- Shared Components ---
import { TokensColors } from "./shared/tokens-colors/tokens-colors";
import { TokensTypography } from "./shared/tokens-typography/tokens-typography";
import { PatternsKpi } from "./shared/patterns-kpi/patterns-kpi";
import { WebIcons } from "./pages/catalog-web/components/web-icons/web-icons";

interface ItemChecklist {
  numero: number;
  descripcion: string;
  aprobado: boolean;
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
    SelectModule,
    SelectButtonModule,
    DividerModule,
    TagModule,
    TooltipModule,
    ToastModule,
    TabsModule,
    CheckboxModule,
    CardModule,
    TableModule,
    // Shared
    AppIcon,
    TokensColors,
    TokensTypography,
    PatternsKpi,
    WebIcons,
    // Pages
    CatalogWeb,
    CatalogMobile,
    CatalogDocuments,
    CatalogCharts,
  ],
  templateUrl: "./catalog-component-ui.html",
  styleUrls: ["./catalog-component-ui.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class CatalogComponentUi implements OnDestroy {
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  // --- Forms compartidos ---
  filterForm: FormGroup = this.fb.group({
    fechaRango: [null],
    depto: [null],
    estado: [null],
  });

  readonly deptoOptions = [
    { label: "Mantenimiento", value: "MANT" },
    { label: "Finanzas", value: "FIN" },
    { label: "Administración", value: "ADM" },
  ];

  readonly statusOptions = [
    { label: "Pendiente", value: 1 },
    { label: "Proceso", value: 2 },
    { label: "Concluido", value: 3 },
  ];

  // --- Signals ---
  activeCategory = signal<string>("tokens");
  isDarkMode = signal<boolean>(document.documentElement.classList.contains("theme-dark"));
  mobilePreview = signal<boolean>(false);
  tableData = signal<any[]>([{ id: 1, name: "Pattern Test", status: 2 }]);

  readonly categories = [
    { id: "tokens", label: "Tokens & Identidad", icon: "mdi:palette" },
    { id: "web", label: "Web (PrimeNG)", icon: "mdi:desktop-mac" },
    { id: "mobile", label: "Mobile (Ionic)", icon: "mdi:cellphone" },
    { id: "icons", label: "Catálogo de Iconos", icon: "mdi:emoticon-outline" },
    { id: "charts", label: "Gráficos", icon: "mdi:chart-bar" },
    { id: "patterns", label: "Patrones UX", icon: "mdi:content-copy" },
    { id: "docs", label: "Estándar Documental", icon: "mdi:file-pdf-box" },
    { id: "audit", label: "Auditoría", icon: "mdi:checkbox-marked" },
  ];

  // --- Audit section data ---
  checklist = signal<ItemChecklist[]>([
    { numero: 1, descripcion: "El codigo sigue nomenclatura estandar TIPO-DEPTO-NNN.", aprobado: true },
    { numero: 2, descripcion: "La portada incluye titulo, codigo, version, fecha, clasificacion y estado.", aprobado: true },
    { numero: 3, descripcion: "Existe tabla de control de versiones con al menos una entrada.", aprobado: true },
    { numero: 4, descripcion: "Todas las secciones obligatorias del tipo estan presentes.", aprobado: true },
    { numero: 5, descripcion: "Los terminos del glosario base son usados consistentemente.", aprobado: false },
    { numero: 6, descripcion: "No hay siglas sin definir en su primera aparicion.", aprobado: true },
    { numero: 7, descripcion: "El nivel de confidencialidad esta marcado en encabezado o pie.", aprobado: true },
    { numero: 8, descripcion: "La tipografia corresponde al estandar: DM Sans para UI, familia documental segun aplique en exportación.", aprobado: false },
    { numero: 9, descripcion: "Los colores pertenecen a tokens DS y no a hexadecimales locales.", aprobado: true },
    { numero: 10, descripcion: "El flujograma, si existe, usa notacion BPMN simplificada.", aprobado: true },
    { numero: 11, descripcion: "La matriz RACI identifica al menos un responsable y un aprobador.", aprobado: true },
    { numero: 12, descripcion: "El tono es apropiado para la audiencia objetivo.", aprobado: true },
    { numero: 13, descripcion: "El documento fue revisado por supervisor antes de aprobacion.", aprobado: false },
    { numero: 14, descripcion: "Los metadatos para repositorio digital estan completos.", aprobado: true },
    { numero: 15, descripcion: "El documento cumple contraste WCAG 2.1 AA en version digital.", aprobado: true },
  ]);

  readonly bloquesVisuales: BloqueVisual[] = [
    { titulo: "Advertencia", icono: "mdi:alert", descripcion: "Usar cuando el incumplimiento genera riesgo fisico, legal, economico u operativo." },
    { titulo: "Nota", icono: "mdi:information", descripcion: "Informacion complementaria que aclara el procedimiento sin ser un paso obligatorio." },
    { titulo: "Buena practica", icono: "mdi:check-circle", descripcion: "Recomendacion validada por el equipo para elevar calidad y consistencia." },
  ];

  puntajeChecklist = computed(() =>
    this.checklist().filter((item) => item.aprobado).length
  );

  puntajeAprobatorio = computed(() => this.puntajeChecklist() >= 12);

  constructor() {
    const theme = this.isDarkMode();
    document.body.classList.toggle("theme-dark", theme);
    document.body.setAttribute("data-theme", theme ? "dark" : "light");
  }

  toggleTheme() {
    const newTheme = !this.isDarkMode();
    this.isDarkMode.set(newTheme);
    document.body.classList.toggle("theme-dark", newTheme);
    document.body.setAttribute("data-theme", newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("theme-dark", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme ? "dark" : "light");
  }

  toggleChecklistItem(numero: number) {
    this.checklist.update(items =>
      items.map(item =>
        item.numero === numero ? { ...item, aprobado: !item.aprobado } : item
      )
    );
  }

  iconifyIcon(primeClass: string): string {
    return resolveIconifyIcon(primeClass, "mdi:cog");
  }

  ngOnDestroy() {}
}
