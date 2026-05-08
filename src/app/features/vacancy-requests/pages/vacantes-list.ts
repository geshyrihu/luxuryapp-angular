import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";
import { addIcons } from "ionicons";
import { briefcaseOutline } from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { FilterRequestsService } from "src/app/core/services/filter-requests.service";
import { StatusSolicitudVacanteService } from "src/app/core/services/status-solicitud-vacante.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { FilterRequests } from "src/app/features/recruitment/recruitment-shared/filter-requests";
import { WorkPositionHours } from "src/app/features/work-position/pages/work-position-hours";
import { RoleDescription } from "../../configuration/application-role/pages/role-description";
import { RegisterEmployeToVacancy } from "../components/register-employe-to-vacancy";
import { VacanteForm } from "../components/vacante-form";

@Component({
  selector: "app-vacantes-list",
  templateUrl: "./vacantes-list.html",
  imports: [
    CommonModule,
    TableModule,
    NgbDropdownModule,
    CustomButtonEdit,
    CustomButtonDelete,
    CustomButtonItem,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    FilterRequests,
    DataViewMobile,
    ActionMenu,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class VacantesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  filterRequestsService = inject(FilterRequestsService);
  authS = inject(AuthService);
  statusSolicitudVacanteService = inject(StatusSolicitudVacanteService);
  router = inject(Router);
  dialogHandlerS = inject(DialogHandlerService);
  tableScrollHeightS = inject(TableScrollHeightService);

  dataSignal = signal<any[]>([]);

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  ref: DynamicDialogRef;
  scrollHeight = this.tableScrollHeightS.scrollHeight;

  paramsEmit$ = toSignal(this.filterRequestsService.getParams$());

  constructor() {
    addIcons({ briefcaseOutline });
    effect(() => {
      this.paramsEmit$();
      this.onLoadData();
    });
  }

  ngOnInit(): void {
    // Logic moved to effect
  }

  onLoadData() {
    const urlApi = `RequestPosition/`;
    this.apiResponseS
      .onGetList(urlApi, this.filterRequestsService.getParams())
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`RequestPosition/${id}`)
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
        VacanteForm,
        {
          id: data.id,
        },
        "Editar",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  //Modal para visualizar horarios de la vacante
  onModalHoursWorkPosition(workPositionId: any) {
    this.dialogHandlerS
      .openDialog(
        WorkPositionHours,
        {
          id: workPositionId,
        },
        "Horario de trabajo",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  //Modal para visualizar descripcion de puesto
  onModalJobDescription(id: any) {
    this.dialogHandlerS
      .openDialog(
        RoleDescription,
        {
          id,
        },
        "Descripción del puesto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onRouteEstatusSolicitud(id) {
    this.statusSolicitudVacanteService.setPositionRequestId(id);
    this.router.navigate(["/reclutamiento/status-solicitud-vacante"]);
  }

  onModalRegisterEmployeToVacancy(data: any) {
    this.dialogHandlerS
      .openDialog(
        RegisterEmployeToVacancy,
        {
          workPositionId: data.workPositionId,
        },
        data.title,
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
