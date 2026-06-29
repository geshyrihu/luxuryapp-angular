import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button"; // Nueva importación
import { CustomButtonConfirm } from "src/app/core/components/web/buttons/custom-button-confirm";
import { SubirPdf } from "src/app/core/components/web/inputs/custom-input-upload-pdf-signal";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-activos-documentos",

  templateUrl: "./activos-documentos.html",
  imports: [NgbTooltipModule, CustomButtonConfirm, CustomButton],
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
      .onDelete(`Machineries/DeleteDocument/${id}`)
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
          pathUrl: "Machineries/SubirDocumento/",
        },
        "Cargar Documentos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

