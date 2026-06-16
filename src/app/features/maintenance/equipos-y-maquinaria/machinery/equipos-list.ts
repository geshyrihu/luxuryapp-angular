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
import { CardModule } from "primeng/card";
import { Dialog } from "primeng/dialog";
import { DrawerModule } from "primeng/drawer";
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
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { EquipmentInspectionQrPrintService } from "src/app/features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection-qr-print.service";
import { EquipmentInspectionService } from "src/app/features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspection.service";
import { MantenimientoPreventivoForm } from "src/app/features/operations/google-calendar/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
import { ActivosForm } from "src/app/features/maintenance/equipos-y-maquinaria/machinery-asset/activos-form";
import { ActivosDocumentos } from "src/app/features/maintenance/equipos-y-maquinaria/machinery-document/activos-documentos";
import { EquipmentInspectionsShell } from "src/app/features/maintenance/equipos-y-maquinaria/equipment-inspections/equipment-inspections-shell";
import { FichaTecnicaActivo } from "src/app/features/maintenance/equipos-y-maquinaria/machinery/ficha-tecnica-activo";
import { ServiceHistoryMachinery } from "src/app/features/maintenance/equipos-y-maquinaria/machinery/service-history-machinery";
import { BitacoraIndividual } from "src/app/features/maintenance/logs/maintenance-log/bitacora-individual";
import { CalendarioMaestroReadonly } from "src/app/features/maintenance/planificacin-de-mantenimiento/maintenance-calendar-master/calendario-maestro-readonly";
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
    DrawerModule,
    Tag,
    CalendarioMaestroReadonly,
  ],
})
export class EquiposList {
  public authS = inject(AuthService);
  public aspRoleS = inject(AspRoleService);
  apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);
  private htmlPrintS = inject(HtmlPrintService);
  private equipmentInspectionS = inject(EquipmentInspectionService);
  private equipmentInspectionQrPrintS = inject(EquipmentInspectionQrPrintService);
  // --- ESTADO DEL COMPONENTE CON SIGNALS ---
  data = signal<any[]>([]);
  loading = signal(true);
  stateFilter = signal<number>(0);
  selectedEquipo = signal<Equipo | null>(null);
  mantenimientosVisible = signal(false);
  calendarioGuiaVisible = signal(false);
  public AspRole = EApplicationRole;

  // óCAMBIO CLAVE! La categoróa ahora es un signal interno.
  inventoryCategoryId = signal<number>(1);

  categories = [
    { id: 1, name: "Equipos Electromecanicos", emoji: "mdi:cog" },
    { id: 2, name: "Amenidades", emoji: "mdi:star-outline" },
    { id: 3, name: "Mobiliario", emoji: "mdi:table" },
    { id: 4, name: "Equipamiento", emoji: "mdi:wrench" },
    { id: 5, name: "Equipos de Gimnasio", emoji: "mdi:heart-outline" },
    { id: 6, name: "Equipos de Sistemas", emoji: "mdi:monitor" },
    { id: 8, name: "Areas Comunes", emoji: "mdi:map-marker" },
    { id: 7, name: "Bodegas, Cuartos de Maquinas", emoji: "mdi:package" },
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

  async onDownloadPdf(): Promise<void> {
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
          const system = item.equipoClasificacion || "SIN CLASIFICACIÓN";
          if (!acc[system]) acc[system] = [];
          acc[system].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      let tableHtml = "";

      for (const system in groups) {
        tableHtml += `
          <tr>
            <td colspan="2" class="sistema-header">${this.htmlPrintS.esc(system)}</td>
          </tr>
        `;

        groups[system].forEach((item, idx) => {
          const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
          
          const imgHtml = item.base64Image 
            ? `<img src="${item.base64Image}" style="max-width:100px; max-height:100px; object-fit:contain;" />` 
            : `<div style="font-size: 8px; color: #999; margin-top:20px; text-align:center;">Sin Imagen</div>`;

          tableHtml += `
            <tr>
              <td style="background-color: ${bg}; padding: 10px; width: 120px; text-align: center; vertical-align: middle;">
                ${imgHtml}
              </td>
              <td style="background-color: ${bg}; padding: 10px; vertical-align: top;">
                <div style="font-size: 14px; font-weight: bold; color: #333; margin-bottom: 4px;">${this.htmlPrintS.esc(item.nameMachinery || "Sin Nombre")}</div>
                <div style="margin-bottom: 4px;"><span style="font-weight: bold;">Ubicación:</span> ${this.htmlPrintS.esc(item.ubication || "N/A")}</div>
                <table style="width: 100%; border: none;">
                  <tr>
                    <td style="border: none; padding: 0;"><span style="font-weight: bold;">Marca:</span> ${this.htmlPrintS.esc(item.brand || "N/A")}</td>
                    <td style="border: none; padding: 0;"><span style="font-weight: bold;">Modelo:</span> ${this.htmlPrintS.esc(item.model || "N/A")}</td>
                    <td style="border: none; padding: 0;"><span style="font-weight: bold;">Serie:</span> ${this.htmlPrintS.esc(item.serie || "N/A")}</td>
                  </tr>
                </table>
              </td>
            </tr>
          `;
        });
      }

      const logo = await this.htmlPrintS.getLogoDataUrl();
      const generatedAt = new Date();

      const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; }
  th { background-color: #1E3A8A !important; color: #FFFFFF !important; }
  
  .sistema-header { background-color: #eef2f7 !important; color: #003A62 !important; font-weight: bold; font-size: 14px; padding: 6px 10px !important; }
  
  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 8px; border:1px solid #D1D5DB; }
  .data-table th { background:#1E3A8A; color: #ffffff; font-weight:700; text-align:center; font-size: 11px; }

</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, `INVENTARIO DE ${this.title().toUpperCase()}`, `Estado: ${this.subTitle()}`, generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <table class="data-table">
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>
  
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      this.htmlPrintS.printHtml(html, `Inventario_${this.title().replace(/\s+/g, "_")}`);
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
    await this.apiResponseS.onDelete(Endpoints.Machineries.delete(id));
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

  async onDownloadEquipmentInspectionQrBatch(): Promise<void> {
    const customerId = this.customerIdS.customerId();
    const machineryIds = this.data().map((item) => item.id).filter(Boolean);

    if (!customerId || machineryIds.length === 0) {
      return;
    }

    const result = await this.equipmentInspectionS.downloadQrBatch({
      customerId,
      machineryIds,
      qrLabelIds: [],
      onlyActive: true,
    });

    if (result && result.length > 0) {
      await this.equipmentInspectionQrPrintS.printMany(
        result,
        `QR-${this.title()}`,
      );
    }
  }

  onEquipmentInspections(item: Equipo) {
    this.dialogHandlerS.openDialog(
      EquipmentInspectionsShell,
      {
        id: item.id,
        nameMachinery: item.nameMachinery,
      },
      `Inspecciones de ${item.nameMachinery}`,
      this.dialogHandlerS.sizeLg,
    );
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
    await this.apiResponseS.onDelete(Endpoints.MaintenanceCalendars.delete(id));
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
    await this.apiResponseS.onDelete(Endpoints.MaintenanceCalendars.delete(orderId));
    await this.refreshSelectedEquipo(machineryId);
  }
}

