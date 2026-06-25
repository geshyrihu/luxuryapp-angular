import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import type { VacantesResumenDTO } from "./reclutamiento-card.model";

@Component({
  selector: "app-reclutamiento-card",
  templateUrl: "./reclutamiento-card.html",
  imports: [CommonModule],
  styles: [`.text-ds-danger{color:var(--ds-danger)}.text-ds-warning{color:var(--ds-warning)}`],
})
export class ReclutamientoCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  resumen = signal<VacantesResumenDTO | null>(null);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargar();
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<VacantesResumenDTO>(
      "direccion-dashboard/reclutamiento-resumen",
      false,
    );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
