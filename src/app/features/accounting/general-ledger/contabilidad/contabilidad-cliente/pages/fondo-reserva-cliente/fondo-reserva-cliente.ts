import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { AppIcon } from '@ui/shared/app-icon/app-icon.component';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';
import { IFondoReservaDTO } from '../../../contabilidad-online/models/aspel-budget.interface';

@Component({
  selector: 'app-fondo-reserva-cliente',
  imports: [CommonModule, SkeletonModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './fondo-reserva-cliente.html',
})
export class FondoReservaClienteComponent {
  private svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  data = signal<IFondoReservaDTO | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        const cid = this.customerId();
        const yr = this.year();
        const m = this.mes();

        if (cid && yr && m) {
          this.loadData(cid, yr, m);
        }
      },
      { allowSignalWrites: true }
    );
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.svc.getFondoReserva(customerId, year, mes);
    if (result) {
      this.data.set(result);
    }
    
    this.loading.set(false);
  }

  cleanName(name: string): string {
    if (!name) return '';
    // Elimina la palabra CTA., No. y cualquier numero para limpiar la cuenta
    let cleaned = name.replace(/CTA\.?\s*No\.?/gi, '').replace(/[0-9-]/g, '').trim();
    if (cleaned.length === 0) return 'CUENTA BANCARIA';
    return cleaned;
  }
}

