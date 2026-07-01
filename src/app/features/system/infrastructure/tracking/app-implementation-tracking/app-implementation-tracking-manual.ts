import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

@Component({
  selector: "app-implementation-tracking-manual",

  imports: [CommonModule, WebButtonLabel],
  template: `
    <div class="card p-4">
      <h2 class="text-2xl font-bold mb-4">
        Verificaci�n Manual: Reporte de Empleados
      </h2>
      <p class="mb-4 text-color-secondary">
        Al presionar el bot�n a continuaci�n, se encolar� un trabajo en segundo
        plano para revisar los datos faltantes de los empleados activos y se
        enviar� un reporte al administrador correspondiente (configurado
        internamente).
      </p>

      <il-button
        label="Ejecutar Validaci�n de Empleados"
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
