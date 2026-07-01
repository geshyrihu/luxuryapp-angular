import { CommonModule } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "primeng/api";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IEspejoAspelFullResponseDTO,
  IEspejoFilaTabla,
} from "./models/espejo-aspel-full.interface";
import { ReportFilterService } from "./services/financial-report-filter.service";

@Component({
  selector: "app-espejo-aspel-full",
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SelectButtonModule,
    ProgressSpinnerModule,
    WebButtonLabel,
    CustomSearchInput,
    SharedModule,
    AppIcon,
  ],
  templateUrl: "./espejo-aspel-full.html",
})
export class EspejoAspelFull {
  private readonly apiS = inject(ApiResponseService);
  readonly customerIdS = inject(CustomerIdService);
  readonly filterS = inject(ReportFilterService);

  // -- Estado ------------------------------------------------------------------
  loading = signal(false);
  rawData = signal<IEspejoAspelFullResponseDTO | null>(null);
  ocultarSinDatos = signal(false);
  nivelVisiblePorGrupo = signal<Record<string, number>>({});
  busquedaPorGrupo = signal<Record<string, string>>({});

  empresaOptions = [
    { label: "Contabilidad", value: "Contabilidad" },
    { label: "Cobranza", value: "Cobranza" },
  ];
  empresaSeleccionada = signal<string>("Contabilidad");

  readonly meses = [
    "Ene",
    "Feb",
    "Mar",
    "Abr",
    "May",
    "Jun",
    "Jul",
    "Ago",
    "Sep",
    "Oct",
    "Nov",
    "Dic",
  ];

  // Filas aplanadas por grupo
  filasPorGrupo = computed(() => {
    const data = this.rawData();
    if (!data) return new Map<string, IEspejoFilaTabla[]>();

    const mapa = new Map<string, IEspejoFilaTabla[]>();

    for (const grupo of data.grupos || []) {
      const filas: IEspejoFilaTabla[] = [];

      for (const n1 of grupo.cuentasNivel1 || []) {
        filas.push(
          this.crearFila(
            n1.numCta,
            n1.nombre,
            1,
            n1.naturaleza,
            false,
            n1.saldoInicial,
            n1.totalesCargo,
            n1.totalesAbono,
            n1.totalesPresupuesto,
            grupo.codigo,
            grupo.nombre,
          ),
        );

        for (const n2 of n1.subCuentas || []) {
          filas.push(
            this.crearFila(
              n2.numCta,
              n2.nombre,
              2,
              n2.naturaleza,
              false,
              n2.saldoInicial,
              n2.totalesCargo,
              n2.totalesAbono,
              n2.totalesPresupuesto,
              grupo.codigo,
              grupo.nombre,
            ),
          );

          for (const n3 of n2.detalle || []) {
            filas.push(
              this.crearFila(
                n3.numCta,
                n3.nombre,
                3,
                n3.naturaleza,
                false,
                n3.saldoInicial,
                n3.cargos,
                n3.abonos,
                n3.presupuesto,
                grupo.codigo,
                grupo.nombre,
              ),
            );

            for (const n4 of n3.detalle || []) {
              filas.push(
                this.crearFila(
                  n4.numCta,
                  n4.nombre,
                  4,
                  n4.naturaleza,
                  false,
                  n4.saldoInicial,
                  n4.cargos,
                  n4.abonos,
                  n4.presupuesto,
                  grupo.codigo,
                  grupo.nombre,
                ),
              );
            }
          }
        }
      }

      filas.push(
        this.crearFila(
          "",
          `TOTAL ${grupo.nombre}`,
          "grupo",
          "",
          true,
          grupo.saldoInicial,
          grupo.totalesCargo,
          grupo.totalesAbono,
          grupo.totalesPresupuesto,
          grupo.codigo,
          grupo.nombre,
        ),
      );

      mapa.set(grupo.codigo, filas);
    }

    return mapa;
  });

  filasFiltradasPorGrupo = computed(() => {
    try {
      const base = this.filasPorGrupo();
      const ocultar = this.ocultarSinDatos();
      const nivelesVisibles = this.nivelVisiblePorGrupo();
      const busquedas = this.busquedaPorGrupo();
      const resultado = new Map<string, IEspejoFilaTabla[]>();

      for (const [codigo, filas] of base) {
        const maxDisponible = Math.max(
          ...this.getNivelesDisponibles(codigo),
          3,
        );
        const nivelMax = nivelesVisibles[codigo] ?? maxDisponible;
        const texto = (busquedas[codigo] ?? "").toLowerCase().trim();
        let filtradas = filas;

        if (nivelMax < maxDisponible) {
          filtradas = filtradas.filter(
            (f) => f.nivel === "grupo" || (f.nivel as number) <= nivelMax,
          );
        }

        if (texto) {
          filtradas = filtradas.filter(
            (f) =>
              f.nivel === "grupo" ||
              (f.nombre || "").toLowerCase().includes(texto) ||
              (f.numCta || "").toLowerCase().includes(texto),
          );
        }

        if (ocultar) {
          filtradas = filtradas.filter(
            (f) =>
              f.nivel === "grupo" ||
              f.saldoInicial !== 0 ||
              (f.cargos || []).some((v) => v !== 0) ||
              (f.abonos || []).some((v) => v !== 0) ||
              (f.presupuesto || []).some((v) => v !== 0),
          );
        }

        resultado.set(codigo, filtradas);
      }

      return resultado;
    } catch (error) {
      console.error("ðŸ”¥ ERROR FATAL EN FILAS FILTRADAS POR GRUPO:", error);
      alert("Error capturado: " + (error as any).message);
      return new Map<string, IEspejoFilaTabla[]>();
    }
  });

