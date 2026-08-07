import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type { VacantesResumenDto } from "./reclutamiento-card.model";

@Component({
  selector: "app-reclutamiento-card",
  templateUrl: "./reclutamiento-card.html",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .text-ds-danger {
        color: var(--ds-danger);
      }
      .text-ds-warning {
        color: var(--ds-warning);
      }
    `,
  ],
})
export class ReclutamientoCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  resumen = signal<VacantesResumenDto | null>(null);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargar();
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<VacantesResumenDto>(
      Endpoints.DireccionDashboard.reclutamientoResumen,
      false,
    );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
