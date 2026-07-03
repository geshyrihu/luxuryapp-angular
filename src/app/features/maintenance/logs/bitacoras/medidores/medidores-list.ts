import { CommonModule } from "@angular/common";
import { Component, effect, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { IonButton } from "@ionic/angular/standalone";
import { ROUTES } from "src/app/routing/route-paths";
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
import { CardModule } from "primeng/card";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { TooltipModule } from "primeng/tooltip";
import { WebButtonLabelAdd } from "src/app/core/components/buttons/web-label/button-add";
import { WebButtonLabelDelete } from "src/app/core/components/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "src/app/core/components/buttons/web-label/button-edit";
import { WebButtonLabelItem } from "src/app/core/components/buttons/web-label/button-item";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { IMedidor } from "src/app/core/interfaces/medidor.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { MedidorForm } from "./medidor-form";
import { MedidorLecturaForm } from "./medidor-lectura-form";
@Component({
  selector: "app-medidores-list",
  templateUrl: "./medidores-list.html",
  imports: [
    CommonModule,
    TableModule,
    WebButtonLabelAdd,
    WebButtonLabelDelete,
    WebButtonLabelEdit,
    DataViewMobile,
    CardModule,
    TooltipModule,
    WebButtonLabelItem,
    IonButton,
    ActionMenu,
    AppIcon,
    WebButtonLabelDelete,
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
  public AspRole = EApplicationRole;
  private router = inject(Router);
  dataSignal = signal<IMedidor[]>([]);
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
