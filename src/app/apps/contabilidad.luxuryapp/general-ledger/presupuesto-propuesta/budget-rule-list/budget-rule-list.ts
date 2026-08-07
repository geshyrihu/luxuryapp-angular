import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explócita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { addIcons } from "ionicons";
import { analyticsOutline } from "ionicons/icons";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { BudgetAccountRuleDataDTO } from "../../presupuesto-web-aspel/presupuestos.interfaces";
import { BudgetRuleForm } from "./budget-rule-form";

import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-budget-rule-list",
  imports: [
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    MobileListItem,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./budget-rule-list.html",
})
export class BudgetRuleList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  dialogHandlerS = inject(DialogHandlerService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  dataSignal = signal<BudgetAccountRuleDataDTO[]>([]);
  globalFilterFields = signal<string[]>([]);

  customerId: string = this.customerIdS.customerId();

  constructor() {
    addIcons({ analyticsOutline });
  }

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    // Si viene customerId en config (opcional), usarlo, sino el del servicio
    const customerIdToLoad = this.config.data?.customerId || this.customerId;
    const url = Endpoints.BudgetAccountRules.byCustomerId(customerIdToLoad);

    this.apiResponseS
      .onGetList(url)
      .then((response: BudgetAccountRuleDataDTO[]) => {
        this.dataSignal.set(response);
        this.globalFilterFields.set(globalFilterFields(response));
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        BudgetRuleForm,
        {
          ...data,
          customerId: this.customerId, // Pasar el customerId actual para crear
        },
        data.title,
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }

  onDelete(id: string) {
    const url = Endpoints.BudgetAccountRules.byCustomerId(id);
    this.apiResponseS.onDelete(url).then((result: boolean) => {
      if (result) this.onLoadData();
    });
  }

  getRuleTypeLabel(type: number): string {
    return type === 0 ? "Cuenta Extra" : "Exclusión";
  }

  getScopeLabel(rowCustomerId: string): string {
    return rowCustomerId ? "GLOBAL (Todas las empresas)" : "Solo esta empresa";
  }
}
