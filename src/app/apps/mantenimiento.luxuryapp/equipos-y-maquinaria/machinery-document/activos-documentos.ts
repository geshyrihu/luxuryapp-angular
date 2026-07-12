import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { WebButtonLabel } from "@ui/buttons/web-label/button"; // Nueva importación
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { SubirPdf } from "@ui/inputs/web/custom-input-upload-pdf-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
@Component({
  selector: "app-activos-documentos",

  templateUrl: "./activos-documentos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,NgbTooltipModule, WebButtonLabelConfirm, WebButtonLabel],
})
export class ActivosDocumentos implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  machineryId: any = 0;
  url: string = "";

  ngOnInit(): void {
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = `MachineryDocument/list/${this.machineryId}`;
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`machineries/DeleteDocument/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }
  onModalFormUploadDoc(id: any) {
    this.dialogHandlerS
      .openDialog(
        SubirPdf,
        {
          serviceOrderId: id,
          pathUrl: "machineries/SubirDocumento/",
        },
        "Cargar Documentos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
