import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { CustomButton } from "src/app/core/components/web/buttons";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

@Component({
  selector: "app-implementation-tracking-manual",

  imports: [CommonModule, CustomButton],
  template: `
    <div class="card p-4">
      <h2 class="text-2xl font-bold mb-4">
        Verificación Manual: Reporte de Empleados
      </h2>
      <p class="mb-4 text-color-secondary">
        Al presionar el botón a continuación, se encolará un trabajo en segundo
        plano para revisar los datos faltantes de los empleados activos y se
        enviará un reporte al administrador correspondiente (configurado
        internamente).
      </p>

      <custom-button
        label="Ejecutar Validación de Empleados"
        iconClass="mdi:send"
        severity="primary"
        [loading]="loading()"
        (clicked)="triggerReport()"
      />
    </div>
  `,
})
export class AppImplementationTrackingManual {
  private apiResponseS = inject(ApiResponseService);
  private customToastS = inject(CustomToastService);

  loading = signal(false);

  triggerReport() {
    this.loading.set(true);
    this.apiResponseS
      .onPost(Endpoints.AppImplementationTracking.triggerEmployeeValidation, {})
      .then((res: any) => {
        this.loading.set(false);
      })
      .catch((err) => {
        this.loading.set(false);
      });
  }
}

