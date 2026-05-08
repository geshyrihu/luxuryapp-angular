import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CreateOrdenCompra } from "src/app/features/purchases/purchase-order/create-orden-compra";

@Component({
  selector: "app-cuadro-comparativo-cotizacion",
  templateUrl: "./cuadro-comparativo-cotizacion.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputNumberSignal,
    CustomButton,
    CustomButtonViewPdf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuadroComparativoCotizacion implements OnInit, OnDestroy {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  dialogHandlerS = inject(DialogHandlerService);
  customToastService = inject(CustomToastService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  cotizacionProveedorId: string = "";
  cotizacionProveedor: any;
  solicitudCompra: any;
  solicitudCompraDetalle: any;
  solicitudCompraId: string = "";
  nameProvider = new FormControl<string>("", { nonNullable: true });
  posicionCotizacion: number = 0;
  proveedorResult: any[] = [];
  cotizacionesRelacionadas: any[] = [];

  garantia = new FormControl<string>("", { nonNullable: true });
  entrega = new FormControl<string>("", { nonNullable: true });
  politicaPago = new FormControl<string>("", { nonNullable: true });

  ngOnInit(): void {
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    this.cotizacionProveedorId = this.config.data.cotizacionProveedorId;

    this.onGetCotizacioProveedor();
    this.onCotizacionesRelacionadas();
    this.onLoadData();
  }

  onGetCotizacioProveedor() {
    // Determine fetch method: ID (preferred) or Position (fallback)
    if (this.cotizacionProveedorId) {
      this.apiResponseS
        .onGetItem(`CotizacionProveedor/${this.cotizacionProveedorId}`)
        .then((result: any) => {
          this.processProviderData(result);
        });
    } else {
      // Legacy fallback
      const url = `CotizacionProveedor/posicionCotizacion/${this.solicitudCompraId}/${this.posicionCotizacion}`;
      this.apiResponseS.onGetItem(url).then((result: any) => {
        this.processProviderData(result);
      });
    }
  }

  processProviderData(result: any) {
    if (!result) return;
    this.cotizacionProveedor = result;
    // CRITICAL: Update position from DB source of truth
    this.posicionCotizacion = result.posicionCotizacion;

    this.garantia.setValue(result.garantia || "");
    this.entrega.setValue(result.entrega || "");
    this.politicaPago.setValue(result.politicaPago || "");
    this.nameProvider.setValue(result.nameProvider || "");
    this.cotizacionProveedorId = result.id; // Ensure consistent ID

    this.cdr.detectChanges();
  }
  onLoadData() {
    const urlApi = `solicitudcompra/${this.solicitudCompraId}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.solicitudCompra = result;
      this.solicitudCompraDetalle = result.solicitudCompraDetalle;
      this.initRowControls();
      this.cdr.detectChanges();
    });
  }

  initRowControls() {
    this.solicitudCompraDetalle.forEach((item: any) => {
      const suffix =
        this.posicionCotizacion === 1
          ? ""
          : this.posicionCotizacion === 2
            ? "2"
            : "3";

      // Create controls
      item.controls = {
        precio: new FormControl(item["precio" + suffix] || 0, {
          nonNullable: true,
        }),
        descuento: new FormControl(item["descuento" + suffix] || 0, {
          nonNullable: true,
        }),
        ivaAplicado: new FormControl(item["ivaAplicado" + suffix] || 0, {
          nonNullable: true,
        }),
      };

      // Subscribe to changes
      item.controls.precio.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["precio" + suffix] = val;
          this.calculateRowTotals(item);
        });
      item.controls.descuento.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["descuento" + suffix] = val;
          this.calculateRowTotals(item);
        });
      item.controls.ivaAplicado.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["ivaAplicado" + suffix] = val;
          this.calculateRowTotals(item);
        });

      // Inherit initial calc
      this.calculateRowTotals(item);
    });
  }

  onUpdateProvider(showToast: boolean = true) {
    const formData = new FormData();
    formData.append("Id", this.cotizacionProveedor.id.toString());
    formData.append("SolicitudCompraId", this.solicitudCompraId.toString());
    formData.append("NameProvider", this.nameProvider.value);
    formData.append("Garantia", this.garantia.value);
    formData.append("Entrega", this.entrega.value);
    formData.append("PoliticaPago", this.politicaPago.value);
    formData.append("PosicionCotizacion", this.posicionCotizacion.toString());

    if (this.selectedFile) {
      formData.append("File", this.selectedFile);
    }

    return this.apiResponseS
      .onPut(
        `CotizacionProveedor/update-provider/${this.cotizacionProveedor.id}`,
        formData,
        showToast,
      )
      .then((result) => {
        if (result) {
          this.selectedFile = null;
          this.onGetCotizacioProveedor();
        }
      });
  }

  onRemoveFile() {
    if (!this.cotizacionProveedor?.id) return;

    this.apiResponseS
      .onDelete(
        `CotizacionProveedor/remove-file/${this.cotizacionProveedor.id}`,
      )
      .then((success) => {
        if (success) {
          this.customToastService.showSuccess(
            "Eliminado",
            "Archivo eliminado correctamente.",
          );
          this.onGetCotizacioProveedor(); // Refresh to update UI
        }
      });
  }

  selectedFile: File | null = null;
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "application/pdf") {
        this.customToastService.showError(
          "Solo se permiten archivos PDF",
          "Error de formato",
        );
        return;
      }
      this.selectedFile = file;
      // Opcional: Auto-guardar o esperar a que el usuario cambie otro campo?
      // El usuario dijo "actualizar la cotización".
      // Si pongo un botón "Subir", es mejor.
      // Pero onUpdateProvider se llama en (change) de los inputs de texto.
      // Si selecciono archivo, ódeberóa subirlo inmediatamente?
      // Mejor Añadir un botón explócito para "Actualizar Archivo" o llamar a onUpdateProvider().
      this.onUpdateProvider();
    }
  }

  onChange(item: any) {
    // CRITICAL: Clone item and remove 'controls' to avoid circular JSON error
    const { controls, ...cleanItem } = item;

    this.apiResponseS
      .onPut(`SolicitudCompraDetalle/UpdatePrice/${item.id}`, cleanItem)
      .then((result: any) => {
        if (result) {
          // óNO llames a onLoadData() aquó!
          // En su lugar, necesitas recalcular los totales para el item modificado.
          // La API deberóa devolver el item actualizado con los nuevos totales.
          // Si la API devuelve el objeto actualizado:

          // Paso 1: Encuentra el óndice del item en tu array local
          const index = this.solicitudCompraDetalle.findIndex(
            (d) => d.id === result.id,
          );

          // Paso 2: Fusión inteligente para actualizar solo los campos con valor.
          if (index !== -1) {
            const existingItem = this.solicitudCompraDetalle[index];
            // Itera sobre la respuesta de la API
            for (const key in result) {
              // Si la propiedad existe y no es nula/indefinida, actualózala
              if (
                Object.prototype.hasOwnProperty.call(result, key) &&
                result[key] != null
              ) {
                existingItem[key] = result[key];
              }
            }
            // Forzamos una copia para que la detección de cambios de Angular funcione
            this.solicitudCompraDetalle = [...this.solicitudCompraDetalle];
            this.cdr.detectChanges(); // Call detectChanges after updating the array
          }
        } else {
          // Opcional: Si falla, podróas volver a llamar a onLoadData() para revertir los cambios visuales.
          this.onLoadData();
        }
      });
  }
  onDeleteProvider() {
    this.apiResponseS
      .onDelete(
        `solicitudCompra/deleteprovider/${this.solicitudCompraId}/${this.cotizacionProveedorId}`,
      )
      .then((result: boolean) => {
        if (result) this.ref.close(true);
      });
  }

  onEnterKey(event: any, item: any): void {
    event.preventDefault(); // Previene comportamiento por defecto
    const inputElement = event.target as HTMLInputElement;
    inputElement.blur(); // Quita el foco, lo que dispararó onBlur automóticamente
  }
  onModalCreateOrdenCompra() {
    this.ref.close(true);
    this.dialogHandlerS.openDialog(
      CreateOrdenCompra,
      {
        solicitudCompraId: this.solicitudCompra.id,
        folioSolicitudCompra: this.solicitudCompra.folio,
        posicionCotizacion: this.posicionCotizacion,
      },
      "Crear Orden de compra",
      this.dialogHandlerS.sizeLg,
    );
  }

  onCotizacionesRelacionadas() {
    const urlApi = `OrdenCompra/CotizacionesRelacionadas/${this.solicitudCompraId}`;
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.cotizacionesRelacionadas = result || [];
      this.cdr.detectChanges(); // Call detectChanges after updating the data
    });
  }
  ngOnDestroy(): void {
    this.ref.close(true);
  }

  // Cólculos locales para feedback inmediato
  calculateRowTotals(item: any) {
    const qty = item.cantidad || 0;

    // Obtener valores segón la posición
    let price = 0;
    let discount = 0;
    let iva = 0;

    switch (this.posicionCotizacion) {
      case 1:
        price = item.precio || 0;
        discount = item.descuento || 0;
        iva = item.ivaAplicado || 0;
        break;
      case 2:
        price = item.precio2 || 0;
        discount = item.descuento2 || 0;
        iva = item.ivaAplicado2 || 0;
        break;
      case 3:
        price = item.precio3 || 0;
        discount = item.descuento3 || 0;
        iva = item.ivaAplicado3 || 0;
        break;
    }

    // Lógica estóndar de cólculo
    const subTotal = price * qty;
    const discountAmount = subTotal * (discount / 100);
    const subTotalAfterDiscount = subTotal - discountAmount;
    const ivaAmount = subTotalAfterDiscount * (iva / 100);
    const total = subTotalAfterDiscount + ivaAmount;

    // Asignar resultados a las propiedades correspondientes
    switch (this.posicionCotizacion) {
      case 1:
        item.subTotal = subTotal;
        item.iva = ivaAmount;
        item.total = total;
        break;
      case 2:
        item.subTotal2 = subTotal;
        item.iva2 = ivaAmount;
        item.total2 = total;
        break;
      case 3:
        item.subTotal3 = subTotal;
        item.iva3 = ivaAmount;
        item.total3 = total;
        break;
    }
  }

  // Mótodo unificado para guardar todo
  onSaveChanges() {
    // Eliminamos el toast inicial "Guardando..." para evitar ruido visual

    const promises = [];

    // 1. Guardar datos del proveedor (silencioso)
    promises.push(this.onUpdateProvider(false));

    // 2. Guardar cada lónea de detalle (silencioso)
    this.solicitudCompraDetalle.forEach((item: any) => {
      // Inject ApplicationUserId required by Backend DTO
      item.applicationUserId = this.authS.applicationUserId;

      // CRITICAL: Clone item and remove 'controls' to avoid circular JSON error
      const { controls, ...cleanItem } = item;

      // Pasar 'false' como tercer argumento para evitar toasts individuales
      promises.push(
        this.apiResponseS.onPut(
          `SolicitudCompraDetalle/UpdatePrice/${item.id}`,
          cleanItem,
          false,
        ),
      );
    });

    Promise.all(promises)
      .then(() => {
        // Un ónico toast de óxito al finalizar todo el lote
        this.customToastService.showSuccess(
          "Guardado",
          "Cotización actualizada correctamente.",
        );
        this.onLoadData();
      })
      .catch((err) => {
        // Un ónico toast de error si algo falla
        this.customToastService.showError(
          "Error",
          "No se pudieron guardar algunos cambios.",
        );
      });
  }

  formatDecimal(event: any, field: string, item: any): void {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      const formattedValue = parseFloat(value.toFixed(2));
      item[field] = formattedValue;
      event.target.value = formattedValue.toFixed(2);
    }
  }

  getTotalSubtotal(): number {
    if (
      !this.solicitudCompraDetalle ||
      this.solicitudCompraDetalle.length === 0
    )
      return 0;
    switch (this.posicionCotizacion) {
      case 1:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.subTotal || 0),
          0,
        );
      case 2:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.subTotal2 || 0),
          0,
        );
      case 3:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.subTotal3 || 0),
          0,
        );
      default:
        return 0;
    }
  }

  getTotalIva(): number {
    if (
      !this.solicitudCompraDetalle ||
      this.solicitudCompraDetalle.length === 0
    )
      return 0;
    switch (this.posicionCotizacion) {
      case 1:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.iva || 0),
          0,
        );
      case 2:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.iva2 || 0),
          0,
        );
      case 3:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.iva3 || 0),
          0,
        );
      default:
        return 0;
    }
  }

  getTotalGeneral(): number {
    if (
      !this.solicitudCompraDetalle ||
      this.solicitudCompraDetalle.length === 0
    )
      return 0;
    switch (this.posicionCotizacion) {
      case 1:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.total || 0),
          0,
        );
      case 2:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.total2 || 0),
          0,
        );
      case 3:
        return this.solicitudCompraDetalle.reduce(
          (sum, item) => sum + (item.total3 || 0),
          0,
        );
      default:
        return 0;
    }
  }
}
