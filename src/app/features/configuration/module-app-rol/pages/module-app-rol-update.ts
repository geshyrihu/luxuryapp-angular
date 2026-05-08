import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { IonList, IonToggle } from "@ionic/angular/standalone";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import {
  IModuleAppRolAssignedDTO,
  IModuleGroupRolDTO,
} from "../models/module-app-rol.dto";
@Component({
  selector: "app-module-app-rol-update",
  imports: [
    CommonModule,
    MessageModule,
    IonList,
    IonToggle,
    ProgressSpinnerModule,
  ],
  templateUrl: "./module-app-rol-update.html",
})
export class ModuleAppRolUpdate implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  // Declaración e inicialización de variables
  groupedData = signal<IModuleGroupRolDTO[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  roleId: string = "";
  roleName: string = ""; // Nombre del cliente para mostrar

  ngOnInit(): void {
    this.roleId = this.config.data.roleId;
    this.roleName = this.config.data.roleName;

    this.onLoadData(this.roleId); // Cargamos los datos cuando se obtiene el ID
  }

  onLoadData(roleId: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<
        IModuleGroupRolDTO[]
      >(Endpoints.ModuleAppRoles.assignments(roleId))
      .then((result) => {
        this.groupedData.set(result || []);
        this.loading.set(false);
      });
  }

  toggleModuleActivation(item: IModuleAppRolAssignedDTO): void {
    item.isAssigned = !item.isAssigned;
    this.updateModuleStatus(item);
  }

  updateModuleStatus(item: IModuleAppRolAssignedDTO): void {
    const data = {
      roleId: this.roleId,
      moduleAppId: item.moduleAppId,
      isAssigned: item.isAssigned,
    };

    this.apiResponseS
      .onPost(Endpoints.ModuleAppRoles.updateAssigned, data)
      .then(() => {
        // TODO: Aquí podemos mandar al bakcend el cambio para signalR y posterior actualizar le menu a los lcientes que corresponda
        // this.customerIdS.onLoadDataCustomer(this.customerIdS.customerId());
      });
  }
  checkIfTwoDigitsAndSpace(moduleAppName: string): boolean {
    if (!moduleAppName) return false;

    // Expresión regular para verificar si después de dos dígitos hay un espacio
    const regex = /^\d{2} /;
    const result = regex.test(moduleAppName);
    return result;
  }
}
