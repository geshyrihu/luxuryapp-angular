import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ContratosVigentesModal } from "../contratos-vigentes-modal/contratos-vigentes-modal";
import type { ContratosPorVencerResumenDto } from "./contratos-card.model";

@Component({
  selector: "app-contratos-card",
  templateUrl: "./contratos-card.html",
  imports: [AppIcon, WebButtonLabel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .text-ds-warning {
        color: var(--ds-warning);
      }
      .text-ds-success {
        color: var(--ds-success);
      }
    `,
  ],
})
export class ContratosCard implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  resumen = signal<ContratosPorVencerResumenDto | null>(null);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargar();
  }

  abrirVigentes(): void {
    this.dialogHandlerS.openDialog(
      ContratosVigentesModal,
      null,
      "Contratos vigentes por cliente",
      DialogSize.lg,
    );
  }

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data =
      await this.apiResponseS.onGetItem<ContratosPorVencerResumenDto>(
        "direccion-dashboard/contratos-por-vencer",
        false,
      );
    this.resumen.set(data ?? null);
    this.cargando.set(false);
  }
}
