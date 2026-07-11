import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { TableModule } from 'primeng/table';
import { AppIcon } from '@ui/shared/app-icon/app-icon.component';
import { ContabilidadClienteService } from '../contabilidad-cliente.service';
import { IBancosInversionesDto } from '../../contabilidad-online/interfaces/aspel-budget.interface';

@Component({
  selector: 'app-bancos-inversiones-cliente',
  imports: [CommonModule, LxSkeleton, TableModule, AppIcon],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './bancos-inversiones-cliente.html',
})
export class BancosInversionesClienteComponent {
  private svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  data = signal<IBancosInversionesDto | null>(null);
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

    const result = await this.svc.getBancosInversiones(customerId, year, mes);
    if (result) {
      this.data.set(result);
    }
    
    this.loading.set(false);
  }
}

