import { Component, inject, signal, viewChild } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { TabsModule } from "primeng/tabs";
import { MessageModule } from "primeng/message";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomSearchInput } from "src/app/core/components/inputs/web/custom-search-input-signal";
import { EspejoAspelExtraordinarios } from "./espejo-aspel-extraordinarios";
import { PresupuestoAspelEjercicioFiscal } from "./espejo-aspel-presupuesto";
import { PresupuestoWebAspelService } from "./presupuesto-web-aspel.service";

@Component({
  selector: "app-presupuesto-web-aspel-wrapper",
  templateUrl: "./wrapper.html",
  imports: [
    TabsModule,
    FormsModule,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    PresupuestoAspelEjercicioFiscal,
    EspejoAspelExtraordinarios,
    CustomButton,
    CustomSearchInput,
    CustomInputSelectSignal,
    MessageModule,
  ],
  providers: [PresupuestoWebAspelService],
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
}
