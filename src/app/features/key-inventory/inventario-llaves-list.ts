import { Component, computed, effect, inject, signal } from "@angular/core";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, keyOutline } from "ionicons/icons";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonDownload } from "src/app/core/components/buttons/mobile/ion-button-download";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { IInventarioLlave } from "src/app/core/interfaces/inventario-llave-dto.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { InventarioLlaveForm } from "./inventario-llave-form";
@Component({
  selector: "app-inventario-llaves-list",
  templateUrl: "./inventario-llaves-list.html",
  imports: [
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonButtonDownload,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class InventarioLlavesList {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  pdfGeneratorS = inject(PdfGeneratorService); // ? Added
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<IInventarioLlave[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  customerId: string;

  constructor() {
    addIcons({ keyOutline, folderOpenOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `InventarioLlave/list/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`InventarioLlave/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        InventarioLlaveForm,
        {
          id: data.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDownloadPdf() {
    const data = this.dataSignal();
    if (!data || data.length === 0) return;
    this.loading.set(true);

    try {
      // Sort by Classification
      const sortedData = [...data].sort((a, b) =>
        (a.equipoClasificacion || "").localeCompare(
          b.equipoClasificacion || "",
        ),
      );

      // Group by Classification
      const groups = sortedData.reduce(
        (acc, item) => {
          const classification =
            item.equipoClasificacion || "SIN CLASIFICACIóN";
          if (!acc[classification]) acc[classification] = [];
          acc[classification].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      const content: any[] = [
        {
          text: "INVENTARIO DE LLAVES",
          style: "header",
          margin: [0, 0, 0, 10],
        },
      ];

      for (const classification in groups) {
        content.push({
          text: classification,
          style: "subheader",
          margin: [0, 10, 0, 5],
        });

        const tableBody = groups[classification].map((item) => {
          return [
            { text: item.descripcion || "", style: "tableCell" },
            { text: item.marca || "", style: "tableCell" },
            {
              text: item.numeroLlave?.toString() || "",
              style: "tableCell",
              alignment: "center",
            },
            {
              text: item.cantidad?.toString() || "",
              style: "tableCell",
              alignment: "center",
            },
          ];
        });

        content.push({
          table: {
            widths: ["*", "auto", "auto", "auto"],
            headerRows: 1,
            body: [
              [
                { text: "Descripción", style: "tableHeader" },
                { text: "Marca", style: "tableHeader" },
                { text: "Nómero", style: "tableHeader", alignment: "center" },
                { text: "Cant.", style: "tableHeader", alignment: "center" },
              ],
              ...tableBody,
            ],
          },
          layout: {
            fillColor: (rowIndex: number) =>
              rowIndex === 0 ? "#f2f2f2" : null,
            hLineWidth: (i: number, node: any) =>
              i === 0 || i === node.table.body.length ? 1 : 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => "#CCCCCC",
            vLineColor: () => "#CCCCCC",
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
          tableCell: { fontSize: 10, margin: [2, 4, 2, 4] },
        },
      };

      this.pdfGeneratorS.generatePdf(docDefinition, "Inventario_Llaves", {
        clientName: "Inventario de Llaves",
      });
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}









