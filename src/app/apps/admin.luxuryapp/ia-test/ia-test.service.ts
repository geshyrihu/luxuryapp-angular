import { inject, Injectable } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";

export interface AiTestResultDTO {
  profile: string;
  response: string;
}

@Injectable({
  providedIn: "root",
})
export class IaTestService {
  private apiResponseS = inject(ApiResponseService);

  testProfile(profileName: string, prompt: string) {
    return this.apiResponseS.onGetItem<AiTestResultDTO>(
      `${Endpoints.AiAssistant.testProfile}?profileName=${profileName}&prompt=${prompt}`,
    );
  }
}
