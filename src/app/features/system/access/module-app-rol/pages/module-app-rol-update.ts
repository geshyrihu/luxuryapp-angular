import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";

import { IonInputToggle } from "@ui/inputs/mobile/ion-input-toggle";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
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
    LxMessage,
    IonInputToggle,
    LxSpinner,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./module-app-rol-update.html",
})
export class ModuleAppRolUpdate implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  // Declaracion e inicializacion de variables
  groupedData = signal<IModuleGroupRolDTO[]>([]);

  globalFilterFields: string[] = [];
  loading = signal(true);
  readonly tablePrimeNgRows: number = tablePrimeNgRows();
  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

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
      .onGetList<IModuleGroupRolDTO[]>(Endpoints.ModuleAppRoles.assignments(roleId))
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
        this.onLoadData(this.roleId);
        // TODO: Aqui podemos mandar al backend el cambio para signalR y posterior actualizar el menu a los clientes que corresponda
        // this.customerIdS.onLoadDataCustomer(this.customerIdS.customerId());
      });
  }

  checkIfTwoDigitsAndSpace(moduleAppName: string): boolean {
    if (!moduleAppName) return false;

    // Expresion regular para verificar si despues de dos digitos hay un espacio
    const regex = /^\d{2} /;
    const result = regex.test(moduleAppName);
    return result;
  }
}
