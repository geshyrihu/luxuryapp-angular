import { Component, effect, inject, signal } from "@angular/core";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import BillingConfigModal from "../../../contabilidad/cobranza-nativa/pages/billing-config/billing-config-modal";
import BulkImportModal from "../../../contabilidad/cobranza-nativa/pages/charges/bulk-import-modal";
import ArCollectionsPanel from "./ar-collections-panel/ar-collections-panel";
import GeneralAccountingPanel from "./general-accounting-panel/general-accounting-panel";

@Component({
  selector: "app-accounting-coi-dashboard",
  imports: [GeneralAccountingPanel, ArCollectionsPanel],
  templateUrl: "./dashboard-accounting-coi.html",
})
export default class AccountingCoiDashboard {
  private customerIdS = inject(CustomerIdService);
  private dialogS = inject(DialogHandlerService);

  customerId = signal<string>("");

  constructor() {
    effect(() => {
      const id = this.customerIdS.customerId();
      if (id) this.customerId.set(id);
    });
  }

  async openBillingConfig() {
    // Restaurar firma original: openDialogCustom(component, config)
    await this.dialogS.openDialogCustom(BillingConfigModal, {
      title: "Configuración de Cobranza",
      size: this.dialogS.sizeMd,
      data: { customerId: this.customerId() },
    });
  }

  async openBulkImport() {
    await this.dialogS.openDialogCustom(BulkImportModal, {
      title: "Importación Masiva de Saldos",
      size: this.dialogS.sizeMd,
      data: { customerId: this.customerId() },
    });
  }
}
