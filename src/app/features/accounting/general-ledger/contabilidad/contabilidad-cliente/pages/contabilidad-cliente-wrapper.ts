import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { TabsModule } from 'primeng/tabs';
import { EpfClienteComponent } from './epf-cliente/epf-cliente';
import { EstadoResultadosClienteComponent } from './estado-resultados-cliente/estado-resultados-cliente';
import { EstadoResultadosV2ClienteComponent } from './estado-resultados-v2-cliente/estado-resultados-v2-cliente';
import { CedulaExtraordinariaClienteComponent } from './cedula-extraordinaria-cliente/cedula-extraordinaria-cliente';
import { CedulaPresupuestalClienteComponent } from './cedula-presupuestal-cliente/cedula-presupuestal-cliente';
import { ReporteFinancieroClienteComponent } from './reporte-financiero-cliente/reporte-financiero-cliente';
import { FlujoEfectivoClienteComponent } from './flujo-efectivo-cliente/flujo-efectivo-cliente';
import { AnalisisCobranzaClienteComponent } from './analisis-cobranza-cliente/analisis-cobranza-cliente';
import { PresupuestoContabilidadClienteComponent } from './presupuesto-contabilidad-cliente/presupuesto-contabilidad-cliente';
import { BancosInversionesClienteComponent } from './bancos-inversiones-cliente/bancos-inversiones-cliente';
import { FondoReservaClienteComponent } from './fondo-reserva-cliente/fondo-reserva-cliente';
import { ProyectosAprobadosClienteComponent } from './proyectos-aprobados-cliente/proyectos-aprobados-cliente';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

@Component({
  selector: 'app-contabilidad-cliente-wrapper',
  imports: [
    CommonModule,
    TabsModule,
    EpfClienteComponent,
    EstadoResultadosClienteComponent,
    EstadoResultadosV2ClienteComponent,
    CedulaExtraordinariaClienteComponent,
    CedulaPresupuestalClienteComponent,
    ReporteFinancieroClienteComponent,
    FlujoEfectivoClienteComponent,
    AnalisisCobranzaClienteComponent,
    PresupuestoContabilidadClienteComponent,
    BancosInversionesClienteComponent,
    FondoReservaClienteComponent,
    ProyectosAprobadosClienteComponent,
   AppIcon],
  templateUrl: './contabilidad-cliente-wrapper.html',
})
export default class ContabilidadClienteWrapper {
  private readonly route = inject(ActivatedRoute);

  readonly customerId = toSignal(
    this.route.paramMap.pipe(map(p => p.get('customerId') ?? '')),
    { initialValue: '' },
  );

  readonly year = toSignal(
    this.route.paramMap.pipe(map(p => +(p.get('anio') ?? 0))),
    { initialValue: 0 },
  );

  readonly mes = toSignal(
    this.route.paramMap.pipe(map(p => +(p.get('mes') ?? 0))),
    { initialValue: 0 },
  );

  readonly periodo = computed(() => {
    const yr = this.year();
    const m = this.mes();
    if (!yr || !m) return '';
    return `${MONTH_NAMES[m - 1]} ${yr}`;
  });

  readonly tabIndex = signal(0);

  onTabChange(idx: number) {
    this.tabIndex.set(idx);
  }
}
