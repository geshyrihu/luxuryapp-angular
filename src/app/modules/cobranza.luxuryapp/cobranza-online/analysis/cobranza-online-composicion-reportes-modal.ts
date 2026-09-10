import { ChangeDetectionStrategy, Component } from "@angular/core";

/**
 * Explica cómo se compone cada uno de los tres bloques del Análisis de Cobranza.
 * Existe porque los bloques miden cosas distintas (flujo del mes vs cartera
 * acumulada) y sus cifras no son comparables entre sí.
 * Reglas de referencia: docs/aspel/ASPEL_API_GUIDE.md.
 */
@Component({
  selector: "app-cobranza-online-composicion-reportes-modal",
  template: `
    <div class="flex flex-column gap-4">
      <section>
        <div class="font-semibold mb-1">Análisis de Cobranza Mensual (Excel)</div>
        <div class="text-color-secondary text-sm mb-2">
          Réplica del reporte histórico. Mide el mes, pero resta saldos acumulados.
        </div>
        <ul class="m-0 pl-4 text-sm line-height-3">
          <li>
            <b>Cobranza perfecta</b> = cargos de mantenimiento del mes + cargos de
            cuota extraordinaria del mes. Es el 100%.
          </li>
          <li><b>Morosos</b> y <b>Deuda corriente</b> = saldo acumulado de esas cuentas al corte.</li>
          <li>
            <b>Cobrado</b> = Cobranza perfecta − Morosos − Deuda corriente.
            Es un <b>residual</b>, no dinero cobrado.
          </li>
          <li>La cobranza judicial queda fuera: son cuentas en litigio.</li>
        </ul>
        <div
          class="border-left-3 border-orange-500 surface-ground p-2 mt-2 text-sm line-height-3"
        >
          <b>Cuidado al leerlo:</b> mezcla un flujo del mes con saldos acumulados. Un
          condómino es moroso por su historial, pero buena parte de su saldo de hoy es
          la cuota del mes recién emitida, así que ese importe se descuenta dos veces.
          Mientras más grande sea la cartera vencida, más se separa del cobro real.
        </div>
      </section>

      <section>
        <div class="font-semibold mb-1">Cobranza del Mes (flujo real)</div>
        <div class="text-color-secondary text-sm mb-2">
          Solo movimientos del periodo consultado. Cuadra contra banco.
        </div>
        <ul class="m-0 pl-4 text-sm line-height-3">
          <li><b>Cobranza perfecta</b> = misma base del bloque anterior. Es el 100%.</li>
          <li><b>Cobrado</b> = abonos aplicados en el mes a las subcuentas de cuota.</li>
          <li><b>Faltante por cobrar</b> = Cobranza perfecta − Cobrado.</li>
        </ul>
        <div class="text-color-secondary text-sm mt-2">
          Es el mismo dato que “Abonado” en Resumen.
        </div>
      </section>

      <section>
        <div class="font-semibold mb-1">Deuda Condóminos (EF)</div>
        <div class="text-color-secondary text-sm mb-2">
          Mide la cartera acumulada, no el mes. Aquí sí entra la judicial.
        </div>
        <ul class="m-0 pl-4 text-sm line-height-3">
          <li><b>Total deuda</b> = Judicial + Morosos + Deuda corriente. Es el 100%.</li>
          <li><b>Cuotas anticipadas</b> = saldo de quienes pagaron de más (negativo).</li>
          <li><b>Saldo según balanza</b> = Total deuda + Cuotas anticipadas.</li>
        </ul>
      </section>

      <section>
        <div class="font-semibold mb-1">Clasificación de un condómino</div>
        <ul class="m-0 pl-4 text-sm line-height-3">
          <li><b>Anticipos</b>: saldo al corte menor a cero.</li>
          <li><b>Sin adeudo</b>: saldo al corte en cero.</li>
          <li><b>Cobranza judicial</b>: más de 5 cuotas vencidas de mantenimiento, o 5 o más de extraordinaria.</li>
          <li><b>Morosos</b>: 2 o más cuotas vencidas de mantenimiento, o 1 o más de extraordinaria.</li>
          <li><b>Deuda corriente</b>: debe, pero sin alcanzar lo anterior.</li>
        </ul>
        <div class="text-color-secondary text-sm mt-2">
          Se cuentan <b>cuotas completas impagas</b>: cuántas veces cabe la cuota
          vigente del condómino dentro de su saldo. Con una cuota de $13,694, deber
          $12,694 son 0 cuotas vencidas y deber $27,388 son 2.
        </div>
      </section>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CobranzaOnlineComposicionReportesModal {}
