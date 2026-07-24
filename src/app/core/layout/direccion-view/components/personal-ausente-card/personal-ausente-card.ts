import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import type { PersonalAusenteResumenDto } from "./personal-ausente-card.model";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-personal-ausente-card",
  templateUrl: "./personal-ausente-card.html",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  resumen = signal<PersonalAusenteResumenDto | null>(null);
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
    const data = await this.apiResponseS.onGetItem<PersonalAusenteResumenDto>(
      Endpoints.DireccionDashboard.personalAusente,
      false,
    );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
