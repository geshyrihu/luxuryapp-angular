import { Injectable, inject } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
@Injectable({
  providedIn: "root",
})
export class AiService {
  private apiResponseService = inject(ApiResponseService);

  async generateAnnouncementDraft(
    prompt: string,
    tone: string = "Formal",
  ): Promise<string> {
    try {
      const response = await this.apiResponseService.onPostNotLoading<string>(
        Endpoints.Announcements.generateDraft,
        {
          prompt,
          tone,
        },
      );

      if (response === false) {
        throw new Error("Error al generar el borrador.");
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async generateOfficialAnnouncementDraft(
    idea: string,
    buildingName: string,
  ): Promise<{
    title: string;
    greeting: string;
    body: string;
    callToAction: string;
  }> {
    try {
      const response = await this.apiResponseService.onPostNotLoading<any>(
        Endpoints.Announcements.generateOfficialDraft,
        {
          idea,
          buildingName,
        },
      );

      if (response === false) {
        throw new Error("Error al generar el comunicado oficial.");
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async generateImage(prompt: string): Promise<Blob> {
    try {
      const response = await this.apiResponseService.onPostBlob(
        Endpoints.AiAssistant.generateImage,
        { prompt },
      );

      if (!response) {
        throw new Error("Error al generar imagen");
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async analyzeFinancialData(
    context: string,
    tone: string = "Profesional",
  ): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.Presupuestos.analyze,
      {
        context,
        tone,
      },
    );

    if (response === false) {
      throw new Error("Error al analizar los datos financieros.");
    }

    return response;
  }

  async analyzeDashboard(
    context: string,
    customerId: string,
    tone: string = "Ejecutivo",
  ): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.Dashboard.analyze,
      {
        context,
        tone,
        customerId,
      },
    );

    if (response === false) {
      throw new Error("Error al generar el informe del dashboard.");
    }

    return response;
  }

  async auditBudget(
    context: string,
    tone: string = "Auditor Estricto",
  ): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.BudgetingProposal.audit,
      {
        context,
        tone,
      },
    );

    if (response === false) {
      throw new Error("Error al auditar la propuesta.");
    }

    return response;
  }

  async getBudgetForecast(
    context: string,
    inflationRate: number = 5,
  ): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.BudgetingProposal.forecast,
      {
        context,
        inflationRate,
      },
    );

    if (response === false) {
      throw new Error("Error al generar proyección.");
    }

    return response;
  }

  async generateJobDescription(
    jobTitle: string,
    customInstructions: string = "",
  ): Promise<any> {
    const response = await this.apiResponseService.onPostNotLoading<any>(
      Endpoints.JobDescriptions.generateProposal,
      {
        jobTitle,
        tone: "Profesional",
        customInstructions,
      },
    );

    if (response === false) {
      throw new Error("Error al generar descripción del puesto.");
    }

    return response;
  }

  async analyzeJobDescription(
    description: string,
    jobTitle: string,
  ): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.JobDescriptions.analyze,
      {
        description,
        jobTitle,
      },
    );

    if (response === false) {
      throw new Error("Error al analizar la descripción.");
    }

    return response;
  }

  async consultDocument(documentId: string, query: string): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.CustomDocuments.consultWithAi,
      {
        documentId,
        query,
      },
    );

    if (response === false) {
      throw new Error("Error al consultar el documento.");
    }

    return response;
  }

  async analyzeComparativeChart(solicitudCompraId: any): Promise<string> {
    const response = await this.apiResponseService.onPostNotLoading<string>(
      Endpoints.PurchaseRequests.analyzeComparativeChart(solicitudCompraId),
      {},
    );

    if (response === false) {
      throw new Error("Error al analizar el cuadro comparativo.");
    }

    return response;
  }
}
