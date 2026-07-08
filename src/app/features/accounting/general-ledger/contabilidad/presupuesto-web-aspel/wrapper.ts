import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTabs } from "@ui/adaptive/tabs/tabs";

import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { TabsModule } from "primeng/tabs";
import { EspejoAspelExtraordinarios } from "./espejo-aspel-extraordinarios";
import { PresupuestoAspelEjercicioFiscal } from "./espejo-aspel-presupuesto";
import { PresupuestoAspelExcelService } from "./presupuesto-aspel-excel.service";
import { PresupuestoWebAspelService } from "./presupuesto-web-aspel.service";

import { LxMessage } from "@ui/adaptive/message/message";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-presupuesto-web-aspel-wrapper",
  templateUrl: "./wrapper.html",
  imports: [
    WebButtonIcon,
    TooltipModule,
    TabsModule,
    FormsModule,
    LxTabs,
    PresupuestoAspelEjercicioFiscal,
    EspejoAspelExtraordinarios,
    WebButtonLabel,
    CustomSearchInput,
    CustomInputSelectSignal,
    CustomInputSelectButton,
    LxMessage,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PresupuestoWebAspelService, PresupuestoAspelExcelService],
})
export class PresupuestoWebAspelWrapper {
  activeTabValue = signal("presupuesto");
  budgetTabs = [
    { id: "presupuesto", label: "Presupuesto" },
    { id: "especiales", label: "Esp. 605/606" },
  ];
  sharedS = inject(PresupuestoWebAspelService);

  presupuestoComp = viewChild(PresupuestoAspelEjercicioFiscal);
  extraComp = viewChild(EspejoAspelExtraordinarios);

  onManageRules() {
    this.presupuestoComp()?.onManageRules();
  }

  onApelFull() {
    this.presupuestoComp()?.onApelFull();
  }

  analyzeFinancialData() {
    this.presupuestoComp()?.analyzeFinancialData();
  }

  exportExcel(): void {
    if (this.activeTabValue() === "presupuesto") {
      this.presupuestoComp()?.exportExcel();
    } else {
      this.extraComp()?.exportExcel();
    }
  }
}
