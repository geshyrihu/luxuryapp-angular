import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AiKnowledgeBaseDto } from "src/app/core/interfaces/ai-knowledge-base.dto";
import { ApiResponse } from "src/app/core/interfaces/api-response.dto";
import { environment } from "src/environments/environment";
import { Endpoints } from "src/app/core/constants/endpoints";

@Injectable({
  providedIn: "root",
})
export class AiKnowledgeBaseService {
  private baseUrl = `${environment.API_BASE_URL}${Endpoints.AiKnowledgeBase.base}`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ApiResponse<AiKnowledgeBaseDto[]>> {
    return this.http.get<ApiResponse<AiKnowledgeBaseDto[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ApiResponse<AiKnowledgeBaseDto>> {
    return this.http.get<ApiResponse<AiKnowledgeBaseDto>>(
      `${this.baseUrl}/${id}`,
    );
  }

  create(data: AiKnowledgeBaseDto): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.baseUrl, data);
  }

  update(data: AiKnowledgeBaseDto): Observable<ApiResponse<boolean>> {
    return this.http.put<ApiResponse<boolean>>(this.baseUrl, data);
  }

  delete(id: string): Observable<ApiResponse<boolean>> {
    return this.http.delete<ApiResponse<boolean>>(`${this.baseUrl}/${id}`);
  }
}









