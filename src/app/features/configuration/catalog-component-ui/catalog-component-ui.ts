import { CommonModule } from "@angular/common";
import { Component, inject, signal, ViewEncapsulation } from "@angular/core";
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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemDivider,
  IonLabel,
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
  IonInputSearch,
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
    IonItem,
    IonLabel,
    IonBadge,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItemDivider,
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
    IonInputSearch,
    // Custom Others
    StatusBadge,
    PrimeNgCustomCaption,
    ActionIconsGroupComponent,
    ActionMenu,
    // Charts
    CustomBarChart,
    PieChart,
  ],
  templateUrl: "./catalog-component-ui.html",
  styleUrls: ["./catalog-component-ui.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [MessageService],
})
export class CatalogComponentUi {
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
  isDarkMode = signal<boolean>(document.body.classList.contains("theme-dark"));
  mobilePreview = signal<boolean>(false);

  // --- Constants ---
  categories = [
    { id: "tokens", label: "Tokens", icon: "pi pi-palette" },
    { id: "web", label: "Web (PrimeNG)", icon: "pi pi-desktop" },
    { id: "mobile", label: "Mobile (Ionic)", icon: "pi pi-mobile" },
    { id: "charts", label: "Gráficos", icon: "pi pi-chart-bar" },
    { id: "patterns", label: "Patrones UX", icon: "pi pi-clone" },
  ];

  EStatus = EStatus;

  options = [
    { label: "Opción 1", value: 1 },
    { label: "Opción 2", value: 2 },
    { label: "Opción 3", value: 3 },
  ];

  // --- Datos para Ejemplos Móviles ---
  groupedDataExample = {
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

  complexDataExample = [
    {
      id: 1,
      name: "Medidor Eléctrico A1",
      folio: "E-1002",
      consumption: "120 kWh",
      status: EStatus.Concluido,
      icon: "flash-outline",
      color: "success",
    },
    {
      id: 2,
      name: "Medidor Agua Central",
      folio: "W-2005",
      consumption: "45 m³",
      status: EStatus.Proceso,
      icon: "water-outline",
      color: "primary",
    },
  ];

  // --- Datos para Gráficos ---
  barChartData = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Consumo Eléctrico",
        data: [65, 59, 80, 81, 56],
        backgroundColor: "#0b3164",
      },
    ],
  };

  pieChartData = {
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
    document.body.classList.toggle("theme-dark", newTheme);
    document.body.setAttribute("data-theme", newTheme ? "dark" : "light");
  }

  copy(text: string) {
    navigator.clipboard.writeText(text);
    this.messageService.add({
      severity: "success",
      summary: "Copiado",
      detail: text,
      life: 1500,
    });
  }
}
