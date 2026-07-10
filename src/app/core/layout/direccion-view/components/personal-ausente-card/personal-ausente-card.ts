import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { PersonalAusenteResumenDTO } from "./personal-ausente-card.model";

@Component({
  selector: "app-personal-ausente-card",
  templateUrl: "./personal-ausente-card.html",
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: [
    `
      .text-ds-warning {
        color: var(--ds-warning);
      }
      .text-ds-info {
        color: var(--ds-info);
      }
    `,
  ],
})
export class PersonalAusenteCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  resumen = signal<PersonalAusenteResumenDTO | null>(null);
  cargando = signal<boolean>(false);

  total = computed(() => {
    const r = this.resumen();
    return r ? r.totalPermisos + r.totalVacaciones : 0;
  });

  ngOnInit(): void {
    this.cargar();
  }

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
    });
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<PersonalAusenteResumenDTO>(
      "direccion-dashboard/personal-ausente",
      false,
    );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
