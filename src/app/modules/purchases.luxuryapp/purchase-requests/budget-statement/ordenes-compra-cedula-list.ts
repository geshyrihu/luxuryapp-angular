import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { addIcons } from "ionicons";
import { chevronForwardOutline } from "ionicons/icons";
import { OrdenesCompraCedulaListDesktop } from "./desktop/ordenes-compra-cedula-list-desktop";
import { OrdenesCompraCedulaListMobile } from "./mobile/ordenes-compra-cedula-list-mobile";

@Component({
  selector: "app-ordenes-compra-cedula-list",
  templateUrl: "./ordenes-compra-cedula-list.html",
  imports: [OrdenesCompraCedulaListDesktop, OrdenesCompraCedulaListMobile],
})
export class OrdenesCompraCedulaListComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  dialogHandlerS = inject(DialogHandlerService);
  ref = inject(DynamicDialogRef);
  platformS = inject(PlatformService);
  globalFilterFieldsOption = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);

  dataSignal = signal<any[]>([]);
  id: string = "";

  pagadas = signal(0);
  noPagadas = signal(0);

  constructor() {
    addIcons({ chevronForwardOutline });
  }

  ngOnInit(): void {
    if (this.config.data) {
      this.id = this.config.data.id;
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CedulaPresupuestal.ordenesCompra(this.id))
      .then((result: any) => {
        this.dataSignal.set(result);
        this.calculeTotales();
      });
  }

  onOrdenCompraModal(id: any) {
    // Implement or leave empty if functionality is missing
  }

  calculeTotales() {
    this.pagadas.set(
      this.dataSignal()
        .filter((x) => x.statuspago == "Pagada")
        .reduce((sum, current) => sum + current.total, 0),
    );

    this.noPagadas.set(
      this.dataSignal()
        .filter((x) => x.statuspago == "No Pagada")
        .reduce((sum, current) => sum + current.total, 0),
    );
  }
}
