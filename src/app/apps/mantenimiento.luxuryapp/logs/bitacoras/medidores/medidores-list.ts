import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { WebButtonLabelAdd } from "@ui/buttons/web-label/button-add";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import * as FileSaver from "file-saver";
import { addIcons } from "ionicons";
import {
  add,
  createOutline,
  documentTextOutline,
  filter,
  flash,
  saveOutline,
  statsChartOutline,
  sunny,
  trashOutline,
} from "ionicons/icons";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ApplicationRole } from "src/app/core/interfaces/asp-net-roles.enum";
import { Medidor } from "src/app/core/interfaces/medidor.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { MedidorForm } from "./medidor-form";
import { MedidorLecturaForm } from "./medidor-lectura-form";

@Component({
  selector: "app-medidores-list",
  templateUrl: "./medidores-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonLabelDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
    CommonModule,
    TableModule,
    WebButtonLabelAdd,
    WebButtonLabelEdit,
    DataViewMobile,
    WebButtonLabelItem,
    AppIcon,
    WebButtonLabelEdit,
    WebButtonLabelItem,
  ],
})
export class MedidoresList {
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  public aspRoleS = inject(AspRoleService);
  public AspRole = ApplicationRole;
  private router = inject(Router);
  dataSignal = signal<Medidor[]>([]);
  ref: DynamicDialogRef;

  constructor() {
    addIcons({
      sunny,
      filter,
      flash,
      add,
      createOutline,
      trashOutline,
      saveOutline,
      statsChartOutline,
      documentTextOutline,
    });
    effect(() => {
      const customerId: string = this.customerIdS.customerId();
      if (customerId) this.onLoadData();
    });
  }

  onLoadData() {
    const urlApi = Endpoints.Meters.listByCustomer(
      this.customerIdS.customerId(),
    );
    this.apiResponseS
      .onGetList(urlApi)
      .then((result: any) => this.dataSignal.set(result));
  }
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(Endpoints.Meters.delete(id))
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((data) =>
            data.filter((item) => item.id !== id),
          );
        }
      });
  }

  modalAddEdit(data: any) {
    this.dialogHandlerS
      .openDialog(MedidorForm, data, data.title, this.dialogHandlerS.sizeLg)
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  modalMedidorLecturaAddEdit(data: any) {
    this.dialogHandlerS
      .openDialog(
        MedidorLecturaForm,
        {
          medidorId: data.id,
          id: 0,
        },
        "Medidor",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  datosExcel: any[] = [];
  exportExcel(id: any) {
    const urlApi = Endpoints.MeterReadings.exportExcel(id);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      console.log("Datos recibidos de la API para Excel:", result); // Log para depuración
      this.datosExcel = result;
      if (result && result.length > 0) {
        this.generate();
      } else {
        console.log("No se generó el Excel porque no hay datos");
      }
    });
  }

  generate() {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.datosExcel);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ["data"],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "lecturas");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION, { autoBom: false });
  }

  onGoToLecturas(id: any): void {
    this.router.navigate(ROUTES.BITACORAS.MEDIDOR_LECTURA(id));
  }

  onGoToGrafico(id: any): void {
    this.router.navigate(ROUTES.BITACORAS.MEDIDOR_GRAFICO(id));
  }
}
