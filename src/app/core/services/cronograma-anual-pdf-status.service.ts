import { Injectable } from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CronogramaAnualPdfStatus } from "src/app/modules/operations.luxuryapp/google-calendar/calendar/mantenimiento-preventivo/interfaces/CronogramaAnualPdfStatus";

@Injectable({
  providedIn: "root",
})
export class CronogramaAnualPdfStatusService {
  constructor(private apiResponseS: ApiResponseService) {}

  async getPdfStatus(
    customerId: string,
    filterId?: number,
    year?: number,
  ): Promise<CronogramaAnualPdfStatus[] | null> {
    const params = new URLSearchParams();
    if (year) params.set("year", String(year));
    if (filterId) params.set("filterId", String(filterId));
    const qs = params.toString();
    const url = `maintenance-calendars/cronograma-anual-pdf-status/${customerId}${qs ? "?" + qs : ""}`;

    return this.apiResponseS.onGetItem<CronogramaAnualPdfStatus[]>(url);
  }
}
