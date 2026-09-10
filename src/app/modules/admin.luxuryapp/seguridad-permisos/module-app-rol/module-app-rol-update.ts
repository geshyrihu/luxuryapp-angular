import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { LxMessage } from "@ui/adaptive/message/message";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { IonInputToggle } from "@ui/inputs/mobile/ion-input-toggle";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { ModuleAppRolAssignedDto } from "./interfaces/module-app-rol-assigned.dto";
import { ModuleGroupRolDto } from "./interfaces/module-group-rol.dto";

@Component({
  selector: "app-module-app-rol-update",
  imports: [AppIcon, CommonModule, LxMessage, IonInputToggle, LxSpinner],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./module-app-rol-update.html",
})
export class ModuleAppRolUpdate implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  // Declaracion e inicializacion de variables
  groupedData = signal<ModuleGroupRolDto[]>([]);

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
      .onGetList<ModuleGroupRolDto[]>(
        Endpoints.ModuleAppRoles.assignments(roleId),
      )
      .then((result) => {
        this.groupedData.set(result || []);
        this.loading.set(false);
      });
  }

  toggleModuleActivation(item: ModuleAppRolAssignedDto): void {
    item.isAssigned = !item.isAssigned;
    this.updateModuleStatus(item);
  }

  updateModuleStatus(item: ModuleAppRolAssignedDto): void {
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
