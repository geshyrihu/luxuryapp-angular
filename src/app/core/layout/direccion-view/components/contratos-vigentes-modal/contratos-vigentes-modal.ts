import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { TagModule } from "primeng/tag";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import type {
  ContratosVigentesCustomerGroupDto,
  ContratosVigentesResumenDto,
} from "../contratos-card/contratos-card.model";

@Component({
  selector: "app-contratos-vigentes-modal",
  templateUrl: "./contratos-vigentes-modal.html",
  imports: [TagModule, LxTooltipDirective, AppIcon],
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
export class ContratosVigentesModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);

  resumen = signal<ContratosVigentesResumenDto | null>(null);
  cargando = signal<boolean>(false);

  expandidos = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.cargar();
  }

  toggleCliente(customerName: string): void {
    const s = new Set(this.expandidos());
    s.has(customerName) ? s.delete(customerName) : s.add(customerName);
    this.expandidos.set(s);
  }

  estaExpandido(customerName: string): boolean {
    return this.expandidos().has(customerName);
  }

  formatFecha(iso: string | null): string {
    if (!iso) return "Indefinido";
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  getSeverity(
    c: ContratosVigentesCustomerGroupDto["contratos"][0],
  ): "danger" | "warn" | "success" {
    if (!c.diasRestantes) return "success";
    if (c.diasRestantes <= 30) return "danger";
    if (c.diasRestantes <= 60) return "warn";
    return "success";
  }

  private async cargar(): Promise<void> {
    this.cargando.set(true);
    const data = await this.apiResponseS.onGetItem<ContratosVigentesResumenDto>(
      Endpoints.DireccionDashboard.contratosVigentes,
      false,
    );
    this.resumen.set(data ?? null);
    // Expandir el primer cliente por defecto
    if (data?.customers?.length) {
      this.expandidos.set(new Set([data.customers[0].customerName]));
    }
    this.cargando.set(false);
  }
}
