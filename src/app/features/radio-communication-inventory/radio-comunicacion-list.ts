import { Component, computed, effect, inject, signal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { folderOpenOutline, radioOutline } from "ionicons/icons";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
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
import { IRadioComunicacion } from "src/app/core/interfaces/radio-comunicacion.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RadioComunicacionForm } from "./radio-comunicacion-form";
@Component({
  selector: "app-radio-comunicacion-list",
  templateUrl: "./radio-comunicacion-list.html",
  imports: [
    TableModule,
    ImageModule,
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
    DatePipe,
  ],
})
export class RadioComunicacionList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  pdfGeneratorS = inject(PdfGeneratorService); // ? Added
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<IRadioComunicacion[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ radioOutline, folderOpenOutline });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = `RadioComunicacion/List/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RadioComunicacion/${id}`)
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
        RadioComunicacionForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
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
    const data = this.dataSignal();
    if (!data || data.length === 0) return;
    this.loading.set(true);

    try {
      // 1. Prepare data with images
      const dataWithImages = await Promise.all(
        data.map(async (item: any) => {
          let base64Image = null;
          if (item.fotografia) {
            try {
              const blob = await this.apiResponseS.getBlobFileFromFullUrl(
                item.fotografia,
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
              console.error("Error loading image for PDF", item.marca, e);
            }
          }
          return { ...item, base64Image };
        }),
      );

      // Sort by brand
      const sortedData = [...dataWithImages].sort((a, b) =>
        (a.marca || "").localeCompare(b.marca || ""),
      );

      // Group by brand
      const groups = sortedData.reduce(
        (acc, item) => {
          const brand = item.marca || "SIN MARCA";
          if (!acc[brand]) acc[brand] = [];
          acc[brand].push(item);
          return acc;
        },
        {} as Record<string, any[]>,
      );

      const content: any[] = [
        {
          text: "INVENTARIO DE RADIO COMUNICACIóN",
          style: "header",
          margin: [0, 0, 0, 10],
        },
      ];

      for (const brand in groups) {
        content.push({
          text: brand,
          style: "subheader",
          margin: [0, 10, 0, 5],
        });

        const tableBody = groups[brand].map((item) => {
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
            // Column 2: Details
            {
              stack: [
                {
                  text: [
                    { text: "Modelo: ", bold: true, fontSize: 10 },
                    { text: item.modelo || "N/A", fontSize: 10 },
                  ],
                  margin: [0, 0, 0, 2],
                },
                {
                  text: [
                    { text: "Serie: ", bold: true, fontSize: 10 },
                    { text: item.serie || "N/A", fontSize: 10 },
                  ],
                  margin: [0, 0, 0, 2],
                },
                {
                  text: [
                    { text: "Bateróa: ", bold: true, fontSize: 10 },
                    { text: item.bateria || "N/A", fontSize: 10 },
                  ],
                  margin: [0, 0, 0, 2],
                },
                {
                  text: [
                    { text: "Responsable: ", bold: true, fontSize: 10 },
                    { text: item.applicationUser || "N/A", fontSize: 10 },
                    { text: " / ", fontSize: 10 },
                    { text: item.departament || "N/A", fontSize: 10 },
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
        },
      };

      this.pdfGeneratorS.generatePdf(docDefinition, "Inventario_Radios", {
        clientName: "Inventario de Radio Comunicación",
      });
    } catch (e) {
      console.error("Error generating PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}








