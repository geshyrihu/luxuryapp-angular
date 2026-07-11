import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from "@angular/core";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EspejoAspelExtraordinarios } from "../../../presupuesto-web-aspel/espejo-aspel-extraordinarios";
import { PresupuestoWebAspelService } from "../../../presupuesto-web-aspel/presupuesto-web-aspel.service";
import { reportFilterState } from "../../state/financial-report-filter.state";

@Component({
  selector: "app-cedula-extraordinaria",
  imports: [CommonModule, EspejoAspelExtraordinarios, LxSkeleton],
  providers: [PresupuestoWebAspelService],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./cedula-extraordinaria.html",
})
export class CedulaExtraordinaria {
  public filterS = reportFilterState;
  private aspelSharedS = inject(PresupuestoWebAspelService);
  private customerIdS = inject(CustomerIdService);

  showEspejo = signal<boolean>(true);

  constructor() {
    effect(
      () => {
        const selectedYear = this.filterS.year();
        const cid = this.customerIdS.customerId();
        const tick = this.filterS.refreshTick();

        if (selectedYear) {
          this.aspelSharedS.intYear.set(selectedYear);
        }

        // Forzar la destrucción y recreación del componente para garantizar que su estado se limpie
        // y vuelva a hacer el fetch desde cero con el nuevo cliente.
        untracked(() => {
          this.showEspejo.set(false);
          setTimeout(() => {
            this.showEspejo.set(true);
          }, 50);
        });
      },
      { allowSignalWrites: true },
    );
  }
}
