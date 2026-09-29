import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { ROUTES } from "src/app/routing/route-paths";

interface InspectionQrResolve {
  equipmentName: string;
  equipmentLocation: string | null;
  inspectionName: string | null;
  inspectionExecutionId: string | null;
}

@Component({
  selector: "app-inspection-qr-entry",
  templateUrl: "./inspection-qr-entry.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [],
})
export class InspectionQrEntry implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiResponseS = inject(ApiResponseService);

  loading = signal(true);
  error = signal("");
  context = signal<InspectionQrResolve | null>(null);

  ngOnInit(): void {
    const code = this.route.snapshot.paramMap.get("code");
    if (!code) {
      this.error.set("No se recibió un código QR válido.");
      this.loading.set(false);
      return;
    }

    this.apiResponseS
      .onGetItem<InspectionQrResolve>(Endpoints.InspectionQrLabels.resolve(code))
      .then((result) => {
        if (!result) this.error.set("No fue posible resolver el QR del equipo.");
        else this.context.set(result);
      })
      .finally(() => this.loading.set(false));
  }

  onBack(): void {
    this.router.navigate(ROUTES.INVENTARIOS.EQUIPOS_AREAS);
  }

  onOpenExecution(): void {
    const executionId = this.context()?.inspectionExecutionId;
    if (executionId) this.router.navigate(["/inspections/result", executionId]);
  }
}
