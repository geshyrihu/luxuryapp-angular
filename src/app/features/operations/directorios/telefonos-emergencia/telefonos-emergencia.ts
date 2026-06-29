import { Component, computed, effect, inject, signal } from "@angular/core";
import { AvatarModule } from "primeng/avatar";
import { CustomSearchInput } from "src/app/core/components/web/inputs/custom-search-input-signal";
import { TooltipModule } from "primeng/tooltip";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButtonAdd } from "src/app/core/components/web/buttons/custom-button-add";
import { CustomButtonDelete } from "src/app/core/components/web/buttons/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/web/buttons/custom-button-edit";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TelefonosEmergenciaForm } from "./telefonos-emergencia-form";

@Component({
  selector: "app-telefonos-emergencia",
  templateUrl: "./telefonos-emergencia.html",
  imports: [
    AppIcon,
    AvatarModule,
    CustomButtonAdd,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomSearchInput,
    TooltipModule,
  ],
})
export class TelefonosEmergencia {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  aspRoleS = inject(AspRoleService);
  AspRole = EApplicationRole;

  dataSignal = signal<any[]>([]);
  searchTerm = signal("");

  filteredData = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.dataSignal();
    return this.dataSignal().filter((item) =>
      [item.instancia, item.telefonoUno, item.telefonoDos, item.direccion].some(
        (v) => v?.toLowerCase().includes(term),
      ),
    );
  });

  constructor() {
    effect(() => {
      this.onLoadData();
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.EmergencyPhones.getAll)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.EmergencyPhones.delete(id))
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
        TelefonosEmergenciaForm,
        data,
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}

