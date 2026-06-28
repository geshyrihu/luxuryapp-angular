import { Component, effect, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { AppIcon } from 'src/app/core/components/shared/app-icon/app-icon.component';
import { ContabilidadClienteService } from '../../services/contabilidad-cliente.service';
import { IProyectosAprobadosDTO } from '../../../contabilidad-online/models/aspel-budget.interface';

@Component({
  selector: 'app-proyectos-aprobados-cliente',
  imports: [CommonModule, SkeletonModule, TableModule, AppIcon],
  templateUrl: './proyectos-aprobados-cliente.html',
})
export class ProyectosAprobadosClienteComponent {
  private svc = inject(ContabilidadClienteService);

  readonly customerId = input.required<string>();
  readonly year = input.required<number>();
  readonly mes = input.required<number>();

  data = signal<IProyectosAprobadosDTO | null>(null);
  loading = signal<boolean>(false);

  public mesesNombres = [
    "Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
  ];

  constructor() {
    effect(
      () => {
        const cid = this.customerId();
        const yr = this.year();

        if (cid && yr) {
          this.loadData(cid, yr);
        }
      },
      { allowSignalWrites: true }
    );
  }

  private async loadData(customerId: string, year: number) {
    this.loading.set(true);
    this.data.set(null);

    const result = await this.svc.getProyectosAprobados(customerId, year);
    if (result) {
      this.data.set(result);
    }
    
    this.loading.set(false);
  }
}

