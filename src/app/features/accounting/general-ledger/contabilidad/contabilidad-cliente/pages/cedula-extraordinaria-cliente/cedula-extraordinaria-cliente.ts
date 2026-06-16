import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, untracked, signal } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { EspejoAspelExtraordinarios } from '../../../presupuesto-web-aspel/espejo-aspel-extraordinarios';
import { PresupuestoWebAspelService } from '../../../presupuesto-web-aspel/presupuesto-web-aspel.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';

@Component({
  selector: 'app-cedula-extraordinaria-cliente',
  imports: [CommonModule, EspejoAspelExtraordinarios, SkeletonModule],
  providers: [PresupuestoWebAspelService],
  templateUrl: './cedula-extraordinaria-cliente.html',
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
