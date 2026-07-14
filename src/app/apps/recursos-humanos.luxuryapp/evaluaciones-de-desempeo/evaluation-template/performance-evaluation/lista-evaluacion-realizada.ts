import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  ChartGeneratorService,
  RadarChartData,
} from "src/app/core/services/chart-generator.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";
import { ROUTES } from "src/app/routing/route-paths";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-lista-evaluacion-realizada",
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconItem,
    WebButtonIconDelete,
    LxTooltipDirective,
    MobileActionMenu,
    MobileButtonLabelItem,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    WebButtonLabel,
    PrimeNgCustomTableFooter,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./lista-evaluacion-realizada.html",
})
export class ListaEvaluacionRealizada {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  route = inject(Router);
  htmlPrintS = inject(HtmlPrintService);
  customToastS = inject(CustomToastService);
  chartGeneratorS = inject(ChartGeneratorService);
  dateS = inject(DateService);
  dataSignal = signal<any[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return data && data.length > 0 ? globalFilterFields(data) : [];
  });
  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      Endpoints.RefactorRecursosHumanos.performanceEvaluationsCustomerByIdHistory(
        this.customerIdS.customerId(),
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result || []));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(
        Endpoints.RefactorRecursosHumanos.performanceEvaluationsById(id),
      )
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onCreate() {
    this.route.navigate(ROUTES.EVALUACION_EMPLEADOS.CONDUCTA_CREAR);
  }
  onEdit(id: string) {
    this.route.navigate(ROUTES.EVALUACION_EMPLEADOS.CONDUCTA_EDITAR(id));
  }
  onDetail(id: string) {
    this.route.navigate(ROUTES.EVALUACION_EMPLEADOS.RESULTADO(id));
  }

  async onDownloadAll(): Promise<void> {
    this.customToastS.showInfo(
      "Generando PDFs",
      "La descarga de móltiples PDFs puede tardar y su navegador podría solicitar permiso.",
    );
    const evaluations = this.dataSignal();
    for (const evalItem of evaluations) {
      await this.getAndGeneratePdf(evalItem.id, evalItem.employeeName);
    }
    this.customToastS.showSuccess(
      "Descarga Completa",
      `${evaluations.length} PDFs generados y descargados.`,
    );
  }

  async onDownloadIndividual(id: string, employeeName: string): Promise<void> {
    await this.getAndGeneratePdf(id, employeeName);
  }

  private async getAndGeneratePdf(
    id: string,
    employeeName: string,
  ): Promise<void> {
    try {
      const evaluationResult = await this.apiResponseS.onGetItem<any>(
        `performance-evaluations/${id}/result`,
      );
      if (!evaluationResult) {
        this.customToastS.showError(
          "Error",
          "No se encontró el resultado de la evaluación para generar el PDF.",
        );
        return;
      }

      // 1. Preparar datos para el gráfico
      const labels = evaluationResult.categories.map((c: any) => c.name);
      const data = evaluationResult.categories.map((c: any) =>
        c.answers?.length > 0
          ? parseFloat((c.categoryScore / c.answers.length).toFixed(2))
          : 0,
      );
      const radarChartData: RadarChartData = {
        labels: labels,
        datasets: [
          {
            data: data,
            label: "Promedio por Categoría",
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgb(54, 162, 235)",
            pointBackgroundColor: "rgb(54, 162, 235)",
          },
        ],
      };

      // 2. Generar imagen del gráfico de forma headless
      const chartImage = await this.chartGeneratorS.generateRadarChartBase64(
        radarChartData,
        { max: 5 },
      );

      // 3. Construir y descargar el PDF
      const logo = await this.htmlPrintS.getLogoDataUrl();
      const generatedAt = new Date();
      const html = this.buildPdfContentFromEvaluationResult(
        evaluationResult,
        chartImage,
        logo,
        generatedAt,
        employeeName,
      );
      const fileName = `Evaluacion-${employeeName.replace(/\s/g, "_")}`;

      this.htmlPrintS.printHtml(html, fileName);
    } catch (error) {
      console.error("Error al generar PDF individual:", error);
      this.customToastS.showError(
        "Error",
        `Falló la descarga del PDF para ${employeeName}.`,
      );
    }
  }

  private buildPdfContentFromEvaluationResult(
    evaluationResult: any,
    chartImage: string,
    logo: string | null,
    generatedAt: Date,
    employeeName: string,
  ): string {
    const formattedEvaluationDate = (() => {
      const date = this.dateS.parseDate(evaluationResult.evaluationDate);
      return date ? date.toLocaleDateString("es-ES") : "N/A";
    })();

    const getScoreTagColor = () => {
      const score = evaluationResult.finalScore;
      if (score >= 4.5) return "#28a745";
      if (score >= 3.0) return "#17a2b8";
      if (score >= 2.0) return "#ffc107";
      return "#dc3545"; // danger
    };

    let categoriesHtml = "";
    evaluationResult.categories.forEach((category: any) => {
      categoriesHtml += `
        <div style="margin-bottom: 20px;">
          <table style="width: 100%; margin-bottom: 10px; border-collapse: collapse;">
            <tr>
              <td style="background-color: #F1F3F5; padding: 5px; font-weight: bold; font-size: 14px;">${this.htmlPrintS.esc(category.name.toUpperCase())}</td>
              <td style="background-color: #F1F3F5; padding: 5px; font-weight: bold; text-align: right; color: #333;">Promedio: ${(category.categoryScore / category.answers.length).toFixed(2)} / 5.0</td>
            </tr>
          </table>
      `;

      category.answers.forEach((answer: any, index: number) => {
        const hasComment =
          answer.comments &&
          answer.comments.trim().length > 0 &&
          answer.comments !== "Sin comentarios.";

        categoriesHtml += `
          <div style="margin-bottom: 10px; margin-left: 10px; margin-right: 10px;">
            <div style="display: flex; margin-bottom: 5px;">
              <div style="margin-right: 5px;">${index + 1}.</div>
              <div style="flex-grow: 1;">${this.htmlPrintS.esc(answer.questionText)}</div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 5px;">
              <div style="background-color: #E7F5E8; color: #28a745; font-weight: bold; padding: 2px 5px; border-radius: 4px; display: inline-block;">
                ${answer.score}/5
              </div>
              ${hasComment ? `<div style="font-size: 10px; color: #555555; text-align: right; flex-grow: 1;">Comentarios: ${this.htmlPrintS.esc(answer.comments)}</div>` : ""}
            </div>
            <hr style="border: 0; border-top: 1px solid #E0E0E0; margin-top: 5px;" />
          </div>
        `;
      });
      categoriesHtml += `</div>`;
    });

    const summaryTableHtml = evaluationResult.categories
      .map(
        (cat: any) => `
      <tr>
        <td style="padding: 4px; border-bottom: 1px solid #ddd;">${this.htmlPrintS.esc(cat.name)}</td>
        <td style="padding: 4px; border-bottom: 1px solid #ddd; text-align: right; font-weight: bold;">${(cat.categoryScore / cat.answers.length).toFixed(2)} / 5.0</td>
      </tr>
    `,
      )
      .join("");

    return `<!doctype html>
<html lang="es"><head><meta charset="UTF-8">
${this.htmlPrintS.getStandardCss()}
<style>
  @page { margin: 10mm; }
  .container { max-width: 800px; margin: auto; }
  .info-title { font-weight: bold; color: #6c757d; font-size: 11px; }
  .info-text { font-size: 12px; }
  .info-subtext { font-size: 11px; color: #6c757d; }
  .score-tag { font-size: 24px; font-weight: bold; color: #FFFFFF; text-align: center; margin: 10px 0; padding: 5px 10px; border-radius: 4px; display: inline-block; }
  .page-break { page-break-after: always; }
</style>
</head><body>
<div class="container">
  ${this.htmlPrintS.buildStandardHeader(logo, `Evaluación: ${evaluationResult.evaluationTemplateName}`, `Empleado: ${employeeName}`, generatedAt, "RECURSOS HUMANOS")}

  <div class="body-doc page-break">
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="width: 33%;"><div class="info-title">Fecha de Evaluación:</div><div class="info-text">${formattedEvaluationDate}</div></td>
        <td style="width: 33%;">
          <div class="info-title">Empleado Evaluado:</div>
          <div class="info-text">${this.htmlPrintS.esc(evaluationResult.employeeName)}</div>
          <div class="info-subtext">${this.htmlPrintS.esc(evaluationResult.employeePosition)}</div>
        </td>
        <td style="width: 33%;">
          <div class="info-title">Evaluador:</div>
          <div class="info-text">${this.htmlPrintS.esc(evaluationResult.evaluatorName)}</div>
          <div class="info-subtext">${this.htmlPrintS.esc(evaluationResult.evaluatorPosition)}</div>
        </td>
      </tr>
    </table>

    ${chartImage ? `<div style="text-align: center; margin: 10px 0;"><img src="${chartImage}" style="max-width: 500px; max-height: 250px;" /></div>` : ""}

    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Puntuación Final</div>
      <div class="score-tag" style="background-color: ${getScoreTagColor()}">${this.htmlPrintS.esc(evaluationResult.finalScoreFormatted)}</div>
      <div style="font-size: 12px; color: #6c757d;">Promedio: ${evaluationResult.finalScore.toFixed(2)} / 5.00</div>
    </div>

    <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Resumen de Desempeño por Categoría</div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      ${summaryTableHtml}
    </table>
  </div>

  <div class="body-doc">
    <div style="font-size: 18px; font-weight: bold; background-color: #EEEEEE; padding: 5px; margin-bottom: 10px;">Detalle por Categorías</div>
    ${categoriesHtml}
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }
}
