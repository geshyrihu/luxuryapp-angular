import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

@Component({
  selector: "app-update-data-base",
  templateUrl: "./update-data-base.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxCard],
})
export class UpdateDataBase {
  apiResponseS = inject(ApiResponseService);
  customToastS = inject(CustomToastService);
  loading = signal(false);
  result = signal<any>(null);
  serviceOrderId = signal<string>("");

  runMigrateCoiAspel() {
    this.loading.set(true);
    this.result.set(null);
    this.customToastS.showInfo(
      "Iniciando Migración Masiva de ASPEL COI...",
      "Espere, esto puede tardar un poco.",
    );

    const customerId = "019c6bee-0305-7fbd-80e9-91ca348f903c";
    const year = 2025;

    // Usamos el endpoint unificado de migración COI
    this.apiResponseS
      .onPost(
        Endpoints.AccountingCoi.Configuration.AspelSync.completo(
          customerId,
          year,
        ),
        {},
      )
      .then((res: any) => {
        this.result.set(res);
        this.customToastS.showSuccess(
          "óxito",
          res.message || "Migración COI completada.",
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.result.set(err.error || err);
        this.customToastS.showError(
          "Error",
          "La migración general de COI Contabilidad fallé.",
        );
        this.loading.set(false);
      });
  }

  runImportAsambleaChecklistCatalog() {
    this.loading.set(true);
    this.result.set(null);
    this.customToastS.showInfo(
      "Importando checklist de asamblea...",
      "Se insertaran solo los items faltantes del catalogo.",
    );

    this.apiResponseS
      .onPost(Endpoints.UpdateDataBase.importAsambleaChecklist, {})
      .then((res: any) => {
        this.result.set(res);
        this.customToastS.showSuccess(
          "Exito",
          res?.message || "Catalogo de checklist de asamblea importado.",
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.result.set(err.error || err);
        this.customToastS.showError(
          "Error",
          "La importacion del checklist de asamblea fallo.",
        );
        this.loading.set(false);
      });
  }

  runBackfillAgendaEventsFromMeetings() {
    this.loading.set(true);
    this.result.set(null);
    this.customToastS.showInfo(
      "Generando agenda historica desde minutas...",
      "Ejecuta este paso despues de recuperar las horas historicas de las juntas.",
    );

    this.apiResponseS
      .onPost(Endpoints.UpdateDataBase.backfillAgendaEvents, {})
      .then((res: any) => {
        this.result.set(res);
        this.customToastS.showSuccess(
          "Exito",
          res?.message || "Backfill historico de agenda completado.",
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.result.set(err.error || err);
        this.customToastS.showError(
          "Error",
          "La generacion historica de agenda a partir de minutas fallo.",
        );
        this.loading.set(false);
      });
  }

  runBackfillHistoricalMeetingTimes() {
    this.loading.set(true);
    this.result.set(null);
    this.customToastS.showInfo(
      "Recuperando horas historicas de juntas...",
      "Este paso debe ejecutarse antes del backfill de agenda para reconstruir la fecha y hora correctas.",
    );

    this.apiResponseS
      .onPost(Endpoints.UpdateDataBase.backfillHistoricalMeetings, {})
      .then((res: any) => {
        this.result.set(res);
        this.customToastS.showSuccess(
          "Exito",
          res?.message || "Horas historicas de juntas recuperadas.",
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.result.set(err.error || err);
        this.customToastS.showError(
          "Error",
          "La recuperacion historica de horas para juntas fallo.",
        );
        this.loading.set(false);
      });
  }

  runResyncGoogleCalendarEventTimes() {
    this.loading.set(true);
    this.result.set(null);
    this.customToastS.showInfo(
      "Resincronizando horarios en Google Calendar...",
      "Se reenviaran los eventos ya vinculados usando la fecha y hora guardadas en Luxury App.",
    );

    this.apiResponseS
      .onPost(Endpoints.UpdateDataBase.resyncGoogleCalendar, {})
      .then((res: any) => {
        this.result.set(res);
        this.customToastS.showSuccess(
          "Exito",
          res?.message || "Horarios de Google Calendar resincronizados.",
        );
        this.loading.set(false);
      })
      .catch((err) => {
        console.error(err);
        this.result.set(err.error || err);
        this.customToastS.showError(
          "Error",
          "La resincronizacion de horarios de Google Calendar fallo.",
        );
        this.loading.set(false);
      });
  }
}
