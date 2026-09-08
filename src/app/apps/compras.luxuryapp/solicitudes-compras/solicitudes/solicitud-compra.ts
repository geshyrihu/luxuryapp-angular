import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { AppBadge } from "@ui/web/badge/badge";
import { AppProgressBar } from "@ui/web/progress-bar/progress-bar";
import { DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";

import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { firstValueFrom } from "rxjs";
import { CreateOrdenCompra } from "src/app/apps/supplier.luxuryapp/po/purchase-order/create-orden-compra";
import { SolicitudCompraDetalle } from "src/app/apps/supplier.luxuryapp/pr/solicitud-compra/solicitud-compra-detalle";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PurchaseLinkManager } from "../../po/purchase-link-manager/purchase-link-manager";
import { ProductAdd } from "./product-add";
import { ProductModalAdd } from "./product-modal-add";

export interface ISolicitudCompraForm {
  id: FormControl<string | null>;
  customerId: FormControl<string | null>;
  fechaSolicitud: FormControl<Date | null>;
  solicita: FormControl<string>;
  equipoOInstalacion: FormControl<string>;
  justificacionGasto: FormControl<string>;
  estatus: FormControl<number | null>;
  folio: FormControl<string | null>;
  applicationUserId: FormControl<string | null>;
}

