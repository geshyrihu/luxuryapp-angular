import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { AvatarModule } from "primeng/avatar";
import { BadgeModule } from "primeng/badge";
import { ImageModule } from "primeng/image";
import { SplitButtonModule } from "primeng/splitbutton";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import {
  CustomButtonDelete,
  CustomButtonEdit,
} from "src/app/core/components/buttons/web";
import { CustomButtonDownload } from "src/app/core/components/buttons/web/custom-button-download";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { EmptyState } from "src/app/core/components/shared/empty-state/empty-state";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
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
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { ToolForm } from "./tool-form";

@Component({
  selector: "app-tool-list",
  templateUrl: "./tool-list.html",
  imports: [
    EmptyState,
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
    CustomButtonDelete,
    CustomButtonEdit,
  ],
})
export class ToolList {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;
  // Enum para usar en la plantilla
  // SeÃ±ales
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
    this.apiResponseS
      .onDelete(Endpoints.Tools.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
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

  htmlPrintS = inject(HtmlPrintService);

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
          const category = item.category || "SIN CATEGORÃA";
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
            <td colspan="2" class="sistema-header">${this.htmlPrintS.esc(category)}</td>
          </tr>
        `;

        groups[category].forEach((item, idx) => {
          const bg = idx % 2 === 0 ? "#ffffff" : "#f9fafb";

          const imgHtml = item.base64Image
            ? `<img src="${item.base64Image}" style="max-width:60px; max-height:60px; object-fit:contain;" />`
            : `<div style="font-size: 8px; color: #999; margin-top:10px; text-align:center;">Sin Imagen</div>`;

          tableHtml += `
            <tr>
              <td style="background-color: ${bg}; padding: 10px; width: 80px; text-align: center; vertical-align: middle;">
                ${imgHtml}
              </td>
              <td style="background-color: ${bg}; padding: 10px; vertical-align: middle;">
                <div style="font-size: 14px; color: #333;">${this.htmlPrintS.esc(item.nameTool || "Sin Nombre")}</div>
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
  .sistema-header { background-color: #eef2f7 !important; color: #003A62 !important; font-weight: bold; font-size: 14px; padding: 6px 10px !important; }

  .data-table { width:100%; border-collapse:collapse; margin-bottom:16px; }
  .data-table th, .data-table td { padding:4px 8px; border-bottom:1px solid #EEEEEE; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, "Inventario de Herramientas", "LISTADO DE CONTROL", generatedAt, "MANTENIMIENTO")}

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

      this.htmlPrintS.printHtml(html, "Inventario_Herramientas");
    } catch (e) {
      console.error("Error generating Tool PDF", e);
    } finally {
      this.loading.set(false);
    }
  }
}
