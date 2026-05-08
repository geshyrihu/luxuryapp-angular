import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, signal } from "@angular/core";
import { TagModule } from "primeng/tag";
import { AspelCuentaPorPagarDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-cxp-antiguedad",
  imports: [CommonModule, TagModule, CurrencyPipe, DatePipe],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header Seccion -->
      <div
        class="p-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between"
      >
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center ">
            <i class="pi pi-history text-rose-500 text-2xl"></i>
            Antigüedad de Saldos (CxP)
          </h2>
          <p class="text-gray-500 mt-1 text-sm">
            Listado detallado de facturas pendientes de pago a proveedores.
          </p>
        </div>
        <div
          class="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-rose-100"
        >
          Control de Pasivos
        </div>
      </div>

      <div class="p-4 overflow-hidden">
        <div class="overflow-x-auto rounded-xl border border-gray-100">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/80">
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Factura
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Proveedor
                </th>
                <th
                  class="py-4 px-6 font-bold text-center uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Emisión
                </th>
                <th
                  class="py-4 px-6 font-bold text-center uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Vencimiento
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Concepto
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Total Fac.
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Saldo Adeudado
                </th>
                <th
                  class="py-4 px-6 font-bold text-center uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Estado
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (fac of facturas(); track fac.id) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-4 text-sm font-black text-gray-700 tabular-nums"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fac.referencia }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-700">
                    <span
                      class="text-[10px] text-gray-400 font-mono block mb-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
                      >{{ fac.proveedorId }}</span
                    >
                    <span class="font-bold">SERVICIOS DE LIMPIEZA</span>
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-center text-gray-500"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fac.fechaEmision | date: "dd/MM/yyyy" }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-center text-rose-600 font-black"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fac.fechaVencimiento | date: "dd/MM/yyyy" }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 font-medium">
                    {{ fac.concepto }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums text-gray-400 font-medium"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fac.montoOriginal | currency }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums font-black text-rose-700 bg-rose-50/20"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ fac.saldoActual | currency }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <p-tag
                      [value]="fac.estadoDocumento | uppercase"
                      [severity]="
                        fac.estadoDocumento === 'Pendiente' ? 'danger' : 'warn'
                      "
                      styleClass="text-[10px] font-black tracking-tighter px-2"
                    >
                    </p-tag>
                  </td>
                </tr>
              }
            </tbody>
            <tfoot class="bg-rose-50/40 border-t-2 border-rose-100">
              <tr>
                <td
                  colspan="6"
                  class="px-6 py-5 text-right font-black text-xs text-rose-800 uppercase tracking-widest"
                >
                  Total Cuentas por Pagar
                </td>
                <td
                  class="px-6 py-5 text-right font-black text-lg tabular-nums text-rose-700"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  {{ totalAdeudado() | currency }}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    <style>
      :host {
        display: block;
      }
      .tabular-nums {
        font-variant-numeric: tabular-nums;
      }
    </style>
  `,
})
export class FirebisCxpAntiguedad {
  facturas = signal<AspelCuentaPorPagarDto[]>([
    {
      id: "1",
      databaseNumber: 2,
      proveedorId: "PRV001",
      referencia: "F-9021",
      fechaEmision: "2025-01-31T00:00:00",
      fechaVencimiento: "2025-02-15T00:00:00",
      concepto: "SERVICIOS DE LIMPIEZA ENERO 2025",
      montoOriginal: 25000,
      saldoActual: 25000,
      estadoDocumento: "Pendiente",
    },
    {
      id: "2",
      databaseNumber: 2,
      proveedorId: "PRV002",
      referencia: "F-1029",
      fechaEmision: "2025-02-05T00:00:00",
      fechaVencimiento: "2025-03-05T00:00:00",
      concepto: "MANTENIMIENTO PREVENTIVO",
      montoOriginal: 12500,
      saldoActual: 12500,
      estadoDocumento: "Pendiente",
    },
  ]);

  totalAdeudado() {
    return this.facturas().reduce((sum, f) => sum + f.saldoActual, 0);
  }
}
