import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Endpoints } from 'src/app/core/constants/endpoints';
import { reportFilterState } from '../../state/financial-report-filter.state';
import { IFondoReservaDTO } from '../../models/aspel-budget.interface';
import { SkeletonModule } from 'primeng/skeleton';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { ApiResponseService } from 'src/app/core/services/api-response.service';

@Component({
  selector: 'app-fondo-reserva',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './fondo-reserva.html',
})
export class FondoReservaComponent {
  private apiS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private filters = reportFilterState;

  data = signal<IFondoReservaDTO | null>(null);
  loading = signal<boolean>(false);

  constructor() {
    effect(
      () => {
        const customerId = this.customerIdS.customerId();
        const year = this.filters.year();
        this.filters.refreshTick();
        const mesIdx = this.filters.mesIdx();

        if (customerId && year && mesIdx >= 0) {
          this.loadData(customerId, year, mesIdx + 1);
        }
      },
      { allowSignalWrites: true }
    );
  }

  private async loadData(customerId: string, year: number, mes: number) {
    this.loading.set(true);
    this.data.set(null);

    const url = Endpoints.ContabilidadOnline.FinancialStatements.fondoReserva(
      customerId,
      year,
      mes
    );
    
    const result = await this.apiS.onGetItem<IFondoReservaDTO>(url);
    if (result) {
      this.data.set(result);
      this.filters.currentReportName.set("Fondo de Reserva");
      this.filters.currentReportContext.set(JSON.stringify(result));
    }
    
    this.loading.set(false);
  }
}
