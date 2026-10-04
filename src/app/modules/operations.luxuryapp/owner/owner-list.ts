import { ExcelExportService } from "@accounting.luxuryapp/general-ledger/budget-proposals/excel-export.service";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { Owner } from "@core/interfaces/list-condomino.interface";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { OwnerListDesktop } from "./desktop/owner-list-desktop";
import { OwnerListMobile } from "./mobile/owner-list-mobile";
import { OwnerForm } from "./owner-form";

@Component({
  selector: "app-owner-list",
  templateUrl: "./owner-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [OwnerListDesktop, OwnerListMobile],
})
export class OwnerList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  customerIdS = inject(CustomerIdService);
  excelExportS = inject(ExcelExportService);
  platformS = inject(PlatformService);

  dataSignal = signal<Owner[]>([]);
  public AspRole = ApplicationRole;
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  loading = signal(true);
  ref: DynamicDialogRef;

  canManage = computed(() =>
    this.aspRoleS.hasAny([
      ApplicationRole.Asistente,
      ApplicationRole.Administrador,
      ApplicationRole.SuperUsuario,
    ]),
  );

  constructor() {
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = Endpoints.Owner.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }

  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Owner.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(OwnerForm, data, data.title, this.dialogHandlerS.sizeXl)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onExportExcel() {
    this.excelExportS.exportOwnerList(
      this.dataSignal(),
      "Lista de Propietarios.xlsx",
    );
  }

  customSort(event: any) {
    event.data.sort((data1: any, data2: any) => {
      return this.customCompare(data1.property, data2.property);
    });
  }

  private customCompare(x: string, y: string): number {
    const regex = /(\D+)|(\d+)/g;
    const xMatches = x.match(regex);
    const yMatches = y.match(regex);

    const minMatches = Math.min(xMatches.length, yMatches.length);

    for (let i = 0; i < minMatches; i++) {
      const xPart = xMatches[i];
      const yPart = yMatches[i];

      let comparisonResult;

      // Si ambos son numíricos, los comparamos como enteros
      if (!isNaN(parseInt(xPart, 10)) && !isNaN(parseInt(yPart, 10))) {
        comparisonResult = parseInt(xPart, 10) - parseInt(yPart, 10);
      } else {
        // Si no son numíricos, comparamos como cadenas
        comparisonResult = xPart.localeCompare(yPart);
      }

      if (comparisonResult !== 0) {
        return comparisonResult;
      }
    }

    // Si todos los elementos hasta ahora son iguales, el mís corto es menor
    return xMatches.length - yMatches.length;
  }
}
