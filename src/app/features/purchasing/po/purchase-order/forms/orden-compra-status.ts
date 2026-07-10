import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";

import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
export interface IOrdenCompraStatusForm {
  id: FormControl<string | null>;
  ordenCompraId: FormControl<string | null>;
  sePago: FormControl<boolean | null>;
  seRecibio: FormControl<boolean | null>;
  recibidoPor: FormControl<string | null>;
  factura: FormControl<string | null>;
  folioFiscal: FormControl<string | null>;
  fechaFactura: FormControl<string | null>;
  pdfFile: FormControl<File | null>;
  xmlFile: FormControl<File | null>;
}

@Component({
  selector: "app-orden-compra-status",
  templateUrl: "./orden-compra-status.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputCheckSignal,
    CustomInputTextSignal,
    WebButtonLabelSave,
    TableModule,
    LxCard,
  ],
})
export class OrdenCompraStatus implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  submitting = signal(false);

  ordenCompraId: string = "";
  ordenCompraStatus: any;

  // El formulario se define como una propiedad
  form: FormGroup<IOrdenCompraStatusForm> =
    this.formB.group<IOrdenCompraStatusForm>({
      id: new FormControl(""),
      ordenCompraId: new FormControl(""),
      sePago: new FormControl(false),
      seRecibio: new FormControl(false),
      recibidoPor: new FormControl(""),
      // Campos que se llenarón automíticamente desde el XML
      factura: new FormControl({ value: "", disabled: true }),
      folioFiscal: new FormControl({ value: "", disabled: true }),
      fechaFactura: new FormControl({ value: "", disabled: true }),
      // Controles para los archivos que se subirón
      pdfFile: new FormControl(null),
      xmlFile: new FormControl(null),
    });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.OrdenCompraStatus.byOrdenCompra(this.ordenCompraId))
      .then((result: any) => {
        this.ordenCompraStatus = result;
        // Rellenamos el formulario con todos los datos, incluyendo factura y folioFiscal
        this.form.patchValue(result);
      });
  }

  onPdfFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ pdfFile: file });
    }
  }

  onXmlFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ xmlFile: file });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitting.set(true);

    const formData = this.createFormData(this.form.value);

    // Update only status fields (booleans)
    this.apiResponseS
      .onPut(
        Endpoints.OrdenCompraStatus.update(this.ordenCompraStatus.id),
        formData,
      )
      .then((result: any) => {
        this.ordenCompraStatus = result;
        this.form.patchValue(result);
        this.submitting.set(false);
        this.ref.close(true);
      })
      .catch(() => this.submitting.set(false));
  }

  onAddInvoice() {
    const pdf = this.form.get("pdfFile")?.value;
    const xml = this.form.get("xmlFile")?.value;

    if (!pdf && !xml) {
      // alert("Debes seleccionar al menos un archivo (PDF o XML)");
      return;
    }

    this.submitting.set(true);
    const formData = new FormData();
    if (pdf) formData.append("pdfFile", pdf);
    if (xml) formData.append("xmlFile", xml);

    this.apiResponseS
      .onPost(
        Endpoints.PurchaseOrders.uploadInvoice(this.ordenCompraId),
        formData,
      )
      .then((result: any) => {
        // Result should be the new Invoice object.
        // We need to refresh the list.
        // Simplest is to reload data or append to list.
        if (!this.ordenCompraStatus.facturas)
          this.ordenCompraStatus.facturas = [];
        this.ordenCompraStatus.facturas.push(result);

        // Clear inputs
        this.f.pdfFile.setValue(null);
        this.f.xmlFile.setValue(null);
        // Reset file inputs in DOM if needed (handled by resetting control usually)

        this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false));
  }

  onDeleteInvoice(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.OrdenCompraStatus.deleteInvoice(id))
      .then((result: boolean) => {
        if (result) {
          this.ordenCompraStatus.facturas =
            this.ordenCompraStatus.facturas.filter((x: any) => x.id !== id);
        }
      });
  }

  private createFormData(DTO: any): FormData {
    const formData = new FormData();
    // Aóadimos solo los campos que el backend espera para el [FromForm]
    formData.append("sePago", DTO.sePago);
    formData.append("seRecibio", DTO.seRecibio);
    formData.append("recibidoPor", DTO.recibidoPor);

    // Solo adjuntamos los archivos si han sido seleccionados
    if (DTO.pdfFile) {
      formData.append("pdfFile", DTO.pdfFile);
    }
    if (DTO.xmlFile) {
      formData.append("xmlFile", DTO.xmlFile);
    }

    return formData;
  }

  // deleteFile method deprecated/removed as we use onDeleteInvoice now
}
