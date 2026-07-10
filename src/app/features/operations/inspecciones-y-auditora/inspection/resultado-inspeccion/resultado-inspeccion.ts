import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { InspeccionPdfService } from "../inspeccion-pdf.service";

import { WebButtonIcon } from "@ui/buttons/web-icon/button";

@Component({
  selector: "app-resultado-inspeccion",
  templateUrl: "./resultado-inspeccion.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonIcon, TooltipModule],
})
export class ResultadoInspeccion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  activatedRoute = inject(ActivatedRoute);
  inspeccionPdfS = inject(InspeccionPdfService);

  data: any = null;
  id: string = "";

  private paramsSignal = toSignal(this.activatedRoute.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params) {
        this.id = params["id"];
        this.onLoadData(this.id);
      }
    });
  }

  ngOnInit(): void {}

  onLoadData(inspectionResultId: string): void {
    this.apiResponseS
      .onGetList(Endpoints.InspectionResults.report(inspectionResultId))
      .then((result: any) => {
        this.data = result;
      });
  }

  onExportPDF(): void {
    this.inspeccionPdfS.generarReporte(this.data, `Inspeccion_${this.id}`);
  }
}