  constructor() {
    effect(() => {
      const custId = this.customerIdS.customerId();
      const yr = this.filterS.year();
      const emp = this.empresaSeleccionada();
      if (custId && yr && emp) {
        this.cargarDatos(custId, yr, emp);
      }
    });
  }

  async cargarDatos(customerId: string, year: number, empresa: string) {
    this.loading.set(true);
    this.rawData.set(null);

    const result = await this.apiS.onGetItem<IEspejoAspelFullResponseDTO>(
      Endpoints.EspejoAspelFull.get(customerId, year, empresa),
    );

    if (result) this.rawData.set(result);
    this.loading.set(false);
  }

  // -- Helpers -----------------------------------------------------------------

  private crearFila(
    numCta: string,
    nombre: string,
    nivel: 1 | 2 | 3 | 4 | "grupo",
    naturaleza: string,
    esTotal: boolean,
    saldoInicial: number,
    cargos: number[],
    abonos: number[],
    presupuesto: number[],
    grupoCodigo: string,
    grupoNombre: string,
  ): IEspejoFilaTabla {
    return {
      numCta: numCta || "",
      nombre: nombre || "",
      nivel: nivel as any,
      naturaleza: naturaleza || "",
      esTotal,
      saldoInicial: saldoInicial || 0,
      cargos: cargos || Array(12).fill(0),
      abonos: abonos || Array(12).fill(0),
      presupuesto: presupuesto || Array(12).fill(0),
      grupoCodigo: grupoCodigo || "",
      grupoNombre: grupoNombre || "",
    };
  }

  totalCargo(fila: IEspejoFilaTabla): number {
    return (fila.cargos || []).reduce((a, b) => a + b, 0);
  }

  totalAbono(fila: IEspejoFilaTabla): number {
    return (fila.abonos || []).reduce((a, b) => a + b, 0);
  }

  mostrarPresupuesto(fila: IEspejoFilaTabla): boolean {
    return fila.grupoCodigo === "6";
  }

  resultado(fila: IEspejoFilaTabla): number {
    return this.totalCargo(fila) - this.totalAbono(fila);
  }

  rowClass(fila: IEspejoFilaTabla): string {
    if (fila.nivel === "grupo") return "fila-total-grupo";
    if (fila.nivel === 1) return "fila-nivel1";
    if (fila.nivel === 2) return "fila-nivel2";
    if (fila.nivel === 3) return "fila-nivel3";
    return "fila-nivel4";
  }

  grupos() {
    return this.rawData()?.grupos ?? [];
  }

  filasDe(grupoCodigo: string): IEspejoFilaTabla[] {
    return this.filasFiltradasPorGrupo().get(grupoCodigo) ?? [];
  }

  getBusqueda(codigo: string): string {
    return this.busquedaPorGrupo()[codigo] ?? "";
  }

  setBusqueda(codigo: string, valor: string) {
    this.busquedaPorGrupo.update((prev) => ({ ...prev, [codigo]: valor }));
  }

  getNivelVisible(codigo: string): number {
    return this.nivelVisiblePorGrupo()[codigo] ?? 3;
  }

  setNivelVisible(codigo: string, nivel: number) {
    this.loading.set(true);
    // Cedemos el hilo principal para que el navegador pueda dibujar el spinner
    setTimeout(() => {
      this.nivelVisiblePorGrupo.update((prev) => ({
        ...prev,
        [codigo]: nivel,
      }));
      // Damos un pequeño respiro para que Angular procese los miles de filas antes de quitar el spinner
      setTimeout(() => {
        this.loading.set(false);
      }, 50);
    }, 50);
  }

  getNivelesDisponibles(codigo: string): number[] {
    const filas = this.filasPorGrupo().get(codigo) ?? [];
    const niveles: number[] = [1];

    let hasN2 = filas.some((f) => f.nivel === 2);
    let hasN3 = filas.some((f) => f.nivel === 3);
    let hasN4 = filas.some((f) => f.nivel === 4);

    // Si la empresa usa máscara de 4 niveles (ej: 401-000-000-000),
    // habilitamos los 4 botones por coherencia con la estructura de Aspel.
    if (
      !hasN4 &&
      filas.some((f) => f.numCta && f.numCta.split("-").length === 4)
    ) {
      hasN2 = true;
      hasN3 = true;
      hasN4 = true;
    }

    if (hasN2) niveles.push(2);
    if (hasN3) niveles.push(3);
    if (hasN4) niveles.push(4);

    return niveles;
  }

  irAGrupo(codigo: string) {
    document
      .getElementById(`grupo-${codigo}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  formatMoney(val: number): string {
    if (!val) return "-";
    return new Intl.NumberFormat("es-MX", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  }
}
