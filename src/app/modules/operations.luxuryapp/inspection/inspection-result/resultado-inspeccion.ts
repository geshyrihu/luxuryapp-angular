import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { filter, from, map, switchMap } from "rxjs";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { InspectionResultDTO } from "../models/inspection.model";
import { InspeccionPdfService } from "../inspeccion-pdf.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-resultado-inspeccion",
  templateUrl: "./resultado-inspeccion.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppIcon, WebButtonIcon, LxTooltipDirective],
})
export class ResultadoInspeccion {
  apiResponseS = inject(ApiResponseService);
  activatedRoute = inject(ActivatedRoute);
  inspeccionPdfS = inject(InspeccionPdfService);

  private readonly params$ = this.activatedRoute.params;

  readonly id = toSignal(
    this.params$.pipe(map((params) => params["id"] as string)),
    { initialValue: "" },
  );

  readonly data = toSignal(
    this.params$.pipe(
      map((params) => params["id"] as string),
      filter((id) => !!id),
      switchMap((id) =>
        from(
          this.apiResponseS.onGetList<InspectionResultDTO>(
            Endpoints.InspectionResults.report(id),
          ),
        ),
      ),
    ),
    { initialValue: null },
  );

  onExportPDF(): void {
    this.inspeccionPdfS.generarReporte(this.data(), `Inspeccion_${this.id()}`);
  }
}
