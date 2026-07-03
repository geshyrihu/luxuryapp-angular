import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ChartConfiguration, ChartData } from "chart.js";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TagModule } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { PrimengRadarChart } from "src/app/core/components/web/charts/primeng-radar-chart";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ChartGeneratorService } from "src/app/core/services/chart-generator.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { HtmlPrintService } from "src/app/core/services/html-print.service";

@Component({
  selector: "app-resultado-evaluacion",
  templateUrl: "./resultado-evaluacion.html",
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    TagModule,
    MessageModule,
    PrimengRadarChart,
    WebButtonLabel,
  ],
})
export class ResultadoEvaluacion {
  // Inyección de servicios
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly htmlPrintS = inject(HtmlPrintService);
  private readonly customToastS = inject(CustomToastService);
  private readonly chartGeneratorS = inject(ChartGeneratorService);
  private readonly dateS = inject(DateService);

  // Signals para estado reactivo
  evaluationResult = signal<any | null>(null);
  chartImageUrl = signal<string | null>(null);
  today = signal(new Date());

  radarChartData = signal<ChartData<"radar">>({
    labels: [],
    datasets: [{ data: [], label: "Cargando..." }],
  });

  radarChartOptions: ChartConfiguration["options"] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: { min: 1, max: 5, ticks: { stepSize: 1 } },
    },
    plugins: {
      legend: { position: "top" },
    },
  };

  // Computed signals
  finalScoreSeverity = computed(() => {
    const res = this.evaluationResult();
    if (!res) return "info";
    const score = res.finalScore;
    if (score >= 4.5) return "success";
    if (score >= 3.0) return "info";
    if (score >= 2.0) return "warning";
    return "danger";
  });

  private paramsSignal = toSignal(this.activatedRoute.paramMap);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        const id = params.get("id");
        if (id) this.loadEvaluationResult(id);
      }
    });
  }

  loadEvaluationResult(id: string): void {
    this.apiResponseS
      .onGetItem<any>(`PerformanceEvaluations/${id}/result`)
      .then((data) => {
        if (data) {
          this.evaluationResult.set(data);
          this.prepareChartData(data);
        }
      });
  }

  prepareChartData(result: any): void {
    if (!result?.categories) return;
    const labels = result.categories.map((c: any) => c.name);
    const data = result.categories.map((c: any) =>
      c.answers?.length > 0
        ? parseFloat((c.categoryScore / c.answers.length).toFixed(2))
        : 0,
    );

    this.radarChartData.set({
      labels: labels,
      datasets: [
        {
          data: data,
          label: "Promedio por Categoróa",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgb(54, 162, 235)",
          pointBackgroundColor: "rgb(54, 162, 235)",
        },
      ],
    });
  }

  formatEvaluationDate(value: string): string {
    const date = this.dateS.parseDate(value);
    return date ? date.toLocaleDateString("es-ES") : "N/A";
  }

  async exportToPDF() {
    const result = this.evaluationResult();
    if (!result) return;

    try {
      const chartImage = await this.chartGeneratorS.generateRadarChartBase64(
        this.radarChartData(),
        this.radarChartOptions,
      );

      if (!chartImage) {
        this.customToastS.showError(
          "Error",
          "No se pudo generar la imagen del grófico.",
        );
        return;
      }

      const logo = await this.htmlPrintS.getLogoDataUrl();
      const generatedAt = new Date();
      const html = this.buildReportContent(
        chartImage,
        result,
        logo,
        generatedAt,
      );
      const fileName = `Evaluacion-${result.employeeName.replace(/\s/g, "_")}`;

      this.htmlPrintS.printHtml(html, fileName);
    } catch (error) {
      console.error("Error al exportar a PDF:", error);
      this.customToastS.showError(
        "Error",
        "Ocurrió un problema al generar el PDF.",
      );
    }
  }

  private buildReportContent(
    chartImage: string,
    result: any,
    logo: string | null,
    generatedAt: Date,
  ): string {
    const severity = this.finalScoreSeverity();
    const getScoreTagColor = () => {
      switch (severity) {
        case "success":
          return "#28a745";
        case "info":
          return "#17a2b8";
        case "warning":
          return "#ffc107";
        case "danger":
          return "#dc3545";
        default:
          return "#6c757d";
      }
    };

    let categoriesHtml = "";
    result.categories.forEach((category: any) => {
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

    const summaryTableHtml = result.categories
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
  ${this.htmlPrintS.buildStandardHeader(logo, `Evaluación: ${result.evaluationTemplateName}`, `Empleado: ${result.employeeName}`, generatedAt, "RECURSOS HUMANOS")}

  <div class="body-doc page-break">
    <table style="width: 100%; margin-bottom: 20px;">
      <tr>
        <td style="width: 33%;"><div class="info-title">Fecha de Evaluación:</div><div class="info-text">${this.formatEvaluationDate(result.evaluationDate)}</div></td>
        <td style="width: 33%;">
          <div class="info-title">Empleado Evaluado:</div>
          <div class="info-text">${this.htmlPrintS.esc(result.employeeName)}</div>
          <div class="info-subtext">${this.htmlPrintS.esc(result.employeePosition)}</div>
        </td>
        <td style="width: 33%;">
          <div class="info-title">Evaluador:</div>
          <div class="info-text">${this.htmlPrintS.esc(result.evaluatorName)}</div>
          <div class="info-subtext">${this.htmlPrintS.esc(result.evaluatorPosition)}</div>
        </td>
      </tr>
    </table>

    ${chartImage ? `<div style="text-align: center; margin: 10px 0;"><img src="${chartImage}" style="max-width: 500px; max-height: 250px;" /></div>` : ""}

    <div style="text-align: center; margin: 20px 0;">
      <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Puntuación Final</div>
      <div class="score-tag" style="background-color: ${getScoreTagColor()}">${this.htmlPrintS.esc(result.finalScoreFormatted)}</div>
      <div style="font-size: 12px; color: #6c757d;">Promedio: ${result.finalScore.toFixed(2)} / 5.00</div>
    </div>

    <div style="font-size: 16px; font-weight: bold; margin-bottom: 5px;">Resumen de Desempeóo por Categoróa</div>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
      ${summaryTableHtml}
    </table>
  </div>

  <div class="body-doc">
    <div style="font-size: 18px; font-weight: bold; background-color: #EEEEEE; padding: 5px; margin-bottom: 10px;">Detalle por Categoróas</div>
    ${categoriesHtml}
  </div>

  ${this.htmlPrintS.buildStandardFooter(generatedAt)}
</div>
</body></html>`;
  }
}
