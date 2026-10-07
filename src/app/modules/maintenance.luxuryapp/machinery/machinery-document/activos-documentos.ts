import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SwalService } from "@core/services/swal.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonWeb } from "@ui/buttons/web";
import { SubirPdf } from "@ui/inputs/web/lux-input-upload-pdf-signal";
@Component({
  selector: "app-activos-documentos",
  templateUrl: "./activos-documentos.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb, LxIcon, NgbTooltipModule],
})
export class ActivosDocumentos implements OnInit {
  apiResponseS = inject(ApiResponseService);
  swalS = inject(SwalService);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  customerIdS = inject(CustomerIdService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tableRows: number = tableRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  machineryId: any = 0;
  url: string = "";

  ngOnInit(): void {
    this.machineryId = this.config.data.machineryId;
    if (this.machineryId !== 0) this.onLoadData();
  }
  onLoadData() {
    const urlApi = Endpoints.MachineryDocuments.listByMachinery(
      this.machineryId,
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  async onDelete(id: any) {
    const ok = await this.swalS.confirm({
      title: "Confirmación",
      text: "¿Está seguro de eliminar este documento?",
      icon: "warning",
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
      focusCancel: true,
    });
    if (!ok) return;
    this.apiResponseS
      .onDelete(Endpoints.Machineries.deleteDocument(id))
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
          pathUrl: Endpoints.Machineries.uploadDocumentBase,
        },
        "Cargar Documentos",
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
