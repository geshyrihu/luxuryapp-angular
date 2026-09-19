import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
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
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
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
import { AppIcon } from "@ui/shared/app-icon/app-icon";

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
    TableEmptyMessage,
    ApiDatePipe,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    DataViewMobile,
    TableCaption,
    TableFooter,
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
  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();

  ngOnInit(): void {
    const type = this.route.snapshot.queryParams["type"] ?? "";
    this.equipmentType.set(type);
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(
        Endpoints.FireInspectionPeriod.listByCustomer(
          this.customerIdS.customerId(),
        ),
      )
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.FireInspectionPeriod.delete(id))
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

