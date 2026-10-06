import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { FormControl } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { TableScrollHeightService } from "@core/services/table-scroll-height.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";
import { DocumentoPersonalizadoForm } from "./documento-personalizado-form";
import { DocumentoPersonalizadoListaDesktop } from "./desktop/documento-personalizado-lista-desktop";
import { DocumentoPersonalizadoListaMobile } from "./mobile/documento-personalizado-lista-mobile";

@Component({
  selector: "app-documento-personalizado-lista",
  imports: [
    DocumentoPersonalizadoListaDesktop,
    DocumentoPersonalizadoListaMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./documento-personalizado-lista.html",
})
export class DocumentoPersonalizadoLista implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  route = inject(ActivatedRoute);
  tableScrollHeightS = inject(TableScrollHeightService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  documentType: EDocumentType | undefined;
  pageTitle: string = "";

  private routeDataSignal = toSignal(this.route.data);

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId && this.documentType !== undefined) this.onLoadData();
    });

    effect(() => {
      const data = this.routeDataSignal();
      if (data) {
        this.pageTitle = data["title"];
        this.documentType = data["documentType"];
      }
    });
  }

  ngOnInit(): void {
    // Logic moved to effects
  }

  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  filterTextControl = new FormControl<string>("");

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    this.apiResponseS
      .onGetList(
        Endpoints.CustomDocuments.list(customerId, this.documentType as number),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        DocumentoPersonalizadoForm,
        { id: data.id, documentType: this.documentType },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  async onDelete(id: string) {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este documento?",
    );
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.CustomDocuments.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((current) =>
            current.filter((item) => item.id !== id),
          );
      });
  }
}
