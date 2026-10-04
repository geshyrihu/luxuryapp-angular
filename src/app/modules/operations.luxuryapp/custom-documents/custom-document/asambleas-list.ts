import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { EDocumentType } from "@legal.luxuryapp/legal/interfaces/document-type.enum";
import { AsambleasListDesktop } from "./desktop/asambleas-list-desktop";
import { AsambleasListMobile } from "./mobile/asambleas-list-mobile";

@Component({
  selector: "app-asambleas",
  imports: [AsambleasListDesktop, AsambleasListMobile],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./asambleas-list.html",
})
export class Asambleas {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  authS = inject(AuthService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  filterText: string = "";

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.CustomDocuments.list(
      customerId,
      EDocumentType.Asambleas,
    );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.dataSignal.set(result.sort((a, b) => a.sortOrder - b.sortOrder));
    });
  }

  onRowReorder(event: { dragIndex: number; dropIndex: number }) {
    const reordered = [...this.dataSignal()];
    const [moved] = reordered.splice(event.dragIndex, 1);
    if (!moved) return;
    reordered.splice(event.dropIndex, 0, moved);
    this.dataSignal.set(reordered);
    const documentIds = reordered.map((item) => item.id);
    this.apiResponseS
      .onPut(Endpoints.CustomDocuments.updateOrder, { documentIds })
      .then((result) => {
        // Opcional: Mostrar una notificación de éxito
      })
      .catch((error) => {
        // Opcional: Manejar el error y revertir el orden si es necesario
      });
  }
}
