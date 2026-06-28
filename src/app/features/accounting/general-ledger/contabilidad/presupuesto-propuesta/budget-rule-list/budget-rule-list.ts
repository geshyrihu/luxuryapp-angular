/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100% 
 * FUNCIONAL y ESTABLE. 
 * 
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lógica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explícita del Ing. Ricardo Marques.
 * 
 * Por favor, NO rompan el código.
 * ============================================================================
 */
﻿import { CommonModule } from "@angular/common";
import { Component, OnInit, inject, signal } from "@angular/core";
import { IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { analyticsOutline } from "ionicons/icons";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { ActionMenu } from "src/app/core/components/mobile/action-menu/action-menu";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { globalFilterFields } from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { BudgetAccountRuleDataDTO } from "../../presupuesto-web-aspel/presupuestos.interfaces";
import { BudgetRuleForm } from "./budget-rule-form";

@Component({
  selector: "app-budget-rule-list",
  imports: [
    CommonModule,
    TableModule,
    ToastModule,
    PrimeNgCustomCaption,
    CustomButtonEdit,
    CustomButtonDelete,
    DataViewMobile,
    ActionMenu,
    CustomButtonEdit,
    CustomButtonDelete,
    IonItem,
    IonLabel,
  ],
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
    const url = `BudgetAccountRules/${customerIdToLoad}`;

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
    const url = `BudgetAccountRules/${id}`;
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
