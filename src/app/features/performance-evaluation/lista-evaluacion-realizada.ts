import { Component, computed, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { ChartConfiguration, ChartData } from "chart.js";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
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
import { AuthService } from "src/app/core/services/auth.service";
import { ChartGeneratorService } from "src/app/core/services/chart-generator.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { PdfGeneratorService } from "src/app/core/services/pdf-generator.service";
import { IonButtonDelete, IonButtonItem } from "src/app/core/components/buttons/mobile";
@Component({
  selector: "app-lista-evaluacion-realizada",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonItem,
    CustomButton,
    CustomButtonDelete,
    PrimeNgCustomTableFooter,
    IonItem,
    IonLabel,
    IonButtonDelete,
    IonButtonItem,
  ],
  templateUrl: "./lista-evaluacion-realizada.html",
})
export class ListaEvaluacionRealizada {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  route = inject(Router);
  pdfGeneratorS = inject(PdfGeneratorService);
  customToastS = inject(CustomToastService);
  chartGeneratorS = inject(ChartGeneratorService);
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
    const urlApi = `PerformanceEvaluations/customer/${this.customerIdS.customerId()}/history`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result || []));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`PerformanceEvaluations/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }

  onCreate() {
    this.route.navigate(["/employee-evaluation/conduct/create"]);
  }
  onEdit(id: string) {
    this.route.navigate(["/employee-evaluation/conduct/edit", id]);
  }
  onDetail(id: string) {
    this.route.navigate(["/employee-evaluation/result", id]);
  }

  async onDownloadAll(): Promise<void> {
    this.customToastS.showInfo(
      "Generando PDFs",
      "La descarga de móltiples PDFs puede tardar y su navegador podróa solicitar permiso.",
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
        `PerformanceEvaluations/${id}/result`,
      );
      if (!evaluationResult) {
        this.customToastS.showError(
          "Error",
          "No se encontró el resultado de la evaluación para generar el PDF.",
        );
        return;
      }

      // 1. Preparar datos para el grófico
      const labels = evaluationResult.categories.map((c: any) => c.name);
      const data = evaluationResult.categories.map((c: any) =>
        c.answers?.length > 0
          ? parseFloat((c.categoryScore / c.answers.length).toFixed(2))
          : 0,
      );
      const radarChartData: ChartData<"radar"> = {
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
      };
      const radarChartOptions: ChartConfiguration["options"] = {
        scales: {
          r: { min: 1, max: 5, ticks: { stepSize: 1 } },
        },
        plugins: {
          legend: { position: "top" },
        },
      };

      // 2. Generar imagen del grófico de forma headless
      const chartImage = await this.chartGeneratorS.generateRadarChartBase64(
        radarChartData,
        radarChartOptions,
      );

      // 3. Construir y descargar el PDF
      const docDefinition = this.buildPdfContentFromEvaluationResult(
        evaluationResult,
        chartImage,
      );
      const fileName = `Evaluacion-${employeeName.replace(/\s/g, "_")}`;

      await this.pdfGeneratorS.generatePdf(docDefinition, fileName, {
        clientName: `Evaluación de: ${employeeName}`,
      });
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
  ): TDocumentDefinitions {
    const getScoreTagColor = () => {
      const score = evaluationResult.finalScore;
      if (score >= 4.5) return "#28a745";
      if (score >= 3.0) return "#17a2b8";
      if (score >= 2.0) return "#ffc107";
      return "#dc3545"; // danger
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
                  {
                    width: "auto",
                    text: `${index + 1}.`,
                    margin: [0, 0, 5, 0],
                  },
                  {
                    width: "*",
                    text: answer.questionText,
                    style: "questionText",
                  },
                ],
              },
              {
                columns: [
                  this.pdfGeneratorS.createTag(
                    `${answer.score}/5`,
                    "answerScore",
                  ),
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
      {
        text: `Evaluación: ${evaluationResult.evaluationTemplateName}`,
        style: "header",
      },
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
              {
                text: new Date(
                  evaluationResult.evaluationDate,
                ).toLocaleDateString("es-ES"),
                style: "infoText",
              },
              {
                stack: [
                  {
                    text: evaluationResult.employeeName,
                    style: "infoText",
                  },
                  {
                    text: evaluationResult.employeePosition,
                    style: "infoSubText",
                  },
                ],
              },
              {
                stack: [
                  {
                    text: evaluationResult.evaluatorName,
                    style: "infoText",
                  },
                  {
                    text: evaluationResult.evaluatorPosition,
                    style: "infoSubText",
                  },
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
          {
            text: "Puntuación Final",
            style: "subheader",
            alignment: "center",
          },
          this.pdfGeneratorS.createTag(
            evaluationResult.finalScoreFormatted,
            "scoreTag",
            getScoreTagColor(),
          ),
          {
            text: `Promedio: ${evaluationResult.finalScore.toFixed(2)} / 5.00`,
            style: "scoreAverage",
            alignment: "center",
          },
        ],
        margin: [0, 10, 0, 20],
      },
      {
        text: "Resumen de Desempeóo por Categoróa",
        style: "subheader",
        margin: [0, 10, 0, 5],
      },
      {
        table: {
          widths: ["*", "auto"],
          dontBreakRows: true,
          body: evaluationResult.categories.map((cat: any) => [
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
        {
          stack: page1Stack,
          pageBreak: "after",
        },
        { text: "Detalle por Categoróas", style: "sectionHeader" },
        ...evaluationResult.categories.map((category: any) => ({
          ...categoriesContent(category),
          unbreakable: true,
        })),
      ],
    };
  }
}









