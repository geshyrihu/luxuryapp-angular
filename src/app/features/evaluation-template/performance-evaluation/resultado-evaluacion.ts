import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ChartConfiguration, ChartData } from "chart.js";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { MessageModule } from "primeng/message";
import { TagModule } from "primeng/tag";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { PrimengRadarChart } from "src/app/core/components/charts/primeng-radar-chart";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ChartGeneratorService } from "src/app/core/services/chart-generator.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";

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
    CustomButton,
  ],
})
export class ResultadoEvaluacion {
  // Inyección de servicios
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly pdfGeneratorS = inject(PdfGeneratorService);
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
          label: "Promedio por Categoría",
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
          "No se pudo generar la imagen del gráfico.",
        );
        return;
      }

      const docDefinition = this.buildReportContent(chartImage, result);
      const fileName = `Evaluacion-${result.employeeName.replace(/\s/g, "_")}`;

      await this.pdfGeneratorS.generatePdf(docDefinition, fileName, {
        clientName: `Evaluación de: ${result.employeeName}`,
      });
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
  ): TDocumentDefinitions {
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

    const categoriesContent = (category: any) => ({
      stack: [
        {
          table: {
            widths: ["*", "auto"],
            body: [
              [
                {
                  text: category.name.toUpperCase(),
                  style: "categoryTitle",
                  fillColor: "#F1F3F5",
                  border: [false, false, false, false],
                  margin: [5, 5, 0, 5],
                },
                {
                  text: `Promedio: ${(category.categoryScore / category.answers.length).toFixed(2)} / 5.0`,
                  style: "categoryScore",
                  fillColor: "#F1F3F5",
                  alignment: "right",
                  border: [false, false, false, false],
                  margin: [0, 5, 5, 5],
                },
              ],
            ],
          },
          margin: [0, 0, 0, 10],
        },
        ...category.answers.map((answer: any, index: number) => {
          const hasComment =
            answer.comments &&
            answer.comments.trim().length > 0 &&
            answer.comments !== "Sin comentarios.";

          return {
            style: "questionCard",
            stack: [
              {
                columns: [
                  { width: "auto", text: `${index + 1}.`, margin: [0, 0, 5, 0] },
                  { width: "*", text: answer.questionText, style: "questionText" },
                ],
              },
              {
                columns: [
                  this.pdfGeneratorS.createTag(`${answer.score}/5`, "answerScore"),
                  hasComment
                    ? {
                        width: "*",
                        text: `Comentarios: ${answer.comments}`,
                        style: "answerComment",
                        alignment: "right",
                      }
                    : { text: "", width: 0 },
                ],
                margin: [0, 5, 0, 0],
              },
              {
                canvas: [
                  {
                    type: "line",
                    x1: 0,
                    y1: 5,
                    x2: 515,
                    y2: 5,
                    lineWidth: 0.5,
                    lineColor: "#E0E0E0",
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 10],
          };
        }),
      ],
      margin: [0, 0, 0, 20],
    });

    const page1Stack: any[] = [
      { text: `Evaluación: ${result.evaluationTemplateName}`, style: "header" },
      {
        style: "infoCard",
        table: {
          widths: ["*", "*", "*"],
          body: [
            [
              { text: "Fecha de Evaluación:", style: "infoTitle" },
              { text: "Empleado Evaluado:", style: "infoTitle" },
              { text: "Evaluador:", style: "infoTitle" },
            ],
            [
              { text: this.formatEvaluationDate(result.evaluationDate), style: "infoText" },
              {
                stack: [
                  { text: result.employeeName, style: "infoText" },
                  { text: result.employeePosition, style: "infoSubText" },
                ],
              },
              {
                stack: [
                  { text: result.evaluatorName, style: "infoText" },
                  { text: result.evaluatorPosition, style: "infoSubText" },
                ],
              },
            ],
          ],
        },
        layout: "noBorders",
      },
    ];

    if (chartImage) {
      page1Stack.push({
        image: chartImage,
        fit: [500, 250],
        alignment: "center",
        margin: [0, 10, 0, 10],
      });
    }

    page1Stack.push(
      {
        stack: [
          { text: "Puntuación Final", style: "subheader", alignment: "center" },
          this.pdfGeneratorS.createTag(
            result.finalScoreFormatted,
            "scoreTag",
            getScoreTagColor(),
          ),
          {
            text: `Promedio: ${result.finalScore.toFixed(2)} / 5.00`,
            style: "scoreAverage",
            alignment: "center",
          },
        ],
        margin: [0, 10, 0, 20],
      },
      {
        text: "Resumen de Desempeño por Categoría",
        style: "subheader",
        margin: [0, 10, 0, 5],
      },
      {
        table: {
          widths: ["*", "auto"],
          dontBreakRows: true,
          body: result.categories.map((cat: any) => [
            { text: cat.name, style: "infoText", margin: [0, 2, 0, 2] },
            {
              text: `${(cat.categoryScore / cat.answers.length).toFixed(2)} / 5.0`,
              style: "boldText",
              alignment: "right",
              margin: [0, 2, 0, 2],
            },
          ]),
        },
        layout: "lightHorizontalLines",
      },
    );

    return {
      content: [
        { stack: page1Stack, pageBreak: "after" },
        { text: "Detalle por Categorías", style: "sectionHeader" },
        ...result.categories.map((category: any) => ({
          ...categoriesContent(category),
          unbreakable: true,
        })),
      ],
    };
  }
}
