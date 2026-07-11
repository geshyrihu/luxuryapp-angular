import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  input,
  signal,
  untracked,
} from "@angular/core";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { EspejoAspelExtraordinarios } from "../../presupuesto-web-aspel/espejo-aspel-extraordinarios";
import { PresupuestoWebAspelService } from "../../presupuesto-web-aspel/presupuesto-web-aspel.service";

@Component({
  selector: "app-cedula-extraordinaria-cliente",
  imports: [CommonModule, EspejoAspelExtraordinarios],
  providers: [PresupuestoWebAspelService],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./cedula-extraordinaria-cliente.html",
})
export class CedulaExtraordinariaClienteComponent {
  private aspelSharedS = inject(PresupuestoWebAspelService);
  private customerIdS = inject(CustomerIdService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  showEspejo = signal<boolean>(true);

  constructor() {
    effect(
      () => {
        const selectedYear = this.year();
        const cid = this.customerId();

        if (selectedYear) {
          this.aspelSharedS.intYear.set(selectedYear);
        }

        if (cid) {
          this.customerIdS.setCustomerId(cid).subscribe();
        }

        // Forzar la recreación del componente para limpiar su estado y hacer fetch de nuevo
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
