import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label/button"; // Nueva importación
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal"; // Added
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";

import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip"; // Added
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
export interface IOrdenCompraFacturaForm {
  pdfFile: FormControl<File | null>;
  xmlFile: FormControl<File | null>;
  tipoComprobante: FormControl<string | null>;
}

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { LxCard } from "@ui/adaptive/card/card";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-orden-compra-factura-form",
  templateUrl: "./orden-compra-factura-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonIconEdit,
    WebButtonIconDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputFile,
    WebButtonLabel,
    CustomInputSelectSignal,
    TooltipModule, LxCard, AppIcon],
})
export class OrdenCompraFacturaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  submitting = signal(false);
  isEditing = signal(false);
  editingInvoiceId: string | null = null;

  ordenCompraId: string = "";
  facturas: WritableSignal<any[]> = signal([]);

  cb_tipos = [
    { label: "Egreso (Factura)", value: "I" },
    { label: "Ingreso (Nota de Cródito)", value: "E" }
  ];

  form: FormGroup<IOrdenCompraFacturaForm> =
    this.formB.group<IOrdenCompraFacturaForm>({
      pdfFile: new FormControl(null),
      xmlFile: new FormControl(null),
      tipoComprobante: new FormControl("I"), // 'I' por defecto (Ingreso)
    });

  ngOnInit(): void {
    if (this.config.data) {
      this.ordenCompraId = this.config.data.ordenCompraId;
      this.facturas.set(this.config.data.facturas || []);
    }
  }

  toggleType(invoice: any) {
    const newType = invoice.tipoComprobante === "E" ? "I" : "E";
    this.apiResponseS
      .onPatch(Endpoints.OrdenCompraStatus.updateInvoiceType(invoice.id), {
        tipoComprobante: newType,
      })
      .then((result) => {
        if (result) {
          invoice.tipoComprobante = newType;
        }
      });
  }

  onPdfFileChange(file: File) {
    if (file) {
      this.form.patchValue({ pdfFile: file });
    }
  }

  onXmlFileChange(file: File) {
    if (file) {
      this.form.patchValue({ xmlFile: file });
    }
  }

  onEditInvoice(invoice: any) {
    this.isEditing.set(true);
    this.editingInvoiceId = invoice.id;
    this.form.patchValue({
      tipoComprobante: invoice.tipoComprobante || "I",
      pdfFile: null,
      xmlFile: null,
    });
  }

  onCancelEdit() {
    this.isEditing.set(false);
    this.editingInvoiceId = null;
    this.form.reset({ tipoComprobante: "I" });
  }

  onSubmit() {
    if (this.isEditing()) {
      this.onUpdateInvoice();
    } else {
      this.onAddInvoice();
    }
  }

  onUpdateInvoice() {
    const pdf = this.form.get("pdfFile")?.value;
    const xml = this.form.get("xmlFile")?.value;
    const tipo = this.form.get("tipoComprobante")?.value;

    this.submitting.set(true);
    const formData = new FormData();
    if (pdf) formData.append("PdfFile", pdf);
    if (xml) formData.append("XmlFile", xml);
    formData.append("TipoComprobante", tipo);

    this.apiResponseS
      .onPut(
        Endpoints.OrdenCompraStatus.updateInvoice(this.editingInvoiceId),
        formData,
      )
      .then((result: any) => {
        this.facturas.update((values) => {
          const index = values.findIndex((x) => x.id === this.editingInvoiceId);
          if (index !== -1) {
            values[index] = result;
          }
          return [...values];
        });
        this.onCancelEdit();
        this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false));
  }

  onAddInvoice() {
    const pdf = this.form.get("pdfFile")?.value;
    const xml = this.form.get("xmlFile")?.value;
    const tipo = this.form.get("tipoComprobante")?.value;

    if (!pdf && !xml) {
      return;
    }

    this.submitting.set(true);
    const formData = new FormData();
    if (pdf) formData.append("PdfFile", pdf);
    if (xml) formData.append("XmlFile", xml);
    formData.append("TipoComprobante", tipo);

    this.apiResponseS
      .onPost(
        Endpoints.PurchaseOrders.uploadInvoice(this.ordenCompraId),
        formData,
      )
      .then((result: any) => {
        this.facturas.update((values) => [...values, result]);

        // Reset inputs
        this.form.patchValue({
          pdfFile: null,
          xmlFile: null,
          tipoComprobante: "I",
        });

        this.submitting.set(false);
      })
      .catch(() => this.submitting.set(false));
  }
  // Funcion para eliminar un banco y refres
  onDeleteInvoice(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.OrdenCompraStatus.deleteInvoice(id))
      .then((response: boolean) => {
        if (response) {
          this.facturas.update((values) =>
            values.filter((invoice) => invoice.id !== id),
          );
        }
      });
  }
}
