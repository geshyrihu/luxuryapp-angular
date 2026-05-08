import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonAvatar, IonItem, IonLabel } from "@ionic/angular/standalone";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { AvatarModule } from "primeng/avatar";
import { BadgeModule } from "primeng/badge";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { ImageModule } from "primeng/image";
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import {
  IonButtonDelete,
  IonButtonEdit,
} from "src/app/core/components/buttons/mobile";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
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
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { ToolForm } from "./tool-form";

@Component({
  selector: "app-tool-list",
  templateUrl: "./tool-list.html",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    CustomButtonDelete,
    ImageModule,
    AvatarModule,
    SplitButtonModule,
    BadgeModule,
    RouterModule,
    CustomButtonDownload,
    DataViewMobile,
    ActionMenu,
    IonItem,
    IonLabel,
    IonAvatar,
    IonButtonDelete,
    IonButtonEdit,
  ],
})
export class ToolList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
  // Enum para usar en la plantilla
  // Señales
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `Tools/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      if (result) {
        this.dataSignal.set(result);
      }
    });
  }

  onDelete(id: any) {
    this.apiResponseS.onDelete(`Tools/${id}`).then((result: boolean) => {
      if (result) {
        this.dataSignal.update((data) => data.filter((item) => item.id !== id));
      }
    });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ToolForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  pdfGeneratorS = inject(PdfGeneratorService);

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
    const data = this.dataSignal();
    if (!data || data.length === 0) return;
    this.loading.set(true);

    try {
      // Prepare data with images
      const dataWithImages = await Promise.all(
        data.map(async (item) => {
          let base64Image: string | null = null;
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
              console.error("Error loading image for PDF", item.nameTool, e);
            }
          }
          return { ...item, base64Image };
        }),
      );

      // Sort by category then by name
      const sortedData = [...dataWithImages].sort((a, b) => {
        const catCompare = (a.category || "").localeCompare(b.category || "");
        if (catCompare !== 0) return catCompare;
        return (a.nameTool || "").localeCompare(b.nameTool || "");
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

      const content: any[] = [
        {
          text: "INVENTARIO DE HERRAMIENTAS",
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
            // Column 1: Image
            {
              stack: item.base64Image
                ? [
                  {
                    image: item.base64Image,
                    fit: [60, 60],
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
            // Column 2: Name
            {
              text: item.nameTool || "Sin Nombre",
              style: "tableCell",
              margin: [0, 25, 0, 0],
              border: [false, false, false, true],
            },
          ];
        });

        content.push({
          table: {
            widths: [80, "*"],
            headerRows: 0,
            body: tableBody,
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
          tableCell: { fontSize: 10, margin: [2, 4, 2, 4] },
        },
      };

      this.pdfGeneratorS.generatePdf(docDefinition, "Inventario_Herramientas", {
        clientName: "Inventario de Herramientas",
      });
    } catch (e) {
      console.error("Error generating Tool PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}
