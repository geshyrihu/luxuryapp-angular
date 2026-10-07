import { Endpoints } from "@core/constants/endpoints/endpoints";
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
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { addIcons } from "ionicons";
import { analyticsOutline } from "ionicons/icons";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import { BudgetAccountRuleDataDTO } from "../../aspel-web-budget/presupuestos.interfaces";
import { BudgetRuleForm } from "./budget-rule-form";

import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { LxIcon } from "@ui/adaptive/icon/icon";
import { ButtonMobile } from "@ui/buttons/mobile";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-budget-rule-list",
  imports: [
    ButtonWeb,
    ButtonMobile,
    MobileActionMenu,
    AppTable,
    LuxTableCaption,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
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
