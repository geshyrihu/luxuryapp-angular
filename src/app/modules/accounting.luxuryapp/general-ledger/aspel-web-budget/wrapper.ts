import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  viewChild,
  Input
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxTabs } from "@ui/adaptive/tabs/tabs";


import { CustomInputSelectButton } from "@ui/inputs/web/custom-input-select-button-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "@ui/inputs/web/custom-search-input-signal";
import { LxMessage } from "@ui/adaptive/message/message";
import { EspejoAspelExtraordinarios } from "./espejo-aspel-extraordinarios";
import { PresupuestoAspelEjercicioFiscal } from "./espejo-aspel-presupuesto";
import { PresupuestoAspelExcelService } from "./presupuesto-aspel-excel.service";
import { PresupuestoWebAspelService } from "./presupuesto-web-aspel.service";

import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-presupuesto-web-aspel-wrapper",
  templateUrl: "./wrapper.html",
  imports: [ButtonWeb, LxTooltipDirective,
    FormsModule,
    LxTabs,
    PresupuestoAspelEjercicioFiscal,
    EspejoAspelExtraordinarios,
    CustomSearchInput,
    CustomInputSelectSignal,
    CustomInputSelectButton,
    LxMessage],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [PresupuestoWebAspelService, PresupuestoAspelExcelService],
})
export class PresupuestoWebAspelWrapper {
  @Input() isClientView = false;

  activeTabValue = signal("presupuesto");
  budgetTabs = [
    { id: "presupuesto", label: "Presupuesto" },
    { id: "especiales", label: "Esp. 605/606" }];
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

  openModuleGuide(): void {
    window.open('/guide/presupuesto-web-aspel', '_blank');
  }
}
