import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import { Component, signal } from "@angular/core";
import { SelectModule } from "primeng/select";
import { TagModule } from "primeng/tag";
import { AspelProveedorDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-cxp-estado-cuenta",
  imports: [CommonModule, TagModule, SelectModule, CurrencyPipe, DatePipe],
  template: `
    <div
      class="card p-0 border-none shadow-sm bg-white rounded-xl overflow-hidden"
    >
      <!-- Header Seccion -->
      <div
        class="p-6 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div class="flex flex-col">
          <h2 class="text-2xl font-bold text-gray-800 flex items-center ">
            <i class="pi pi-file-pdf text-emerald-500 text-2xl"></i>
            Estado de Cuenta Proveedor
          </h2>
          <p class="text-gray-500 mt-1 text-sm">
            Historial de facturas recibidas y pagos emitidos.
          </p>
        </div>

        <!-- Selector de Proveedor -->
        <div class="w-full md:w-96">
          <p-select
            [options]="proveedores()"
            optionLabel="nombre"
            placeholder="Seleccione un proveedor..."
            styleClass="w-full custom-select"
          >
          </p-select>
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
                  Fecha
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Concepto / Forma de Pago
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Referencia
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Cargo (Factura)
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Abono (Pago)
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (mov of movimientos(); track mov.id) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-4 text-sm text-gray-500 tabular-nums"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ mov.fechaPago | date: "dd/MM/yyyy" }}
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-gray-800">
                    {{ mov.concepto }}
                    @if (mov.formaPago) {
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-tighter ml-2"
                      >
                        {{ mov.formaPago }}
                      </span>
                    }
                  </td>
                  <td
                    class="px-6 py-4 text-sm font-mono text-gray-400 bg-gray-50/50 text-center rounded"
                  >
                    {{ mov.referenciaFactura }}
                  </td>

                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums text-gray-600 font-medium"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    @if (mov.montoCargo > 0) {
                      {{ mov.montoCargo | currency }}
                    } @else {
                      -
                    }
                  </td>

                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums text-emerald-600 font-black"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    @if (mov.montoPago > 0) {
                      {{ mov.montoPago | currency }}
                    } @else {
                      -
                    }
                  </td>

                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums font-black text-gray-900 bg-gray-50/30"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ mov.saldo | currency }}
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center ">
                      <i class="pi pi-search text-4xl text-gray-200"></i>
                      <span class="text-gray-400 font-medium"
                        >Seleccione un proveedor para visualizar su estado de
                        cuenta.</span
                      >
                    </div>
                  </td>
                </tr>
              }
            </tbody>
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
      :host ::ng-deep {
        .custom-select {
          .p-select-label {
            font-weight: 600;
            color: #1e293b;
          }
        }
      }
    </style>
  `,
})
export class FirebisCxpEstadoCuenta {
  proveedores = signal<AspelProveedorDto[]>([
    {
      id: "1",
      databaseNumber: 2,
      clave: "PRV001",
      nombre: "SERVICIOS DE LIMPIEZA SHINE S.A. DE C.V.",
      rfc: "SLS190101QWE",
      status: "Activo",
      diasCredito: 15,
      limiteCredito: 50000,
    },
  ]);

  movimientos = signal<any[]>([
    {
      id: "mov1",
      fechaPago: "2025-01-31T00:00:00",
      concepto: "Factura Enero",
      referenciaFactura: "F-9021",
      montoCargo: 25000,
      montoPago: 0,
      formaPago: "",
      saldo: 25000,
    },
    {
      id: "mov2",
      fechaPago: "2025-02-14T00:00:00",
      concepto: "Pago Transferencia",
      referenciaFactura: "F-9021",
      montoCargo: 0,
      montoPago: 15000,
      formaPago: "SPEI",
      saldo: 10000,
    },
  ]);
}
