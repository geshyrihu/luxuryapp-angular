import { Injectable, inject } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

@Injectable({
  providedIn: "root",
})
export class TicketAnalysisService {
  private apiResponseS = inject(ApiResponseService);

  analyzeImage(file: File, prompt: string = ""): Promise<string | false> {
    const formData = new FormData();
    formData.append("file", file);
    if (prompt) {
      formData.append("prompt", prompt);
    }

    // Usamos onPostFile del servicio base para manejar errores y loaders estandarizados
    return this.apiResponseS.onPostFile<string>(
      Endpoints.TicketAnalysis.analyzeImage,
      formData,
    );
  }
}
