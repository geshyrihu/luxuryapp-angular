import { Component, computed, inject, OnInit, signal } from "@angular/core";
import { Router } from "@angular/router";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { TagModule } from "primeng/tag";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { Endpoints } from "src/app/core/constants/endpoints";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { getStatusSeverity } from "src/app/features/recursos-humanos/helpers/status-severity.helper";
import { VacationRequestMyDTO } from "src/app/features/recursos-humanos/interfaces/vacation-request.interface";
import { VacacionesForm } from "./vacaciones-form";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { IonButtonItem } from "src/app/core/components/buttons/mobile/ion-button-item";
@Component({
  selector: "app-mis-vacaciones-listado",
  templateUrl: "./mis-vacaciones-listado.html",
  imports: [
    TableModule,
    TagModule,
    CustomButton,
    CustomButtonItem,
    CustomButtonEdit,
    CustomButtonDelete,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    ActionMenu,
    DataViewMobile,
    IonButtonItem,
  ],
})
export class MisVacacionesListado implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  router = inject(Router);
  getStatusSeverity = getStatusSeverity;
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<VacationRequestMyDTO[]>([]);
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = computed(() => {
    const data = this.dataSignal();
    return Array.isArray(data) && data.length > 0
      ? globalFilterFields(data)
      : [];
  });
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<VacationRequestMyDTO[]>(Endpoints.HR.VacationRequest.getAll)
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.HR.VacationRequest.delete(id))
      .then(() => {
      this.dataSignal.update((currentData) =>
        currentData.filter((item) => item.id !== id),
      );
    });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(VacacionesForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
  onNavSaldo() {
    this.router.navigate(["/recursos-humanos/saldo-vacaciones"]);
  }
  onDetail(id: string) {
    this.router.navigate(["/recursos-humanos/vacaciones", id, "detalle"]);
  }
}






