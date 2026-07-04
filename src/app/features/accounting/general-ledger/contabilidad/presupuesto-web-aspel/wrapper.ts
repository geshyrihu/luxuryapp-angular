import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { MessageModule } from "primeng/message";
import { CustomInputSelectButton } from "src/app/core/components/inputs/web/custom-input-select-button-signal";
import { TabsModule } from "primeng/tabs";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { EspejoAspelExtraordinarios } from "./espejo-aspel-extraordinarios";
import { PresupuestoAspelEjercicioFiscal } from "./espejo-aspel-presupuesto";
import { PresupuestoAspelExcelService } from "./presupuesto-aspel-excel.service";
import { PresupuestoWebAspelService } from "./presupuesto-web-aspel.service";

import { WebButtonIcon } from "src/app/core/components/buttons/web-icon/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-presupuesto-web-aspel-wrapper",
  templateUrl: "./wrapper.html",
  imports: [
    WebButtonIcon,
    TooltipModule,
    TabsModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    PresupuestoAspelEjercicioFiscal,
    EspejoAspelExtraordinarios,
    WebButtonLabel,
    CustomSearchInput,
    CustomInputSelectSignal,
    MessageModule,
    CustomInputSelectButton,
  ],
  providers: [PresupuestoWebAspelService, PresupuestoAspelExcelService],
})
export class PresupuestoWebAspelWrapper {
  activeTabValue = signal("presupuesto");
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
