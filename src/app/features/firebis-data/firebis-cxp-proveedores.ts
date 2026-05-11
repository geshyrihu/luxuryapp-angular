import { CommonModule, CurrencyPipe } from "@angular/common";
import { Component, computed, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { InputTextModule } from "primeng/inputtext";
import { TagModule } from "primeng/tag";
import { AspelProveedorDto } from "./firebis-dtos";

@Component({
  selector: "app-firebis-cxp-proveedores",
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    TagModule,
    CurrencyPipe,
  ],
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
            <i class="pi pi-address-book text-blue-500 text-2xl"></i>
            Directorio de Proveedores
          </h2>
          <p class="text-gray-500 mt-1 text-sm">
            Catálogo maestro de prestadores de servicios y suministros.
          </p>
        </div>

        <!-- Búsqueda -->
        <div class="relative w-full md:w-80">
          <i
            class="pi pi-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10"
          ></i>
          <input
            pInputText
            type="text"
            [(ngModel)]="searchTerm"
            placeholder="Buscar por nombre o RFC..."
            class="w-full pl-11 py-3 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
          />
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
                  Clave
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Nombre / Razón Social
                </th>
                <th
                  class="py-4 px-6 font-bold uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  RFC
                </th>
                <th
                  class="py-4 px-6 font-bold text-right uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                  style="font-family: 'Segoe UI', sans-serif;"
                >
                  Límite Crédito
                </th>
                <th
                  class="py-4 px-6 font-bold text-center uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Días Crédito
                </th>
                <th
                  class="py-4 px-6 font-bold text-center uppercase tracking-wider text-[11px] text-gray-500 border-b border-gray-100"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              @for (prov of filteredProveedores(); track prov.id) {
                <tr class="hover:bg-blue-50/30 transition-colors group">
                  <td
                    class="px-6 py-4 text-sm font-mono text-gray-400 bg-gray-50/30 text-center"
                  >
                    {{ prov.clave }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm font-bold text-gray-800 border-l-4 border-transparent group-hover:border-blue-500"
                  >
                    {{ prov.nombre }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm font-mono text-gray-500 tracking-tighter"
                  >
                    {{ prov.rfc }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-right tabular-nums text-gray-700 font-bold"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ prov.limiteCredito | currency }}
                  </td>
                  <td
                    class="px-6 py-4 text-sm text-center tabular-nums text-blue-600 font-black"
                    style="font-family: 'Segoe UI', sans-serif;"
                  >
                    {{ prov.diasCredito }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <p-tag
                      [value]="prov.status | uppercase"
                      [severity]="
                        prov.status === 'Activo' ? 'success' : 'danger'
                      "
                      styleClass="text-[10px] font-black tracking-tighter px-2"
                    >
                    </p-tag>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center ">
                      <i class="pi pi-inbox text-4xl text-gray-200"></i>
                      <span class="text-gray-400 font-medium"
                        >No se encontraron proveedores que coincidan con la
                        búsqueda.</span
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
    </style>
  `,
})
export class FirebisCxpProveedores {
  searchTerm = signal("");

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
    {
      id: "2",
      databaseNumber: 2,
      clave: "PRV002",
      nombre: "ELEVADORES OTIS",
      rfc: "OTI991201ABC",
      status: "Activo",
      diasCredito: 30,
      limiteCredito: 150000,
    },
    {
      id: "3",
      databaseNumber: 2,
      clave: "PRV003",
      nombre: "CFE SUMINISTRADOR DE SERVICIOS",
      rfc: "CSS160330CP7",
      status: "Activo",
      diasCredito: 0,
      limiteCredito: 0,
    },
    {
      id: "4",
      databaseNumber: 2,
      clave: "PRV004",
      nombre: "JARDINERIA FLORALIA",
      rfc: "JFL880505XYZ",
      status: "Suspendido",
      diasCredito: 15,
      limiteCredito: 25000,
    },
  ]);

  filteredProveedores = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.proveedores();
    return this.proveedores().filter(
      (p) =>
        p.nombre.toLowerCase().includes(term) ||
        p.rfc.toLowerCase().includes(term),
    );
  });
}
