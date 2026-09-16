import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiResponse } from '../models/api-response.model';
import { WorkPositionScheduleDto } from '../models/work-position-schedule-dto.model';
import { WorkPositionScheduleForm } from '../models/work-position-schedule-form.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkPositionService {
  private readonly apiUrl = 'api/work-positions';

  constructor(private http: HttpClient) {}

  getById(workPositionId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/${workPositionId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  getSchedule(workPositionId: string): Observable<ApiResponse<WorkPositionScheduleDto>> {
    return this.http.get<ApiResponse<WorkPositionScheduleDto>>(
      `${this.apiUrl}/${workPositionId}/schedule`
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateSchedule(workPositionId: string, payload: WorkPositionScheduleForm): Observable<ApiResponse<WorkPositionScheduleDto>> {
    return this.http.put<ApiResponse<WorkPositionScheduleDto>>(
      `${this.apiUrl}/${workPositionId}/schedule`, 
      payload
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('WorkPositionService error:', error);
    return throwError(() => error);
  }
}