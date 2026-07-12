import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "primeng/table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
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

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";

@Component({
  selector: "app-fire-inspection-period-list",
  templateUrl: "./fire-inspection-period-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    TableModule,
    DataViewMobile,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
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
      .onGetList(`fire-inspection-period/list/${this.customerIdS.customerId()}`)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`fire-inspection-period/${id}`)
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
