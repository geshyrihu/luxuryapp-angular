import { Injectable, inject } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface AskAccountingAiDTO {
  reportData: string;
  userQuery: string;
}

@Injectable({ providedIn: "root" })
export class ContabilidadAiService {
  private apiS = inject(ApiResponseService);

  async askAi(reportData: string, userQuery: string): Promise<string> {
    const payload: AskAccountingAiDTO = { reportData, userQuery };
    const url = `contabilidad-online/ask-ai`;

    // Obteniendo respuesta en formato T directamente (o false si falla)
    const response = await this.apiS.onPost<string>(url, payload);
    return response || "No se recibié respuesta de la IA.";
  }
}
