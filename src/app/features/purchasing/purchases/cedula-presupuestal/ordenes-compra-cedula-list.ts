import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { IonBadge, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { chevronForwardOutline } from "ionicons/icons";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
@Component({
  selector: "app-ordenes-compra-cedula-list",
  templateUrl: "./ordenes-compra-cedula-list.html",
  imports: [
    CommonModule,
    TableModule,
    TooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonBadge,
  ],
})
export class OrdenesCompraCedulaListComponent implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  dialogHandlerS = inject(DialogHandlerService);
  ref = inject(DynamicDialogRef);
  globalFilterFieldsOption = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

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
