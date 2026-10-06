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
import { ElevatorsEmergencyCallListDesktop } from "./desktop/elevators-emergency-call-list-desktop";
import { ElevatorsEmergencyCallForm } from "./elevators-emergency-call-form";
import { ElevatorsEmergencyCallListMobile } from "./mobile/elevators-emergency-call-list-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-elevators-emergency-call-list",
  templateUrl: "./elevators-emergency-call-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ElevatorsEmergencyCallListDesktop, ElevatorsEmergencyCallListMobile],
})
export class ElevatorsEmergencyCallList {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
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
      Endpoints.RefactorMantenimiento.elevatorsEmergencyCallListById(
        this.customerIdS.customerId(),
      );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.RefactorMantenimiento.elevatorsEmergencyCallById(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onPdfReport() {
    void this.pdfS.downloadEmergencyCalls(this.dataSignal());
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        ElevatorsEmergencyCallForm,
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
