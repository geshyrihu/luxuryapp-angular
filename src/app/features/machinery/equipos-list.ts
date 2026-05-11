import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import {
  IonAvatar,
  IonButton,
  IonChip,
  IonIcon,
  IonItem,
  IonLabel,
} from "@ionic/angular/standalone";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import {
  addCircleOutline,
  clipboardOutline,
  constructOutline,
  copyOutline,
  createOutline,
  documentTextOutline,
  readerOutline,
  timeOutline,
  trashOutline,
} from "ionicons/icons";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { CardModule } from "primeng/card";
import { Dialog } from "primeng/dialog";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomBtnActiveDesactive } from "src/app/core/components/buttons/web/custom-button-active-desactive";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { CurrencyMexicoPipe } from "src/app/core/pipes/currencyMexico.pipe";
import { SanitizeHtmlPipe } from "src/app/core/pipes/sanitize-html.pipe";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { MantenimientoPreventivoForm } from "src/app/features/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
import { ActivosForm } from "src/app/features/machinery-asset/activos-form";
import { ActivosDocumentos } from "src/app/features/machinery-document/activos-documentos";
import { FichaTecnicaActivo } from "src/app/features/machinery/ficha-tecnica-activo";
import { ServiceHistoryMachinery } from "src/app/features/machinery/service-history-machinery";
import { BitacoraIndividual } from "src/app/features/maintenance-log/bitacora-individual";
// ... el resto de las importaciones de componentes y módulos ...
// ...

// Interfaz para seguridad de tipos
interface Equipo {
  id: any;
  maintenanceCalendars: number;
  nameMachinery: string;
  equipoClasificacion: string;
  photoPath: string;
  ubication: string;
  // ? New Technical Fields (optional in case they are missing)
  brand?: string;
  model?: string;
  serie?: string;
  technicalSpecifications?: string;
  base64Image?: string | null; // For PDF generation
  maintenanceCalendar: {
    id: any;
    machineryId: any;
    activity: string;
    month: string;
    anio: number;
    price: number;
    recurrence: string;
    nameProvider: string;
  }[];
  // ? Propiedad requerida por PrimeNG para row expansion
  expanded?: boolean;
}

