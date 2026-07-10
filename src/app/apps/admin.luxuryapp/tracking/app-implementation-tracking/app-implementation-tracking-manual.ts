import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";

@Component({
  selector: "app-implementation-tracking-manual",

  imports: [CommonModule, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <div class="card p-4">
      <h2 class="text-2xl font-bold mb-4">
        Verificación Manual: Reporte de Empleados
      </h2>
      <p class="mb-4 text-color-secondary">
        Al presionar el botún a continuación, se encolaré un trabajo en segundo
        plano para revisar los datos faltantes de los empleados activos y se
        enviaré un reporte al administrador correspondiente (configurado
        internamente).
      </p>

      <il-button
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
