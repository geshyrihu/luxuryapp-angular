import { Injectable } from "@angular/core";
import { IFilterTicket } from "src/app/core/interfaces/filter-ticket.interface";
@Injectable({
  providedIn: "root",
})
export class ReportService {
  data: any[] = [];
  dateGrafico: any[] = [];
  customerId: string;
  operationReportfFilter: IFilterTicket;
  minutaId: any = 0;

  dataReport: any[] = [];

  getCustomerId() {
    return this.customerId;
  }
  setCustomerId(id: string) {
    this.customerId = id;
  }
  getDataOperationReport() {
    return this.operationReportfFilter;
  }
  setDataOperationReport(model: IFilterTicket) {
    this.operationReportfFilter = model;
  }
  setDataGrafico(model: any) {
    this.dateGrafico = model;
  }

  setIdMinuta(id: any) {
    this.minutaId = id;
  }
  getIdMinuta() {
    return this.minutaId;
  }
  getDateGrafico() {
    return this.dateGrafico;
  }
}









