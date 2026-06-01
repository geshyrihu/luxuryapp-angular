import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { waterOutline } from "ionicons/icons";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonDownload } from "src/app/core/components/buttons/mobile/ion-button-download";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RecepcionPipasAguaForm } from "./recepcion-pipas-agua-form";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-list",
  templateUrl: "./recepcion-pipas-agua-list.html",
  imports: [
    CommonModule,
    RouterModule,
    ImageModule,
    TableModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
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
export class RecepcionPipasAguaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  pdfGeneratorS = inject(PdfGeneratorService);

  dataSignal = signal<IRecepcionPipaAgua[]>([]);
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  constructor() {
    addIcons({ waterOutline });
    effect(() => {
      if (this.customerIdS.customerId()) this.onLoadData();
    });
  }

  onLoadData() {
    const url = `recepcion-pipas-agua/list/${this.customerIdS.customerId()}`;
    this.apiResponseS.onGetList(url).then((result: any) => {
      this.dataSignal.set(result ?? []);
      this.loading.set(false);
    });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(`recepcion-pipas-agua/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) => data.filter((x) => x.id !== id));
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        RecepcionPipasAguaForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDownloadPdf(item: IRecepcionPipaAgua): Promise<void> {
    const fmtNum = (v: number | null | undefined, d: number) =>
      v != null ? v.toFixed(d) : "-";

    const fmtDate = (d: string | null) => {
      if (!d) return "En curso";
      const clean = d.replace(/Z$/, "").replace(/[+-]\d{2}:\d{2}$/, "");
      const [datePart, timePart] = clean.split("T");
      if (!datePart) return "-";
      const [y, mo, day] = datePart.split("-");
      const time = (timePart || "00:00").slice(0, 5);
      return `${day}/${mo}/${y} ${time}`;
    };

    const m3 = item.lecturaMedidorFinal - item.lecturaMedidorInicial;

    const photoCell = (p: { label: string; base64: string | null }): any => ({
      stack: [
        {
          text: p.label,
          bold: true,
          fontSize: 7,
          margin: [0, 0, 0, 2],
          color: "#444",
        },
        p.base64
          ? { image: p.base64, width: 140, maxHeight: 115, alignment: "center" }
          : {
              text: "Sin foto",
              color: "#bbb",
              fontSize: 7,
              alignment: "center",
              margin: [0, 20, 0, 20],
            },
      ],
      margin: [1, 1, 1, 1],
    });

    const signatureCell = (name: string | null, cargo: string): any => ({
      stack: [
        { text: "\n\n", fontSize: 9 },
        {
          text: "_".repeat(28),
          color: "#444",
          fontSize: 8,
          alignment: "center",
        },
        {
          text: name ? name.toUpperCase() : " ",
          fontSize: 8,
          bold: true,
          alignment: "center",
          margin: [0, 2, 0, 0],
        },
        {
          text: cargo,
          fontSize: 7,
          alignment: "center",
          color: "#555",
          margin: [0, 1, 0, 0],
        },
      ],
      border: [false, false, false, false],
    });

    const photoDefs = [
      { label: "Pipa llena", url: item.fotoPipaLlenaUrl },
      { label: "Pipa vacia", url: item.fotoPipaVaciaUrl },
      { label: "Placas del camion", url: item.fotoPlacasUrl },
      { label: "INE del chofer", url: item.fotoIneChoferUrl },
      { label: "Medidor antes", url: item.fotoMedidorAntesUrl },
      { label: "Medidor despues", url: item.fotoMedidorDespuesUrl },
      { label: "Nivel antes", url: item.fotoNivelAntesUrl },
      { label: "Nivel despues", url: item.fotoNivelDespuesUrl },
      { label: "Nota", url: item.fotoNotaUrl },
    ];

    const [loaded, jefes] = await Promise.all([
      Promise.all(
        photoDefs.map(async (p) => ({
          label: p.label,
          base64: p.url ? await this.urlToBase64(p.url) : null,
        })),
      ),
      this.apiResponseS.onGetList(
        `responsables-cliente/por-rol?customerId=${this.customerIdS.customerId()}&role=JefeMantenimiento`,
      ) as Promise<any[]>,
    ]);
    const jefeMtto: string | null = (jefes as any[])?.[0]?.nameEmployee ?? null;

    const sectionTitle = (text: string): any => ({
      text,
      fontSize: 10,
      bold: true,
      color: "#003A62",
      margin: [0, 0, 0, 4],
    });

    const docDef: TDocumentDefinitions = {
      pageSize: "LETTER",
      pageMargins: [30, 30, 30, 20],
      content: [
        {
          text: "SOPORTE DE RECEPCION DE PIPA DE AGUA",
          fontSize: 13,
          bold: true,
          alignment: "center",
          color: "#003A62",
          margin: [0, 0, 0, 10],
        },

        sectionTitle("Datos generales"),
        {
          columns: [
            {
              stack: [
                {
                  text: [
                    { text: "Llegada: ", bold: true },
                    fmtDate(item.horaLlegada),
                  ],
                },
                {
                  text: [
                    { text: "Termino: ", bold: true },
                    fmtDate(item.horaTermino),
                  ],
                  margin: [0, 3, 0, 0],
                },
                ...(item.empresa ? [{
                  text: [{ text: "Empresa: ", bold: true }, item.empresa],
                  margin: [0, 3, 0, 0],
                }] : []),
                {
                  text: [{ text: "Placas: ", bold: true }, item.placasCamion],
                  margin: [0, 3, 0, 0],
                },
                {
                  text: [
                    { text: "Capacidad pipa: ", bold: true },
                    `${item.capacidadPipa?.toLocaleString("es-MX") ?? 0} L`,
                  ],
                  margin: [0, 3, 0, 0],
                },
              ],
              fontSize: 9,
            },
            {
              stack: [
                {
                  text: [
                    { text: "Cisterna antes: ", bold: true },
                    `${fmtNum(item.nivelCisternaAntes, 0)}%`,
                  ],
                },
                {
                  text: [
                    { text: "Cisterna despues: ", bold: true },
                    `${fmtNum(item.nivelCisternaDespues, 0)}%`,
                  ],
                  margin: [0, 3, 0, 0],
                },
                {
                  text: [
                    { text: "Dif. cisterna: ", bold: true },
                    `${fmtNum(item.nivelCisternaDespues - item.nivelCisternaAntes, 0)}%`,
                  ],
                  margin: [0, 3, 0, 0],
                },
                {
                  text: [
                    { text: "Costo m³: ", bold: true },
                    `$${fmtNum(item.costoMetroCubico, 2)}`,
                  ],
                  margin: [0, 3, 0, 0],
                },
              ],
              fontSize: 9,
            },
          ],
          columnGap: 20,
          margin: [0, 0, 0, 10],
        } as any,

        sectionTitle("Lecturas del medidor de agua"),
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                { text: "Medidor inicial", bold: true, fontSize: 8, fillColor: "#f0f4f8", alignment: "center" },
                { text: "Medidor final", bold: true, fontSize: 8, fillColor: "#f0f4f8", alignment: "center" },
                { text: "m³ ingresados", bold: true, fontSize: 8, fillColor: "#f0f4f8", alignment: "center" },
              ],
              [
                { text: fmtNum(item.lecturaMedidorInicial, 0), fontSize: 9, alignment: "center" },
                { text: fmtNum(item.lecturaMedidorFinal, 0), fontSize: 9, alignment: "center" },
                { text: fmtNum(m3, 0), fontSize: 9, bold: true, alignment: "center" },
              ],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 0, 0, 10],
        } as any,

        sectionTitle("Fotografias de evidencia"),
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [loaded[0], loaded[1], loaded[2]].map(photoCell),
              [loaded[3], loaded[4], loaded[5]].map(photoCell),
              [loaded[6], loaded[7], loaded[8]].map(photoCell),
            ],
          },
          margin: [0, 0, 0, 10],
        } as any,

        sectionTitle("Firmas de conformidad"),
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              [
                signatureCell(
                  item.colaboradorMtto,
                  "Colaborador de Mantenimiento",
                ),
                signatureCell(item.guardiaSeguridad, "Guardia de Seguridad"),
                signatureCell(jefeMtto, "Jefe de Mantenimiento"),
              ],
            ],
          },
          layout: "noBorders",
        } as any,
      ],
    };

    await this.pdfGeneratorS.generatePdf(
      docDef,
      `soporte-pipa-${item.placasCamion}-${item.horaLlegada.slice(0, 10)}`,
      { clientName: "Recepcion de Pipa de Agua" },
    );
  }

  private async urlToBase64(url: string): Promise<string | null> {
    if (!url) return null;
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const blob = await res.blob();
      return await this.blobToBase64(blob);
    } catch {
      return null;
    }
  }

  private blobToBase64(blob: Blob): Promise<string | null> {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(null);
          return;
        }
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      };
      img.src = objectUrl;
    });
  }
}
