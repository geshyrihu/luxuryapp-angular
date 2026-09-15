import { inject, Injectable } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { AiTestResultDto } from "./interfaces/ai-test-result.interface";

@Injectable({
  providedIn: "root",
})
export class IaTestService {
  private apiResponseS = inject(ApiResponseService);

  testProfile(profileName: string, prompt: string) {
    return this.apiResponseS.onGetItem<AiTestResultDto>(
      `${Endpoints.AiAssistant.testProfile}?profileName=${profileName}&prompt=${prompt}`,
    );
  }
}

