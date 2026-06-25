import { EmptyState } from "src/app/core/components/empty-state/empty-state";
import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { waterOutline } from "ionicons/icons";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
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
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { RecepcionPipasAguaForm } from "./recepcion-pipas-agua-form";
import { IRecepcionPipaAgua } from "./recepcion-pipas-agua.interfaces";

@Component({
  selector: "app-recepcion-pipas-agua-list",
  templateUrl: "./recepcion-pipas-agua-list.html",
  imports: [
    EmptyState,
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
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonDownload,
    IonItem,
    IonLabel,
    AppIcon,
  ],
})
export class RecepcionPipasAguaList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  tableScrollHeightS = inject(TableScrollHeightService);
  htmlPrintS = inject(HtmlPrintService);

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

    const photoCellHtml = (p: {
      label: string;
      base64: string | null;
    }): string => {
      if (p.base64) {
        return `
          <div style="text-align: center;">
            <div style="font-size: 10px; font-weight: bold; color: #444; margin-bottom: 5px;">${this.htmlPrintS.esc(p.label)}</div>
            <img src="${p.base64}" style="max-width: 100%; max-height: 150px; object-fit: contain; border-radius: 4px;" />
          </div>
        `;
      } else {
        return `
          <div style="text-align: center; padding: 20px 0;">
            <div style="font-size: 10px; font-weight: bold; color: #444; margin-bottom: 5px;">${this.htmlPrintS.esc(p.label)}</div>
            <div style="font-size: 10px; color: #bbb;">Sin foto</div>
          </div>
        `;
      }
    };

    const signatureCellHtml = (name: string | null, cargo: string): string => `
      <div style="text-align: center; margin-top: 40px;">
        <div style="border-bottom: 1px solid #444; width: 80%; margin: 0 auto; margin-bottom: 5px;"></div>
        <div style="font-size: 10px; font-weight: bold;">${this.htmlPrintS.esc(name ? name.toUpperCase() : " ")}</div>
        <div style="font-size: 9px; color: #555;">${this.htmlPrintS.esc(cargo)}</div>
      </div>
    `;

    const photoDefs = [
      { label: "Pipa llena", url: item.fotoPipaLlenaUrl },
      { label: "Pipa vacía", url: item.fotoPipaVaciaUrl },
      { label: "Placas del camión", url: item.fotoPlacasUrl },
      { label: "INE del chofer", url: item.fotoIneChoferUrl },
      { label: "Medidor antes", url: item.fotoMedidorAntesUrl },
      { label: "Medidor después", url: item.fotoMedidorDespuesUrl },
      { label: "Nivel antes", url: item.fotoNivelAntesUrl },
      { label: "Nivel después", url: item.fotoNivelDespuesUrl },
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

    const logo = await this.htmlPrintS.getLogoDataUrl();
    const generatedAt = new Date();

    const html = `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 1000px; margin: auto; }
  .section-title { font-size: 14px; font-weight: bold; color: #003A62; margin-bottom: 10px; margin-top: 20px; border-bottom: 1px solid #EEEEEE; padding-bottom: 5px; }
  .data-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .data-item { font-size: 12px; margin-bottom: 5px; }
  .data-label { font-weight: bold; }
  .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px; }
  .data-table th, .data-table td { border: 1px solid #EEEEEE; padding: 8px; text-align: center; }
  .data-table th { background-color: #f0f4f8; font-weight: bold; }
  .photos-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px; }
  .signatures-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-top: 40px; margin-bottom: 20px; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Soporte de Recepción de Pipa de Agua", `Pipa: ${item.placasCamion}`, generatedAt, "MANTENIMIENTO")}

  <div class="body-doc">
    <div class="section-title">Datos generales</div>
    <div class="data-grid">
      <div>
        <div class="data-item"><span class="data-label">Llegada:</span> ${fmtDate(item.horaLlegada)}</div>
        <div class="data-item"><span class="data-label">Término:</span> ${fmtDate(item.horaTermino)}</div>
        ${item.empresa ? `<div class="data-item"><span class="data-label">Empresa:</span> ${this.htmlPrintS.esc(item.empresa)}</div>` : ""}
        <div class="data-item"><span class="data-label">Placas:</span> ${this.htmlPrintS.esc(item.placasCamion)}</div>
        <div class="data-item"><span class="data-label">Capacidad pipa:</span> ${item.capacidadPipa?.toLocaleString("es-MX") ?? 0} L</div>
      </div>
      <div>
        <div class="data-item"><span class="data-label">Cisterna antes:</span> ${fmtNum(item.nivelCisternaAntes, 0)}%</div>
        <div class="data-item"><span class="data-label">Cisterna después:</span> ${fmtNum(item.nivelCisternaDespues, 0)}%</div>
        <div class="data-item"><span class="data-label">Dif. cisterna:</span> ${fmtNum(item.nivelCisternaDespues - item.nivelCisternaAntes, 0)}%</div>
        <div class="data-item"><span class="data-label">Costo m³:</span> $${fmtNum(item.costoMetroCubico, 2)}</div>
      </div>
    </div>

    <div class="section-title">Lecturas del medidor de agua</div>
    <table class="data-table">
      <thead>
        <tr>
          <th>Medidor inicial</th>
          <th>Medidor final</th>
          <th>m³ ingresados</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${fmtNum(item.lecturaMedidorInicial, 0)}</td>
          <td>${fmtNum(item.lecturaMedidorFinal, 0)}</td>
          <td style="font-weight: bold;">${fmtNum(m3, 0)}</td>
        </tr>
      </tbody>
    </table>

    <div class="section-title">Fotografías de evidencia</div>
    <div class="photos-grid">
      ${loaded.map(photoCellHtml).join("")}
    </div>

    <div class="section-title">Firmas de conformidad</div>
    <div class="signatures-grid">
      ${signatureCellHtml(item.colaboradorMtto, "Colaborador de Mantenimiento")}
      ${signatureCellHtml(item.guardiaSeguridad, "Guardia de Seguridad")}
      ${signatureCellHtml(jefeMtto, "Jefe de Mantenimiento")}
    </div>
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;

    this.htmlPrintS.printHtml(
      html,
      `soporte-pipa-${item.placasCamion}-${item.horaLlegada.slice(0, 10)}`,
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
