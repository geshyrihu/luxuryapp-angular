import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
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
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { WarehouseForm } from "./warehouse-form";
import {
  IonButtonDelete,
  IonButtonEdit,
  IonButtonItem,
} from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-warehouse-list",
  templateUrl: "./warehouse-list.html",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    CustomButtonItem,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonEdit,
    IonButtonItem,
  ],
})
export class WarehouseList implements OnInit {
  authS = inject(AuthService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService); // Inyectamos AuthService para obtener el customerId
  router = inject(Router);
  aspRoleService = inject(AspRoleService);
  htmlPrintS = inject(HtmlPrintService);

  // Declaración e inicialización de signals
  dataSignal = signal<any[]>([]);
  loading = signal(false); // ? Added loading state

  // Opciones de la tabla PrimeNG
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  isAdmin = this.aspRoleService.hasAny([
    EApplicationRole.Administrador,
    EApplicationRole.SuperUsuario,
  ]);
  // El computed se mantiene, es genórico y funcionaró perfectamente
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    if (!customerId) return;
    // CAMBIO: URL de la API apunta al controlador de Almacen, usando el customerId del usuario logueado
    let urlApi = "";
    if (this.isAdmin) {
      // Los administradores obtienen todos los almacenes
      urlApi = `almacen/customer/${customerId}`;
    } else {
      // Los usuarios regulares obtienen solo sus almacenes asignados
      urlApi = `almacen/my-warehouses/${customerId}`;
    }
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  // CAMBIO: El ID de un almacón es 'string', no 'number'
  onDelete(id: string) {
    // Usamos el servicio genórico para la petición DELETE
    this.apiResponseS.onDelete(Endpoints.Almacen.delete(id)).then(() => {
      // Actualizamos el signal localmente para una UI mós rópida
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    });
  }

  onModalForm(data: any) {
    // CAMBIO: Se pasa el componente correcto 'AlmacenAddOrEditComponent' al diálogo
    this.dialogHandlerS
      .openDialog(
        WarehouseForm,
        data,
        data.title, // El Título se pasa en el objeto 'data'
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        // Si el diálogo se cerró con un resultado exitoso, recargamos los datos
        if (result) {
          this.onLoadData();
        }
      });
  }
  onViewProducts(almacenId: string) {
    this.router.navigate(["/warehouse/products", almacenId]);
    // Asegórate de que '/ruta-a-tu-inventario/stock' coincida con tu configuración de rutas
  }

  async onDownloadInventory(almacenId: string, warehouseName: string) {
    this.loading.set(true);
    const customerId: string = this.customerIdS.customerId();
    // Use the exact endpoint from warehouse-stock-list.ts
    const urlApi = `InventarioProducto/GetAsyncAll/${customerId}/${almacenId}`;

    try {
      // Fetch inventory data
      const inventoryData: any[] = await this.apiResponseS.onGetList(urlApi);

      if (!inventoryData || inventoryData.length === 0) {
        // Handle empty inventory if needed (e.g., toast)
        this.loading.set(false);
        return;
      }

      // Sort by category then product name
      const sortedData = [...inventoryData].sort((a, b) => {
        const catCompare = (a.category || "").localeCompare(b.category || "");
        if (catCompare !== 0) return catCompare;
        return (a.producto || "").localeCompare(b.producto || "");
      });

      // Group by category
      const groups = sortedData.reduce(
        (acc, item) => {
          const category = item.category || "SIN CATEGORÍA";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      let tableHtml = "";

      for (const category in groups) {
        tableHtml += `
          <tr>
            <td colspan="4" class="sistema-header">${this.htmlPrintS.esc(category)}</td>
          </tr>
        `;

        groups[category].forEach((item, idx) => {
          const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";
          
          let color = "#000000";
          if (item.existencia <= item.stockMin) color = "#dc3545"; // red
          else if (item.existencia > item.stockMax) color = "#fd7e14"; // orange

          tableHtml += `
            <tr>
              <td style="background-color: ${bg}; padding: 8px; font-weight: bold;">${this.htmlPrintS.esc(item.producto || "")}</td>
              <td style="background-color: ${bg}; padding: 8px; text-align: center;">${this.htmlPrintS.esc(item.unidadDeMedida || "")}</td>
              <td style="background-color: ${bg}; padding: 8px; text-align: center; font-weight: bold; color: ${color};">${this.htmlPrintS.esc(item.existencia?.toString() || "0")}</td>
              <td style="background-color: ${bg}; padding: 8px; text-align: center; color: #666;">${item.stockMin} / ${item.stockMax}</td>
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
  .sistema-header { background-color: #eef2f7 !important; color: #003A62 !important; font-weight: bold; font-size: 14px; padding: 6px 10px !important; }
  
  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:8px; border-bottom:1px solid #EEEEEE; }
  .data-table th { background-color: #f8f9fa; font-weight: bold; color: #333; text-align: center; border-bottom: 2px solid #ddd; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, `INVENTARIO: ${warehouseName.toUpperCase()}`, `Almacén: ${warehouseName}`, generatedAt, "ALMACÉN")}

  <div class="body-doc">
    <table class="data-table">
      <thead>
        <tr>
          <th style="text-align: left;">Producto</th>
          <th>Unidad</th>
          <th>Existencia</th>
          <th>Min / Max</th>
        </tr>
      </thead>
      <tbody>
        ${tableHtml}
      </tbody>
    </table>
  </div>
  
  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

      this.htmlPrintS.printHtml(html, `Inventario_${warehouseName.replace(/\s+/g, "_")}`);
    } catch (e) {
      console.error("Error generating Warehouse PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}
