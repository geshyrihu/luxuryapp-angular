import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ElevatorLogsPdfService } from "../elevator-reports/elevator-logs-pdf.service";
import { ElevatorSparePartsChangeListDesktop } from "./desktop/elevator-spare-parts-change-list-desktop";
import { ElevatorSparePartsChangeForm } from "./elevator-spare-parts-change-form";
import { ElevatorSparePartsChangeListMobile } from "./mobile/elevator-spare-parts-change-list-mobile";

@Component({
  selector: "app-elevator-spare-parts-change-list",
  templateUrl: "./elevator-spare-parts-change-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ElevatorSparePartsChangeListDesktop,
    ElevatorSparePartsChangeListMobile,
  ],
})
export class ElevatorSparePartsChangeList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  pdfS = inject(ElevatorLogsPdfService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diálogo modal

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi =
      Endpoints.RefactorMantenimiento.elevatorSparePartsChangeListById(
        this.customerIdS.customerId(),
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(
        Endpoints.RefactorMantenimiento.elevatorSparePartsChangeById(id),
      )
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onPdfReport() {
    void this.pdfS.downloadSpareParts(this.dataSignal());
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ElevatorSparePartsChangeForm,
        {
          id: data.id,
          customerId: this.customerIdS.customerId(),
        },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
