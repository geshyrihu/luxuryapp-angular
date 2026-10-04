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
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { MessageService } from "@core/services/message.service";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { LuxTableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppSortableColumn, AppSorticon, AppTable } from "@ui/web/table/table";

import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { OrdenCompraService } from "@purchases.luxuryapp/purchase-orders/services/orden-compra.service";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import {
  PurchaseOrderBudgetAccount,
  PurchaseOrderBudgetAccountsResponse,
} from "../purchase-order.types";

@Component({
  selector: "app-orden-compra-presupuesto",
  templateUrl: "./orden-compra-presupuesto.html",
  imports: [
    WebButtonIconItem,
    LxTooltipDirective,
    TableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    AppSpinner,
    LuxTableCaption,
    TableFooter,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class OrdenCompraPresupuesto implements OnInit, OnDestroy {
  //----------------------------------------------------------------
  // 1. INYECCIÓNN DE DEPENDENCIAS
  //----------------------------------------------------------------
  // Aqué puro `inject`, nada de constructores kilomótricos ?
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
  dataSignal = signal<PurchaseOrderBudgetAccountRow[]>([]);
  // Anio en curso (lo vamos a usar para filtrar info del presupuesto).
  intYearControl = new FormControl<number>(new Date().getFullYear());
  availableYears = [
    { label: "2024", value: 2024 },
    { label: "2025", value: 2025 },
    { label: "2026", value: 2026 },
  ];
  // Id de la orden de compra que viene desde el modal
  ordenCompraId: string = "";

  // Signals para manejar loading y submitting ??
  loading = signal(true);
  submitting = signal(false);

  // Opciones de la tabla de Bootstrap
  globalFilterFields = computed(() => globalFilterFields(this.dataSignal()));
  tableRows: number = tableRows();
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
  // 4. MóTODOS PRINCIPALES
  //----------------------------------------------------------------
  // Cargar data desde la API (las cuentas presupuestales)
  async onLoadData() {
    this.loading.set(true);

    const customerId: string = this.customerIdS.customerId();
    if (!customerId) {
      this.loading.set(false);
      return;
    }
    const urlApi = Endpoints.Presupuestos.toPurchaseOrder(
      customerId,
      this.ordenCompraId,
      this.intYearControl.value,
    );

    const result =
      await this.apiResponseS.onGetList<PurchaseOrderBudgetAccountsResponse>(
        urlApi,
      );
    if (result) {
      const accounts = result.accounts.map(
        (acc): PurchaseOrderBudgetAccountRow => ({
          ...acc,
          dineroUsadoControl: new FormControl<number | null>(
            acc.dineroUsado || null,
          ),
        }),
      );
      this.dataSignal.set(accounts);
    }

    this.loading.set(false);
  }

  // Guardar una partida presupuestal ??
  async onSubmit(item: PurchaseOrderBudgetAccountRow) {
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

    // Post a la API y actualización automótica del total ??
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
  showMessage(
    message: string,
    severity: "success" | "info" | "warn" | "error",
  ) {
    this.messageService.add({
      severity: severity,
      summary: severity.toUpperCase(),
      detail: message,
    });
  }

  // Determinar si un input de monto esté habilitado ??
  isInputDisabled(item: PurchaseOrderBudgetAccountRow): boolean {
    const totalPorCubrir = this.ordenCompraService.totalPorCubrir();
    const superUser = this.aspRoleS.hasAny([
      ApplicationRole.SuperUsuario,
      ApplicationRole.Administrador,
      ApplicationRole.Asistente,
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

  // Determinar si el botón de guardar esté habilitado ??
  isSaveDisabled(item: PurchaseOrderBudgetAccountRow): boolean {
    const superUser = this.aspRoleS.hasAny([
      ApplicationRole.SuperUsuario,
      ApplicationRole.Administrador,
      ApplicationRole.Asistente,
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
  // Al destruir el componente cerramos el dialogo.
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

interface PurchaseOrderBudgetAccountRow extends PurchaseOrderBudgetAccount {
  dineroUsadoControl: FormControl<number | null>;
}