@Component({
  selector: "app-solicitud-compra",
  templateUrl: "./solicitud-compra.html",
  imports: [
    ReactiveFormsModule,
    RouterModule,
    AppProgressBar,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    ProductAdd,
    SolicitudCompraDetalle,
    WebButtonLabel,
    AppBadge,
    LxDivider,
    AppIcon,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudCompra implements OnInit {
  enumSelectS = inject(EnumSelectService);
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  dateS = inject(DateService);
  dialogHandlerS = inject(DialogHandlerService);
  formB = inject(FormBuilder);
  routeActive = inject(ActivatedRoute);
  router = inject(Router);
  customToastS = inject(CustomToastService);
  cdr = inject(ChangeDetectorRef);
  submitting = signal(false);

  statusCompra = signal<SelectItemDto[]>([]);
  id: string = "";
  solicitudCompra: any;
  tempProducts = signal<any[]>([]); // Buffer local para nuevos productos antes de guardar cabecera

  type: string = "";
  ref: DynamicDialogRef;
  SolicitudCompraDetalle: any[] = [];
  form: FormGroup<ISolicitudCompraForm>;
  imprimir = false;
  cotizacionesRelacionadas: any[] = [];

  paramsSignal = toSignal(this.routeActive.params);

  constructor() {
    effect(() => {
      const params = this.paramsSignal();
      if (params && params["id"]) {
        this.id = params["id"];
        if (this.id && this.id !== "" && this.id !== "0") {
          this.onLoadData();
          this.onCotizacionesRelacionadas();
          this.tempProducts.set([]); // Limpiar buffer al cargar una existente
        }
      }
    });
  }

  async ngOnInit() {
    this.createForm();
    if (this.id && this.id !== "" && this.id !== "0") {
      this.onLoadData();
      this.onCotizacionesRelacionadas();
    }
    this.statusCompra.set(
      await firstValueFrom(this.enumSelectS.typeStatusOrdenCompra(false)),
    );
  }

  // Manejar productos aóadidos localmente antes de guardar cabecera
  onAddedLocal(product: any) {
    this.tempProducts.update((prev) => [...prev, product]);
    // Actualizamos visualmente la lista combinando lo local con lo que pudiera haber (que debería ser nada)
    this.SolicitudCompraDetalle = [...this.SolicitudCompraDetalle, product];
    this.cdr.detectChanges();
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.formB.group<ISolicitudCompraForm>({
      id: new FormControl({ value: this.id, disabled: true }),
      customerId: new FormControl(this.customerIdS.customerId()),
      fechaSolicitud: new FormControl(new Date()),
      solicita: new FormControl("", {
        validators: Validators.required,
        nonNullable: true,
      }),
      equipoOInstalacion: new FormControl("", {
        validators: Validators.required,
        nonNullable: true,
      }),
      justificacionGasto: new FormControl("", {
        validators: Validators.required,
        nonNullable: true,
      }),
      estatus: new FormControl(2),
      folio: new FormControl(""),
      applicationUserId: new FormControl(this.authS.applicationUserId),
    });
  }

  onCotizacionesRelacionadas() {
    this.apiResponseS
      .onGetList(Endpoints.PurchaseOrders.relatedQuotes(this.id))
      .then((result: any) => {
        this.cotizacionesRelacionadas = result;
        this.cdr.detectChanges();
      });
  }

  onSetTipe(value: number) {
    if (!this.id || this.id === "" || this.id === "0") {
      this.type = "success";
    } else if (value === 1) {
      this.type = "secondary";
    } else if (value === 2) {
      this.type = "danger";
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.PurchaseRequests.getIndividual(this.id))
      .then((result: any) => {
        if (!result) return;
        this.solicitudCompra = result;
        this.onSetTipe(result.estatus);
        result.fechaSolicitud = this.dateS.parseDate(result.fechaSolicitud);
        this.form.patchValue(result);
        this.SolicitudCompraDetalle =
          this.solicitudCompra.solicitudCompraDetalle || [];
        this.cdr.detectChanges();
      });
  }

  async onSubmit() {
    const formValue = this.form.getRawValue();
    const payload = {
      ...formValue,
      fechaSolicitud: this.dateS.getDateFormat(formValue.fechaSolicitud),
    };

    const isNew = !this.id || this.id === "" || this.id === "0";

    const result: any = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.PurchaseRequests.solicitudCompraBase,
      id: isNew ? null : this.id,
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: () => payload,
    });

    if (result) {
      if (isNew && result.id) {
        this.id = result.id;

        for (const product of this.tempProducts()) {
          product.solicitudCompraId = this.id;
          await this.apiResponseS.onPost(
            Endpoints.PurchaseRequestDetails.create,
            product,
          );
        }

        this.tempProducts.set([]);
        this.customToastS.showSuccess(
          "éxito",
          "Solicitud y productos guardados correctamente",
        );
      } else {
        this.customToastS.showSuccess(
          "Actualizado",
          "Solicitud actualizada correctamente",
        );
      }
      this.onLoadData();
    }
  }

  addProduct(data: any) {
    const solicitudId = this.solicitudCompra?.id || this.id || "";
    this.dialogHandlerS
      .openDialog(
        ProductAdd,
        { solicitudCompraId: solicitudId, id: data.id },
        "Agregar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  ProductModaladd(data: any) {
    const solicitudId = this.solicitudCompra?.id || this.id || "";
    this.dialogHandlerS
      .openDialog(
        ProductModalAdd,
        { solicitudCompraId: solicitudId, id: data.id },
        "Agregar",
        this.dialogHandlerS.sizeFull,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onModalCreateOrdenCompra() {
    this.dialogHandlerS
      .openDialog(
        CreateOrdenCompra,
        {
          solicitudCompraId: this.id,
          folioSolicitudCompra: this.solicitudCompra.folio,
        },
        "Crear Orden de compra",
        this.dialogHandlerS.sizeFull,
      )
      .then((ordenCompraId: any) => {
        if (ordenCompraId) {
          this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(ordenCompraId));
        }
      });
  }

  onAddOrEdit(id: string) {
    this.router.navigate(ROUTES.COMPRAS.ORDEN_COMPRA(id));
  }

  onSendWhatsApp() {
    if (!this.solicitudCompra) return;
    const message = this.getFormattedMessage();
    const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");
  }

  onSendEmail() {
    if (!this.solicitudCompra) return;
    const subject = `Solicitud de Cotización - Folio: ${this.solicitudCompra.folio}`;
    const body = this.getFormattedMessage();
    const mailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailUrl;
  }

  getFormattedMessage(): string {
    let message = `*Solicitud de Cotización*\n`;
    message += `Folio: ${this.solicitudCompra.folio}\n`;
    message += `Solicita: ${this.solicitudCompra.solicita}\n`;
    if (this.solicitudCompra.equipoOInstalacion)
      message += `área/Equipo: ${this.solicitudCompra.equipoOInstalacion}\n`;
    message += `\n*Detalle de Requerimiento:*\n`;

    this.SolicitudCompraDetalle.forEach((item, index) => {
      message += `${index + 1}. ${item.productName || item.producto} \n   Cant: ${item.cantidad} ${item.unidadMedida}\n`;
    });

    message += `\nGracias.`;
    return message;
  }

  onManageLinks() {
    this.dialogHandlerS
      .openDialog(
        PurchaseLinkManager,
        {},
        "Gestión de Vónculos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result) {
          this.onLoadData();
          this.onCotizacionesRelacionadas();
        }
      });
  }
}
