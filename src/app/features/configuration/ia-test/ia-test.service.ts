import { inject, Injectable } from '@angular/core';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { Endpoints } from 'src/app/core/constants/endpoints';

export interface AiTestResultDTO {
  profile: string;
  response: string;
}

@Injectable({
  providedIn: 'root'
})
export class IaTestService {
  private apiResponseS = inject(ApiResponseService);

  testProfile(profileName: string, prompt: string) {
    return this.apiResponseS.onGetItem<AiTestResultDTO>(
      `${Endpoints.AiAssistant.testProfile}?profileName=${profileName}&prompt=${prompt}`
    );
  }
}
