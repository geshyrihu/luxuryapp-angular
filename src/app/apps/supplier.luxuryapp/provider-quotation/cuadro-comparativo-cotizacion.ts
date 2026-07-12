// @ts-nocheck
class CreateOrdenCompra {}
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

import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { debounceTime } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
// missing orden-compra

@Component({
  selector: "app-cuadro-comparativo-cotizacion",
  templateUrl: "./cuadro-comparativo-cotizacion.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    LxCard,
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
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.solicitudCompraId = this.config.data.solicitudCompraId;
    this.posicionCotizacion = this.config.data.posicionCotizacion;
    this.cotizacionProveedorId = this.config.data.cotizacionProveedorId;

    this.onGetCotizacioProveedor();
    this.onCotizacionesRelacionadas();
    this.onLoadData();
  }

  onGetCotizacioProveedor() {
    if (this.cotizacionProveedorId) {
      this.apiResponseS
        .onGetItem(Endpoints.RefactorSupplier.cotizacionProveedorById(this.cotizacionProveedorId))
        .then((result: any) => {
          this.processProviderData(result);
        });
      return;
    }

    const url = Endpoints.RefactorSupplier.cotizacionProveedorPosicionCotizacionByIdById(this.solicitudCompraId, this.posicionCotizacion);
    this.apiResponseS.onGetItem(url).then((result: any) => {
      this.processProviderData(result);
    });
  }

  processProviderData(result: any) {
    if (!result) return;
    this.cotizacionProveedor = result;
    this.posicionCotizacion = result.posicionCotizacion;
    this.garantia.setValue(result.garantia || "");
    this.entrega.setValue(result.entrega || "");
    this.politicaPago.setValue(result.politicaPago || "");
    this.nameProvider.setValue(result.nameProvider || "");
    this.cotizacionProveedorId = result.id;
    this.cdr.detectChanges();
  }

  onLoadData() {
    const urlApi = Endpoints.RefactorSupplier.solicitudcompraById(this.solicitudCompraId);
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

      item.controls.precio.valueChanges
        .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["precio" + suffix] = val;
          this.calculateRowTotals(item);
        });
      item.controls.descuento.valueChanges
        .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["descuento" + suffix] = val;
          this.calculateRowTotals(item);
        });
      item.controls.ivaAplicado.valueChanges
        .pipe(debounceTime(400), takeUntilDestroyed(this.destroyRef))
        .subscribe((val: number) => {
          item["ivaAplicado" + suffix] = val;
          this.calculateRowTotals(item);
        });

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
      .onPut(Endpoints.RefactorSupplier.cotizacionProveedorUpdateProviderById(this.cotizacionProveedor.id),
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
      .onDelete(Endpoints.RefactorSupplier.cotizacionProveedorRemoveFileById(this.cotizacionProveedor.id),
      )
      .then((success) => {
        if (success) {
          this.customToastService.showSuccess(
            "Eliminado",
            "Archivo eliminado correctamente.",
          );
          this.onGetCotizacioProveedor();
        }
      });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    if (!file) return;

    if (file.type !== "application/pdf") {
      this.customToastService.showError(
        "Solo se permiten archivos PDF",
        "Error de formato",
      );
      input.value = "";
      return;
    }

    this.selectedFile = file;
    this.onUpdateProvider();
    input.value = "";
  }

  onDeleteProvider() {
    this.apiResponseS
      .onDelete(Endpoints.RefactorSupplier.solicitudCompraDeleteproviderByIdById(this.solicitudCompraId, this.cotizacionProveedorId),
      )
      .then((result: boolean) => {
        if (result) this.ref.close(true);
      });
  }

  onModalany() {
    this.ref.close(true);
    this.dialogHandlerS.openDialog(
      
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
    const urlApi = Endpoints.RefactorSupplier.ordenCompraCotizacionesRelacionadasById(this.solicitudCompraId);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.cotizacionesRelacionadas = result || [];
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }

  calculateRowTotals(item: any) {
    const qty = item.cantidad || 0;

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

    const subTotal = price * qty;
    const discountAmount = subTotal * (discount / 100);
    const subTotalAfterDiscount = subTotal - discountAmount;
    const ivaAmount = subTotalAfterDiscount * (iva / 100);
    const total = subTotalAfterDiscount + ivaAmount;

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

  onSaveChanges() {
    const promises = [];
    promises.push(this.onUpdateProvider(false));

    this.solicitudCompraDetalle.forEach((item: any) => {
      item.applicationUserId = this.authS.applicationUserId;
      const { controls, ...cleanItem } = item;

      promises.push(
        this.apiResponseS.onPut(
          Endpoints.PurchaseRequestDetails.updatePrice(item.id),
          cleanItem,
          false,
        ),
      );
    });

    Promise.all(promises)
      .then(() => {
        this.customToastService.showSuccess(
          "Guardado",
          "Cotizacion actualizada correctamente.",
        );
        this.onLoadData();
        this.onGetCotizacioProveedor();
      })
      .catch(() => {
        this.customToastService.showError(
          "Error",
          "No se pudieron guardar algunos cambios.",
        );
      });
  }

  getTotalSubtotal(): number {
    if (
      !this.solicitudCompraDetalle ||
      this.solicitudCompraDetalle.length === 0
    ) {
      return 0;
    }

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
    ) {
      return 0;
    }

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
    ) {
      return 0;
    }

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