@Component({
  selector: "app-equipos-list",
  templateUrl: "./equipos-list.html",
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ImageModule,
    TooltipModule,
    NgbTooltipModule,
    CustomButton,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    CustomBtnActiveDesactive,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    SanitizeHtmlPipe,
    CurrencyMexicoPipe,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonAvatar,
    IonButton,
    IonIcon,
    IonChip,
    Dialog,
    Tag,
  ],
})
export class EquiposList {
  public authS = inject(AuthService);
  public aspRoleS = inject(AspRoleService);
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);
  private pdfGeneratorS = inject(PdfGeneratorService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---
  data = signal<any[]>([]);
  loading = signal(true);
  stateFilter = signal<number>(0);
  selectedEquipo = signal<Equipo | null>(null);
  mantenimientosVisible = signal(false);
  public AspRole = EApplicationRole;

  // óCAMBIO CLAVE! La categoróa ahora es un signal interno.
  inventoryCategoryId = signal<number>(1);

  categories = [
    { id: 1, name: "Equipos Electromecanicos", emoji: "pi pi-cog" },
    { id: 2, name: "Amenidades", emoji: "pi pi-star" },
    { id: 3, name: "Mobiliario", emoji: "pi pi-table" },
    { id: 4, name: "Equipamiento", emoji: "pi pi-wrench" },
    { id: 5, name: "Equipos de Gimnasio", emoji: "pi pi-heart" },
    { id: 6, name: "Equipos de Sistemas", emoji: "pi pi-desktop" },
    { id: 8, name: "Areas Comunes", emoji: "pi pi-map-marker" },
    { id: 7, name: "Bodegas, Cuartos de Maquinas", emoji: "pi pi-box" },
  ];

  // --- ESTADO DERIVADO CON `computed` ---
  title = computed(() => {
    const categoryId = this.inventoryCategoryId();

    // Manejo de valores undefined/0
    if (!categoryId || categoryId === 0) {
      return "Equipos"; // Título por defecto
    }

    switch (categoryId) {
      case 1:
        return "Equipos Electromecanicos";
      case 2:
        return "Amenidades";
      case 3:
        return "Mobiliario";
      case 4:
        return "Equipamiento";
      case 5:
        return "Equipos de Gimnasio";
      case 6:
        return "Equipos de Sistemas";
      case 8:
        return "Areas Comunes";
      case 7:
        return "Bodegas, Cuartos de Maquinas";
      default:
        return "Equipos";
    }
  });

  subTitle = computed(() =>
    this.stateFilter() === 0 ? "Activos" : "Inactivos",
  );

  mostrarPreventivos = computed(() => {
    const category = this.inventoryCategoryId();
    return category !== 3 && category !== 4;
  });

  globalFilterFields = computed(() => globalFilterFields(this.data()));

  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;

  constructor() {
    addIcons({
      createOutline,
      trashOutline,
      documentTextOutline,
      timeOutline,
      readerOutline,
      clipboardOutline,
      constructOutline,
      addCircleOutline,
      copyOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      const categoryId = this.inventoryCategoryId();
      const state = this.stateFilter();

      // Validación mós estricta para evitar llamadas con valores invólidos
      if (customerId && categoryId && categoryId > 0) {
        this.onLoadData(customerId, categoryId, state);
      }
    });
  }

  // --- CARGA DE DATOS (Refactorizado) ---
  async onLoadData(customerId: string, categoryId: any, state: number) {
    this.loading.set(true);
    const urlApi = `Machineries/list/${customerId}/${categoryId}/${state}`;
    try {
      const result = await this.apiResponseS.onGetList<Equipo[]>(urlApi);
      console.log(result);
      this.data.set(result);
    } catch (error) {
      console.error("Error al cargar la lista de equipos:", error);
      this.data.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  // Helper to convert Blob to Base64
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  async onDownloadPdf() {
    const data = this.data();
    if (!data || data.length === 0) return;
    this.loading.set(true); // Show loading indicator while processing images

    try {
      // 1. Fetch images for each item
      const dataWithImages = await Promise.all(
        data.map(async (item) => {
          let base64Image = null;
          if (item.photoPath) {
            try {
              const blob = await this.apiResponseS.getBlobFileFromFullUrl(
                item.photoPath,
              );
              if (
                blob &&
                (blob.type.includes("jpeg") ||
                  blob.type.includes("png") ||
                  blob.type.includes("jpg"))
              ) {
                const base64 = await this.blobToBase64(blob);
                if (base64.startsWith("data:image")) {
                  base64Image = base64;
                }
              }
            } catch (e) {
              console.error(
                "Error loading image for PDF",
                item.nameMachinery,
                e,
              );
            }
          }
          return { ...item, base64Image };
        }),
      );
      // Sort by system (equipoClasificacion)
      const sortedData = [...dataWithImages].sort((a, b) =>
        (a.equipoClasificacion || "").localeCompare(
          b.equipoClasificacion || "",
        ),
      );

      // Group by system
      const groups = sortedData.reduce(
        (acc, item) => {
          const system = item.equipoClasificacion || "SIN CLASIFICACIóN";
          if (!acc[system]) acc[system] = [];
          acc[system].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      const content: any[] = [
        {
          text: `INVENTARIO DE ${this.title().toUpperCase()}`,
          style: "header",
          margin: [0, 0, 0, 10],
        },
        {
          text: `Estado: ${this.subTitle()}`,
          style: "infoSubText",
          margin: [0, 0, 0, 20],
        },
      ];

      for (const system in groups) {
        content.push({
          text: system,
          style: "subheader",
          margin: [0, 10, 0, 5],
        });

        const tableBody = groups[system].map((item) => {
          return [
            // Column 1: Image
            {
              stack: item.base64Image
                ? [
                    {
                      image: item.base64Image,
                      fit: [100, 100],
                      alignment: "center",
                    },
                  ]
                : [
                    {
                      text: "Sin Imagen",
                      fontSize: 8,
                      color: "#999",
                      alignment: "center",
                      margin: [0, 20, 0, 0],
                    },
                  ],
              border: [false, false, false, true],
              margin: [0, 5, 0, 5],
            },
            // Column 2: Technical/Location Data
            {
              stack: [
                {
                  text: item.nameMachinery || "Sin Nombre",
                  style: "tableHeader",
                  fontSize: 11,
                  margin: [0, 0, 0, 2],
                },
                {
                  text: [
                    { text: "Ubicación: ", bold: true, fontSize: 10 },
                    { text: item.ubication || "N/A", fontSize: 10 },
                  ],
                  margin: [0, 0, 0, 2],
                },
                {
                  columns: [
                    {
                      width: "auto",
                      text: [
                        { text: "Marca: ", bold: true, fontSize: 9 },
                        { text: item.brand || "N/A", fontSize: 9 },
                      ],
                    },
                    { width: 10, text: "" },
                    {
                      width: "auto",
                      text: [
                        { text: "Modelo: ", bold: true, fontSize: 9 },
                        { text: item.model || "N/A", fontSize: 9 },
                      ],
                    },
                    { width: 10, text: "" },
                    {
                      width: "auto",
                      text: [
                        { text: "Serie: ", bold: true, fontSize: 9 },
                        { text: item.serie || "N/A", fontSize: 9 },
                      ],
                    },
                  ],
                  margin: [0, 0, 0, 2],
                },
              ],
              border: [false, false, false, true],
              margin: [5, 5, 0, 5],
            },
          ];
        });

        content.push({
          table: {
            widths: [110, "*"], // Fixed width for image column, rest for info
            headerRows: 0,
            body: tableBody,
          },
          layout: {
            hLineWidth: (i: number, node: any) => 1, // Draw only bottom border defined in cells
            vLineWidth: () => 0,
            hLineColor: () => "#EEEEEE",
          },
          margin: [0, 0, 0, 15],
        });
      }

      const docDefinition: TDocumentDefinitions = {
        content: content,
        styles: {
          header: { fontSize: 18, bold: true, color: "#003A62" },
          subheader: {
            fontSize: 14,
            bold: true,
            color: "#003A62",
            fillColor: "#eef2f7",
          },
          tableHeader: { bold: true, fontSize: 10, color: "#333333" },
          tableCell: { fontSize: 9, margin: [2, 4, 2, 4] },
        },
      };

      this.pdfGeneratorS.generatePdf(
        docDefinition,
        `Inventario_${this.title().replace(/\s+/g, "_")}`,
        { clientName: "Inventario de Activos" },
      );
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      this.loading.set(false);
    }
  }

  // --- MANEJADORES DE EVENTOS (Refactorizados) ---
  onSelectState(value: number): void {
    // óCAMBIO! Solo actualizamos el signal. El `effect` se encarga del resto.
    this.stateFilter.set(value);
  }

  onSelectCategory(categoryId: any): void {
    this.inventoryCategoryId.set(categoryId);
  }

  async onDelete(id: any) {
    await this.apiResponseS.onDelete(`Machineries/${id}`);
    // Forzamos la recarga para asegurar consistencia con la BD.
    this.onLoadData(
      this.customerIdS.customerId(),
      this.inventoryCategoryId()!,
      this.stateFilter(),
    );
  }

  // --- MóTODOS DE MODALES (Lógica de recarga actualizada) ---
  // Actualizamos las llamadas a onLoadData para que usen los valores actuales de los signals.
  private reloadDataAfterDialog(result: any) {
    if (result) {
      this.onLoadData(
        this.customerIdS.customerId(),
        this.inventoryCategoryId()!,
        this.stateFilter(),
      );
    }
  }

  showModalFichatecnica(data: any) {
    this.dialogHandlerS
      .openDialog(
        FichaTecnicaActivo,
        data,
        "Ficha Técnica",
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => this.reloadDataAfterDialog(result));
  }

  onModalAddOrEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        ActivosForm,
        {
          id: data.id,
          paramId: this.inventoryCategoryId(), // Ahora captura correctamente el parómetro categoróa
          inventoryCategory: data.inventoryCategory,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => this.reloadDataAfterDialog(result));
  }

  showModalMaintenanceCalendar(data: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.machineryId,
        },
        data.header,
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => this.reloadDataAfterDialog(result));
  }

  onBitacoraIndividual(machineryId: any) {
    this.dialogHandlerS.openDialog(
      BitacoraIndividual,
      {
        machineryId: machineryId,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }

  showModalAddOrEditCalendars(data: any) {
    this.dialogHandlerS
      .openDialog(
        MantenimientoPreventivoForm,
        {
          id: data.id,
          task: data.activity,
          idMachinery: data.machineryId,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result) => this.reloadDataAfterDialog(result));
  }

  onDocumentos(machineryId: any) {
    this.dialogHandlerS.openDialog(
      ActivosDocumentos,
      {
        machineryId: machineryId,
      },
      "Documentos",
      this.dialogHandlerS.sizeFull,
    );
  }

  async onDeleteOrder(id: any) {
    await this.apiResponseS.onDelete(`maintenancecalendars/${id}`);
    // Recarga usando los valores actuales de TODOS los signals relevantes.
    this.onLoadData(
      this.customerIdS.customerId(),
      this.inventoryCategoryId()!,
      this.stateFilter(),
    );
  }

  onServiceHistory(id: any) {
    this.dialogHandlerS.openDialog(
      ServiceHistoryMachinery,
      {
        id: id,
      },
      "",
      this.dialogHandlerS.sizeFull,
    );
  }

  openMantenimientosDialog(equipo: Equipo) {
    this.selectedEquipo.set(equipo);
    this.mantenimientosVisible.set(true);
  }

  private async refreshSelectedEquipo(machineryId: any) {
    await this.onLoadData(
      this.customerIdS.customerId(),
      this.inventoryCategoryId(),
      this.stateFilter(),
    );
    const updated = this.data().find((e) => e.id === machineryId);
    if (updated) this.selectedEquipo.set(updated);
  }

  async onAddMantenimientoDialog(machineryId: any) {
    const result = await this.dialogHandlerS.openDialog(
      MantenimientoPreventivoForm,
      { id: 0, task: "create", idMachinery: machineryId },
      "Nuevo Servicio",
      this.dialogHandlerS.sizeFull,
    );
    if (result) await this.refreshSelectedEquipo(machineryId);
  }

  async onEditMantenimientoDialog(order: any) {
    const result = await this.dialogHandlerS.openDialog(
      MantenimientoPreventivoForm,
      { id: order.id, task: "edit", idMachinery: order.machineryId },
      "Editar Servicio",
      this.dialogHandlerS.sizeFull,
    );
    if (result) await this.refreshSelectedEquipo(order.machineryId);
  }

  async onDeleteOrderFromDialog(orderId: any, machineryId: any) {
    await this.apiResponseS.onDelete(`maintenancecalendars/${orderId}`);
    await this.refreshSelectedEquipo(machineryId);
  }
}
