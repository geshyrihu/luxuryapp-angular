import { CommonModule } from "@angular/common";
import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web/label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web/label/button-edit";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomTableEmptyMessage } from "src/app/core/components/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/web/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FireInspectionPeriodForm } from "../period-form/fire-inspection-period-form";

const typeRouteMap: Record<string, string> = {
  extintor: "fire-inspection-period-extintor",
  hidrante: "fire-inspection-period-hidrante",
  estacion: "fire-inspection-period-estacion",
  detector: "fire-inspection-period-detector",
};

const typeLabelMap: Record<string, string> = {
  extintor: "Extintores",
  hidrante: "Hidrantes",
  estacion: "Estaciones Manuales",
  detector: "Detectores de Humo",
};
@Component({
  selector: "app-fire-inspection-period-list",
  templateUrl: "./fire-inspection-period-list.html",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    IonItem,
    IonLabel,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
  ],
})
export class FireInspectionPeriodList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  customerIdS = inject(CustomerIdService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  equipmentType = signal<string>("");
  typeLabel = computed(
    () => typeLabelMap[this.equipmentType()] ?? "Equipos contra Incendio",
  );

  dataSignal = signal<any[]>([]);
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  ngOnInit(): void {
    const type = this.route.snapshot.queryParams["type"] ?? "";
    this.equipmentType.set(type);
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(`FireInspectionPeriod/list/${this.customerIdS.customerId()}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`FireInspectionPeriod/${id}`)
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        FireInspectionPeriodForm,
        { id: data.id },
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onViewDetail(id: string) {
    const type = this.equipmentType();
    const routeSegment =
      typeRouteMap[type] ?? "fire-inspection-period-extintor";
    this.router.navigate(["/logbook", routeSegment, id]);
  }
}
