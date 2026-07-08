// --------------------------------------------------------------
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { PrimeNgCustomToast } from "@ui/web/primeng-custom-toast/primeng-custom-toast";
import { MessageService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { TableModule } from "primeng/table";

import { TooltipModule } from "primeng/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { OrdenCompraService } from "src/app/core/services/orden-compra.service";
import { LxTag } from "@ui/adaptive/tag/tag";

@Component({
  selector: "app-orden-compra-presupuesto",
  templateUrl: "./orden-compra-presupuesto.html",
  imports: [WebButtonIconItem,
    TooltipModule,
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    AppSpinner,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    PrimeNgCustomToast, LxTag],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [MessageService],
})
export class OrdenCompraPresupuesto implements OnInit, OnDestroy {
  //----------------------------------------------------------------
  // 1. INYECCIóN DE DEPENDENCIAS
  //----------------------------------------------------------------
  // Aqué puro `inject`, nada de constructores kilomítricos ?
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  aspRoleS = inject(AspRoleService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  // Hacemos póblico el servicio para usar sus signals directo en el template ??
  public ordenCompraService = inject(OrdenCompraService);
  ref = inject(DynamicDialogRef);
  messageService = inject(MessageService);
  //----------------------------------------------------------------
  // 2. ESTADO DEL COMPONENTE
  //----------------------------------------------------------------
  // Datos que vienen de la API (partidas presupuestales)
  dataSignal = signal<any[]>([]);
  // Aóo en curso (lo vamos a usar para filtrar info del presupuesto)
  intYearControl = new FormControl<number>(new Date().getFullYear());
  availableYears = [
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 }
  ];
  // Id de la orden de compra que viene desde el modal
  ordenCompraId: string = "";

  // Signals para manejar loading y submitting ??
  loading = signal(true);
  submitting = signal(false);

  // Opciones de la tabla de PrimeNG
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();

  // Nota: eliminamos `total` porque ahora vive feliz en el servicio ??

  //----------------------------------------------------------------
  // 3. CICLO DE VIDA
  //----------------------------------------------------------------
  ngOnInit(): void {
    this.ordenCompraId = this.config.data.ordenCompraId;
    this.onLoadData(); // cargamos las partidas al inicio
  }

  //----------------------------------------------------------------
  // 4. MéTODOS PRINCIPALES
  //----------------------------------------------------------------
  // Cargar data desde la API (las cuentas presupuestales)
  async onLoadData() {
    this.loading.set(true);

    const customerId: string = this.customerIdS.customerId();
    const urlApi = Endpoints.Presupuestos.toPurchaseOrder(
      customerId,
      this.ordenCompraId,
      this.intYearControl.value,
    );

    const result: any = await this.apiResponseS.onGetList(urlApi);
    if (result) {
      const accounts = result.accounts.map((acc: any) => ({
        ...acc,
        dineroUsadoControl: new FormControl<number | null>(
          acc.dineroUsado || null,
        ),
      }));
      this.dataSignal.set(accounts);
    }

    this.loading.set(false);
  }

  // Guardar una partida presupuestal ??
  async onSubmit(item: any) {
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();

    // Validaciones express ??
    const dineroUsado = item.dineroUsadoControl.value;
    if (!dineroUsado || dineroUsado <= 0) {
      this.showMessage("Debe ingresar un monto vólido", "error");
      return;
    }
    if (dineroUsado > totalPorCubrir) {
      this.showMessage(
        "El monto no puede exceder el total por cubrir",
        "error",
      );
      return;
    }

    this.submitting.set(true);

    const purchaseOrderBudget: PurchaseOrderBudget = {
      ordenCompraId: this.ordenCompraId,
      fiscalYear: this.intYearControl.value?.toString() || "",
      accountNumber: item.accountNumber,
      accountName: item.accountName,
      amount: dineroUsado,
    };

    // Post a la API y actualización automítica del total ??
    this.apiResponseS
      .onPost(Endpoints.PurchaseOrderBudgets.create, purchaseOrderBudget)
      .then(async () => {
        await this.ordenCompraService.actualizarTotalOrdenCompra(
          this.ordenCompraId,
        );
        this.onLoadData(); // recargamos las partidas
      })
      .finally(() => {
        this.submitting.set(false);
      });
  }

  //----------------------------------------------------------------
  // 5. HELPERS / UTILIDADES
  //----------------------------------------------------------------
  // Mostrar mensajito en la UI (toast bonito)
  showMessage(message: string, severity: string) {
    this.messageService.add({
      severity: severity,
      summary: severity.toUpperCase(),
      detail: message,
    });
  }

  // Determinar si un input de monto esté habilitado ??
  isInputDisabled(item: any): boolean {
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();
    const superUser = this.aspRoleS.hasAny([
      EApplicationRole.SuperUsuario,
      EApplicationRole.Administrador,
      EApplicationRole.Asistente
    ]);
    if (superUser) return false; // los superusuarios no tienen restricciones ??

    const accountNumber = (item.accountNumber || "")
      .replace(/\s+/g, "")
      .toUpperCase();
    const cuentasEspeciales = ["605-001-000", "605-002-000", "606-001-000"];

    if (cuentasEspeciales.includes(accountNumber)) {
      return totalPorCubrir <= 0;
    }
    return item.availableBudget <= 0 || totalPorCubrir <= 0;
  }

  // Determinar si el botún de guardar esté habilitado ??
  isSaveDisabled(item: any): boolean {
    const superUser = this.aspRoleS.hasAny([
      EApplicationRole.SuperUsuario,
      EApplicationRole.Administrador,
      EApplicationRole.Asistente
    ]);
    if (superUser) return false; // Admins y SuperUsuarios siempre pueden guardar

    const accountNumber = (item.accountNumber || "")
      .replace(/\s+/g, "")
      .toUpperCase();
    const cuentasSiempreActivas = ["605-001-000", "605-002-000", "606-001-000"];

    if (cuentasSiempreActivas.includes(accountNumber)) {
      return false; // estas cuentas siempre permiten guardar
    }

    return (
      !item.dineroUsadoControl?.value ||
      item.dineroUsadoControl.value <= 0 ||
      item.availableBudget <= 0
    );
  }

  //----------------------------------------------------------------
  // 6. LIMPIEZA
  //----------------------------------------------------------------
  // Al destruir el componente cerramos el diólogo ??
  ngOnDestroy(): void {
    this.ref.close(true);
  }
}

// --------------------------------------------------------------
// INTERFAZ: estructura de un presupuesto de orden de compra
// --------------------------------------------------------------
export interface PurchaseOrderBudget {
  id?: number;
  ordenCompraId: string;
  fiscalYear: string;
  accountNumber: string;
  accountName: string;
  amount: number;
}
