import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { MenuItem } from "primeng/api";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { OrdenesCompraCedulaListComponent } from "src/app/features/purchases/cedula-presupuestal/ordenes-compra-cedula-list";
import { PresupuestoAddPartida } from "../presupuesto/presupuesto-add-partida";
import { PresupuestoEditPartida } from "../presupuesto/presupuesto-edit-partida";
import { InfoCuenta } from "./info-cuenta";
import { MantenimientosProgramados } from "./mantenimientos-programados";
import { PresupuestoDetalleEdicionHistorial } from "./presupuesto-detalle-edicion-historial";
import { PresupuestoEditionFile } from "./presupuesto-edition-file";
@Component({
  selector: "app-presupuesto-individual",
  templateUrl: "./presupuesto-individual.html",
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    CustomButton,
    NgbTooltipModule,
    PrimeNgCustomCaption,
    FormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
  ],
})
export class PresupuestoIndividual implements OnInit {
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  private activatedRoute = inject(ActivatedRoute);
  // Declaración e inicialización de variables
  id: string = "";
  applicationUserId: string = this.authS.applicationUserId;
  data: any;
  budgetDetail: any[] = [];
  globalFilterFields: string[] = [];
  loading = signal(true);
  ref: DynamicDialogRef; // Referencia a un cuadro de diólogo modal

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.params.id;
    // Cuando se inicia el componente, cargar los datos de los bancos
    this.onLoadData();
  }

  getMenuItems(item: any): MenuItem[] {
    return [
      {
        label: "Agregar documentos",
        icon: "pi pi-file-plus",
        command: () => this.onModalDocument(item.id),
      },
      {
        label: "Historial",
        icon: "pi pi-calendar",
        command: () => this.onGetHistorial(item.id),
      },
      {
        label: "Servicios calendarizados",
        icon: "pi pi-calendar",
        command: () => this.ServiciosMttoProgramados(item.accountId),
      },
      {
        label: "Eliminar",
        icon: "pi pi-trash",
        command: () => this.onDelete(item.id),
      },
    ];
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(`Presupuesto/GetById/${this.id}`)
      .then((result: any) => {
        this.data = result;
        this.budgetDetail = result.budgetDetailDTO;

        this.globalFilterFields = globalFilterFields(this.budgetDetail);
      });
  }
  DownloadExcel() {
    const urlApi = `Presupuesto/GetByIdExcel/${this.id}`;

    const nameReport = "Presupeusto";

    this.apiResponseS.onDownloadFile(urlApi, nameReport);
  }
  onModalAdd() {
    this.dialogHandlerS
      .openDialog(
        PresupuestoAddPartida,
        {
          idBudgetCard: this.id,
        },
        "Agregar Partida",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  // Función para eliminar un partida presupuestal
  onDelete(id: any) {
    this.apiResponseS
      .onDelete(`cedulapresupuestal/cedulapresupuestaldetalle/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.data = this.data.filter((item: any) => item.id !== id);
        }
      });
  }
  // Función para eliminar
  onGetHistorial(id: any) {
    this.dialogHandlerS.openDialog(
      PresupuestoDetalleEdicionHistorial,
      {
        id,
      },
      "Historial de movimientos",
      this.dialogHandlerS.sizeLg,
    );
  }
  onModalInfoCuenta() {
    this.dialogHandlerS.openDialog(
      InfoCuenta,
      {
        id: this.id,
      },
      "Consideraciones",
      this.dialogHandlerS.sizeLg,
    );
  }

  // Función para abrir un cuadro de diólogo modal para agregar o editar información sobre un banco
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoEditPartida,
        {
          id: this.id,
        },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  ServiciosMttoProgramados(cuentaId: any) {
    this.dialogHandlerS.openDialog(
      MantenimientosProgramados,
      {
        cuentaId: cuentaId,
      },
      "Mantenimientos programados",
      this.dialogHandlerS.sizeLg,
    );
  }

  onModalDocument(id: any) {
    this.dialogHandlerS
      .openDialog(
        PresupuestoEditionFile,
        {
          id: id,
        },
        "Soporte documentos",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onEnterPressed(item: any) {
    // Mostrar un mensaje de carga
    // this.customToastService.onLoading();

    const data = {
      id: item.id,
      applicationUserId: this.applicationUserId,
      monthlyBudget: item.monthlyBudget,
    };

    this.apiResponseS.onPost(`Presupuesto/UpdateAccount/`, data).then((_) => {
      const index = this.data.budgetDetailDTO.findIndex(
        (existingItem) => existingItem.id === data.id,
      );
      // Calcula el porcentaje de aumento
      const porcentaje = this.PorcentajeAumento(
        data.monthlyBudget,
        item.monthlyBudgetFormet,
      ); // Reemplaza 'originalValor' por el valor correcto

      if (index !== -1) {
        // Actualiza el elemento en la matriz
        this.data.budgetDetailDTO[index] = {
          ...this.data.budgetDetailDTO[index],
          monthlyBudget: parseFloat(data.monthlyBudget).toLocaleString(),
          percentageIncrease: porcentaje,
          totalBudget: (
            this.data.duracion * parseFloat(data.monthlyBudget)
          ).toLocaleString(),
        };
      }
    });
  }
  onEnterPressedPorcentaje(item: any) {
    if (item.percentageIncrease > 100) return;
    // Obtón el valor original de monthlyBudget (asegórate de que sea un nómero)
    const monthlyBudgetOriginal = parseFloat(
      item.monthlyBudgetFormet.replace(/,/g, ""),
    );

    // Obtón el porcentaje de aumento (asegórate de que sea un nómero)
    const percentageIncrease = parseFloat(item.percentageIncrease);

    if (isNaN(monthlyBudgetOriginal) || isNaN(percentageIncrease)) {
      // Maneja valores no vólidos
      return;
    }

    // Calcula el nuevo valor de monthlyBudget aplicando el porcentaje de aumento
    const newmonthlyBudget =
      monthlyBudgetOriginal * (1 + percentageIncrease / 100);

    // Aquó puedes hacer lo que necesites con monthlyBudgetFormet
    // Por ejemplo, llenar el objeto que se enviaró en el POST
    const data = {
      id: item.id,
      applicationUserId: this.applicationUserId,
      monthlyBudget: newmonthlyBudget,
    };

    this.apiResponseS.onPost(`Presupuesto/UpdateAccount/`, data).then(() => {
      // Cuando se actualiza el elemento con óxito, buscar su óndice en la matriz
      const index = this.data.budgetDetailDTO.findIndex(
        (existingItem) => existingItem.id === data.id,
      );

      if (index !== -1) {
        // Actualiza el elemento en la matriz
        this.data.budgetDetailDTO[index] = {
          ...this.data.budgetDetailDTO[index],
          monthlyBudget: newmonthlyBudget.toLocaleString(),
          percentageIncrease: percentageIncrease.toFixed(2) + "%",
          totalBudget: (this.data.duracion * newmonthlyBudget).toLocaleString(),
        };
      }
    });
  }

  onModalOrdenesCompraCedula(
    presupuestoAnteriorDetalleId: any,
    presupuestoAnteriorId: any,
  ) {
    this.dialogHandlerS
      .openDialog(
        OrdenesCompraCedulaListComponent,
        {
          partidaPresupuestalId: presupuestoAnteriorDetalleId,
          cedulaPresupuestalId: presupuestoAnteriorId,
        },
        "Ordenes de Compra",
        this.dialogHandlerS.sizeFull,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  private PorcentajeAumento(
    nuevoValor: string,
    originalValor: string | null,
  ): string {
    // Elimina comas de los valores y convierte a nómeros
    const nuevoValorNumero = parseFloat(nuevoValor.replace(/,/g, ""));

    const originalValorNumero = parseFloat(originalValor.replace(/,/g, ""));

    if (
      isNaN(nuevoValorNumero) ||
      isNaN(originalValorNumero) ||
      originalValorNumero === 0
    ) {
      return "N/A"; // Maneja valores no vólidos o cero
    }

    const aumento = nuevoValorNumero - originalValorNumero;
    const porcentajeAumento = (aumento / originalValorNumero) * 100;

    return porcentajeAumento.toFixed(2) + "%";
  }
}
