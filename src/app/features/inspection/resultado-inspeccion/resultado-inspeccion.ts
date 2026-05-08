import { Component, effect, inject, OnInit } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
@Component({
  selector: "app-resultado-inspeccion",
  templateUrl: "./resultado-inspeccion.html",
  imports: [CustomButton, TooltipModule],
})
export class ResultadoInspeccion implements OnInit {
  apiResponseS = inject(ApiResponseService);
  activatedRoute = inject(ActivatedRoute);
  // Declaración e inicialización de variables
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

  ngOnInit(): void {
    // Logic moved to effect
  }

  onLoadData(inspectionResultId: string): void {
    this.apiResponseS.onGetList(Endpoints.InspectionResults.report(inspectionResultId)).then((result: any) => {
      this.data = result;
    });
  }
  onExportPDF() {
    const nameDocument = `Inspección_${this.id}.pdf`; // Nombre del archivo

    this.apiResponseS.onDownloadFile(
      Endpoints.InspectionResults.exportPdf(this.id),
      nameDocument,
    );
  }
}









