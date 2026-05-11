import { CommonModule } from "@angular/common";
import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { DividerModule } from "primeng/divider";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { TooltipPlacement } from "src/app/core/enums/tooltip-placement";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CuadroComparativoAddProveedor } from "./cuadro-comparativo-add-proveedor";
import { CuadroComparativoCotizacion } from "./cuadro-comparativo-cotizacion";

@Component({
  selector: "app-cuadro-comparativo-list",
  templateUrl: "./cuadro-comparativo-list.html",
  imports: [
    CommonModule,
    TableModule,
    DividerModule,
    CustomButton,
    CustomButtonViewPdf,
    DialogModule,
  ],
})
export class CuadroComparativoList implements OnInit {
  tooltipPlacement = TooltipPlacement;
  // Inyección de dependencias
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customToastService = inject(CustomToastService);
  routeActive = inject(ActivatedRoute);
  aiService = inject(AiService);
  // Referencia para diálogos dinómicos
  ref: DynamicDialogRef;

  // AI Analysis
  showAiModal: boolean = false;
  aiAnalysisResult: string = "";
  isAnalyzing: boolean = false;

  // Datos de la solicitud de compra
  solicitudCompra: any;
  solicitudCompraDetalleSignal = signal<any[]>([]);
  cotizacionProveedorSignal = signal<any[]>([]);

  // Información de proveedores
  provider1: any;
  provider2: any;
  provider3: any;

  // IDs de cotizaciones
  cotizacionProveedorId1: any;
  cotizacionProveedorId2: any;
  cotizacionProveedorId3: any;

  // Totales por proveedor
  total1 = 0;
  total2 = 0;
  total3 = 0;

  // Banderas para resaltar los totales
  amarilloTotal1 = false;
  amarilloTotal2 = false;
  amarilloTotal3 = false;

  // Datos generales
  solicitudCompraId: string = "";
  folio = "";

  // Totales para la evaluación de "mejor opción"
  mejorPrecioTotal1 = 0;
  mejorPrecioTotal2 = 0;
  mejorPrecioTotal3 = 0;
  totalMejorPrecioTotal = 0;
  evaluarPrecioIndependiente = false;

