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
import { TDocumentDefinitions } from "pdfmake/interfaces";
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
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
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
  pdfGeneratorS = inject(PdfGeneratorService); // ? Added

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
    this.apiResponseS.onDelete(`almacen/${id}`).then(() => {
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
          const category = item.category || "SIN CATEGORóA";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      const content: any[] = [
        {
          text: `INVENTARIO: ${warehouseName.toUpperCase()}`,
          style: "header",
          margin: [0, 0, 0, 10],
        },
      ];

      for (const category in groups) {
        content.push({
          text: category,
          style: "subheader",
          margin: [0, 10, 0, 5],
        });

        const tableBody = groups[category].map((item) => {
          return [
            // Product Name
            {
              text: item.producto || "",
              style: "tableCell",
              margin: [0, 15, 0, 0],
              bold: true,
            },
            // Unit
            {
              text: item.unidadDeMedida || "",
              style: "tableCell",
              margin: [0, 15, 0, 0],
              alignment: "center",
            },
            // Stock
            {
              text: item.existencia?.toString() || "0",
              style: "tableCell",
              margin: [0, 15, 0, 0],
              alignment: "center",
              color:
                item.existencia <= item.stockMin
                  ? "red"
                  : item.existencia > item.stockMax
                    ? "orange"
                    : "black",
              bold: true,
            },
            // Limits
            {
              text: `${item.stockMin} / ${item.stockMax}`,
              style: "tableCell",
              margin: [0, 15, 0, 0],
              alignment: "center",
              color: "#666",
            },
          ];
        });

        content.push({
          table: {
            widths: ["*", "auto", "auto", "auto"],
            headerRows: 1,
            body: [
              [
                { text: "Producto", style: "tableHeader" },
                { text: "Unidad", style: "tableHeader", alignment: "center" },
                {
                  text: "Existencia",
                  style: "tableHeader",
                  alignment: "center",
                },
                {
                  text: "Min / Max",
                  style: "tableHeader",
                  alignment: "center",
                },
              ],
              ...tableBody,
            ],
          },
          layout: {
            hLineWidth: (i: number, node: any) => 1,
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
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: "#333333",
            margin: [0, 5, 0, 5],
          },
          tableCell: { fontSize: 9, margin: [2, 4, 2, 4] },
        },
      };

      this.pdfGeneratorS.generatePdf(
        docDefinition,
        `Inventario_${warehouseName.replace(/\s+/g, "_")}`,
        { clientName: `Almacón: ${warehouseName}` },
      );
    } catch (e) {
      console.error("Error generating Warehouse PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}
