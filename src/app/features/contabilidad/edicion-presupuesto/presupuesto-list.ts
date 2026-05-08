import { CommonModule } from "@angular/common";
import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { barChartOutline } from "ionicons/icons";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ActionMenu } from "src/app/core/components/action-menu/action-menu";
import { IonButtonDelete } from "src/app/core/components/buttons/mobile/ion-button-delete";
import { IonButtonEdit } from "src/app/core/components/buttons/mobile/ion-button-edit";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableFooter } from "src/app/core/components/primeng-custom-table-footer/primeng-custom-table-footer";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { PresupuestoAdd } from "src/app/features/contabilidad/edicion-presupuesto/presupuesto-add";
import { PeriodoCedulaForm } from "src/app/features/purchases/cedula-presupuestal/periodo-cedula-form";
@Component({
  selector: "app-presupuesto-list",
  templateUrl: "./list-presupuesto.html",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    CustomButton,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    CustomButtonEdit,
    ActionMenu,
    DataViewMobile,
    IonButtonEdit,
    IonButtonDelete,
    IonItem,
    IonLabel,
    IonIcon,
  ],
})
export class PresupuestoList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  customToastService = inject(CustomToastService);
  router = inject(Router);
  dataSignal = signal<any[]>([]);
  public AspRole = EApplicationRole;

  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  constructor() {
    addIcons({ barChartOutline });
  }

  ngOnInit() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }
  onLoadData() {
    this.apiResponseS
      .onGetList(`Presupuesto/GetList/${this.customerIdS.customerId()}`)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onFinished(cedulaId: any, finished: boolean) {
    this.apiResponseS
      .onGetItem(`Presupuesto/Finished/${cedulaId}/${finished}`)
      .then((result: any) => {
        // Actualiza solo el registro afectado en lugar de toda la lista
        const updatedRecord = result;
        this.dataSignal.update((data) => {
          return data.map((record) =>
            record.id === updatedRecord.id ? updatedRecord : record,
          );
        });
        this.customToastService.showError(
          "Error al crear",
          "No se pudo completar la operación.",
        );
      });
  }

  onAddPresupuesto(id: any) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoAdd,
        {
          id: id,
        },
        "Agregar presupuesto",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onModalForm(id: any) {
    this.dialogHandlerS
      .openDialog(
        PeriodoCedulaForm,
        {
          cedulaId: id,
        },
        "Editar Periodo",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
  onGetPresupuestoDetalle(id: any) {
    this.router.navigate(["/purchases/presupuesto/", id]);
  }

  // Función para eliminar
  onDelete(id: any) {
    this.apiResponseS.onDelete(`presupuesto/${id}`).then((result: boolean) => {
      if (result)
        this.dataSignal.update((data) => data.filter((item) => item.id !== id));
    });
  }
}
