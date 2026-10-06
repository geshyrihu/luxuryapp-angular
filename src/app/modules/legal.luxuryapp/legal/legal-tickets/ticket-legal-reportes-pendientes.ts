import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { PlatformService } from "@core/services/platform.service";
import { LxEmptyState } from "@ui/adaptive/empty-state/empty-state";
import { PageTitleReport } from "@ui/web/title-page-report/page-title-report";
import { TicketLegalReportesPendientesDesktop } from "./desktop/ticket-legal-reportes-pendientes-desktop";
import { TicketLegalReportesPendientesMobile } from "./mobile/ticket-legal-reportes-pendientes-mobile";

@Component({
  selector: "app-ticket-legal-reportes-pendientes",
  templateUrl: "./ticket-legal-reportes-pendientes.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxEmptyState,
    PageTitleReport,
    TicketLegalReportesPendientesDesktop,
    TicketLegalReportesPendientesMobile],
})
export class TicketLegalReportesPendientes implements OnInit {
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  dataExternal = signal<any[]>([]);
  dataInternal = signal<any[]>([]);
  unassignedData = signal<any[]>([]);

  ngOnInit(): void {
    this.onLoadDataExternal();
    this.onLoadDataInternal();
    this.onLoadUnassignedData();
  }

  onLoadDataExternal() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(false))
      .then((result: any) => {
        this.dataExternal.set(result ?? []);
      });
  }
  onLoadDataInternal() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(true))
      .then((result: any) => {
        this.dataInternal.set(result ?? []);
      });
  }
  onLoadUnassignedData() {
    this.apiResponseS
      .onGetList(Endpoints.Tasks.legalPending(undefined, true))
      .then((result: any) => {
        this.unassignedData.set(result ?? []);
      });
  }
}
