import { CommonModule, JsonPipe } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CardModule } from "primeng/card";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

@Component({
  selector: "app-update-data-base",
  templateUrl: "./update-data-base.html",
  imports: [CommonModule, CardModule],
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
        `accounting-coi/migration/aspel-sync/${customerId}/ejercicio/${year}/completo`,
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
          "La migración general de COI Contabilidad falló.",
        );
        this.loading.set(false);
      });
  }
}