  paramsSignal = toSignal(this.routeActive.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params && params["id"]) {
        this.solicitudCompraId = params["id"];
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {}

  onLoadData() {
    if (!this.solicitudCompraId) return;

    // Reseteo de datos antes de cargar nuevos
    this.onResetData();
    const urlApi = `solicitudcompra/cuadrocomparativo/${this.solicitudCompraId}`;

    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      if (!result) return;

      // Asignación de datos desde la API
      this.folio = result.folio;
      this.solicitudCompra = result;
      this.cotizacionProveedorSignal.set(
        this.solicitudCompra.cotizacionProveedor,
      );
      this.solicitudCompraDetalleSignal.set(
        this.solicitudCompra.solicitudCompraDetalle,
      );

      // Asignación de proveedores y cólculo de totales de forma simplificada
      this.setupProvidersAnDTOtals();

      // Ejecutar las evaluaciones de precios
      this.onEvaluationPriceTotal();
      this.onTotalPreciosMenores(this.solicitudCompraDetalleSignal());
    });
  }

  /**
   * CORRECCIóN: Centraliza la asignación de proveedores y el cólculo de totales.
   * Esto evita la repetición de código y es mós fócil de mantener.
   */
  setupProvidersAnDTOtals(): void {
    const cotizacionProveedor = this.cotizacionProveedorSignal();
    const solicitudCompraDetalle = this.solicitudCompraDetalleSignal();

    // Mapea los proveedores y sus IDs
    if (cotizacionProveedor.length >= 1) {
      this.provider1 = cotizacionProveedor[0].nameProvider;
      this.cotizacionProveedorId1 = cotizacionProveedor[0].id;
    }
    if (cotizacionProveedor.length >= 2) {
      this.provider2 = cotizacionProveedor[1].nameProvider;
      this.cotizacionProveedorId2 = cotizacionProveedor[1].id;
    }
    if (cotizacionProveedor.length >= 3) {
      this.provider3 = cotizacionProveedor[2].nameProvider;
      this.cotizacionProveedorId3 = cotizacionProveedor[2].id;
    }

    // Calcula los totales para cada proveedor en un solo bucle
    solicitudCompraDetalle.forEach((n) => {
      this.total1 += n.total || 0;
      this.total2 += n.total2 || 0;
      this.total3 += n.total3 || 0;
    });
  }

  /**
   * CORRECCIóN: Lógica de evaluación de totales refactorizada y simplificada.
   * Elimina las funciones onMejorOpcion1, 2 y 3, que eran complejas y propensas a errores.
   */
  onEvaluationPriceTotal(): void {
    // Resetea las banderas de resaltado
    this.amarilloTotal1 = false;
    this.amarilloTotal2 = false;
    this.amarilloTotal3 = false;

    // 1. Crea un array con los totales que son vólidos (mayores que 0)
    const preciosValidos = [];
    if (this.total1 > 0) preciosValidos.push(this.total1);
    if (this.total2 > 0) preciosValidos.push(this.total2);
    if (this.total3 > 0) preciosValidos.push(this.total3);

    // 2. Si no hay precios vólidos, no hace nada mós
    if (preciosValidos.length === 0) {
      return;
    }

    // 3. Encuentra el precio mós bajo entre los vólidos
    const precioMasBajo = Math.min(...preciosValidos);

    // 4. Activa la bandera amarilla solo para el total que coincida con el precio mós bajo
    if (this.total1 === precioMasBajo) this.amarilloTotal1 = true;
    if (this.total2 === precioMasBajo) this.amarilloTotal2 = true;
    if (this.total3 === precioMasBajo) this.amarilloTotal3 = true;
  }

  /**
   * CORRECCIóN: Nueva función para determinar si un precio individual es el mós bajo.
   * Esta función se llamaró desde el HTML para mantener la plantilla limpia.
   * @param item - El objeto de la fila actual (solicitudCompraDetalle).
   * @param providerIndex - El óndice del proveedor (1, 2, o 3) que se estó evaluando.
   * @returns `true` si el precio de este proveedor es el mós bajo (y mayor que 0).
   */
  isLowestPrice(item: any, providerIndex: number): boolean {
    // 1. Obtiene el precio del proveedor actual
    const currentPrice =
      providerIndex === 1
        ? item.total
        : providerIndex === 2
          ? item.total2
          : item.total3;

    // 2. Si el precio actual es 0, no puede ser el mós bajo.
    if (currentPrice <= 0) {
      return false;
    }

    // 3. Crea un array con todos los precios de la fila que son mayores que 0.
    const preciosValidos = [item.total, item.total2, item.total3].filter(
      (p) => p > 0,
    );

    // 4. Si no hay precios vólidos, no resalta nada.
    if (preciosValidos.length === 0) {
      return false;
    }

    // 5. Encuentra el precio mós bajo y compara.
    const precioMasBajo = Math.min(...preciosValidos);
    return currentPrice === precioMasBajo;
  }

  // La lógica de `onTotalPreciosMenores` ya era correcta y robusta. Se mantiene igual.
  onTotalPreciosMenores(solicitudCompraDetalle: any[]): void {
    this.onResetMejorPrecio();

    for (let n of solicitudCompraDetalle) {
      const preciosValidos = [
        { total: n.total, index: 1 },
        { total: n.total2, index: 2 },
        { total: n.total3, index: 3 },
      ].filter((p) => p.total > 0);

      if (preciosValidos.length === 0) continue;

      const mejorPrecio = Math.min(...preciosValidos.map((p) => p.total));
      const mejorOpcion = preciosValidos.find((p) => p.total === mejorPrecio);

      if (mejorOpcion) {
        if (mejorOpcion.index === 1) this.mejorPrecioTotal1 += mejorPrecio;
        if (mejorOpcion.index === 2) this.mejorPrecioTotal2 += mejorPrecio;
        if (mejorOpcion.index === 3) this.mejorPrecioTotal3 += mejorPrecio;
      }
    }

    this.totalMejorPrecioTotal =
      this.mejorPrecioTotal1 + this.mejorPrecioTotal2 + this.mejorPrecioTotal3;
  }

  // Funciones de reseteo y modales (sin cambios, ya eran correctas)
  onModalAddProveedor() {
    this.dialogHandlerS
      .openDialog(
        CuadroComparativoAddProveedor,
        { solicitudCompraId: this.solicitudCompraId },
        "Selecciona un proveedor",
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onEditCotizacion(posicionCotizacion: number, cotizacionProveedorId: any) {
    this.dialogHandlerS
      .openDialog(
        CuadroComparativoCotizacion,
        {
          solicitudCompraId: this.solicitudCompraId,
          posicionCotizacion: posicionCotizacion,
          cotizacionProveedorId: cotizacionProveedorId,
        },
        "Editar Cotización",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onResetData(): void {
    this.solicitudCompraDetalleSignal.set([]);
    this.cotizacionProveedorSignal.set([]);
    this.provider1 = undefined;
    this.provider2 = undefined;
    this.provider3 = undefined;
    this.total1 = 0;
    this.total2 = 0;
    this.total3 = 0;
  }

  onResetMejorPrecio() {
    this.mejorPrecioTotal1 = 0;
    this.mejorPrecioTotal2 = 0;
    this.mejorPrecioTotal3 = 0;
    this.totalMejorPrecioTotal = 0;
  }

  onAnalyzeAI() {
    this.isAnalyzing = true;
    this.customToastService.showInfo(
      "Analizando...",
      "La IA estó revisando las cotizaciones y documentos adjuntos.",
    );

    this.aiService
      .analyzeComparativeChart(this.solicitudCompraId)
      .then((result) => {
        this.aiAnalysisResult = result;
        this.showAiModal = true;
        this.isAnalyzing = false;
      })
      .catch((error) => {
        this.customToastService.showError("Error AI", error.message);
        this.isAnalyzing = false;
      });
  }
}









