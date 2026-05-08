import { Component, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { TabsModule } from "primeng/tabs";
import { EspejoAspelExtraordinarios } from "./espejo-aspel-extraordinarios";
import { PresupuestoAspelEjercicioFiscal } from "./espejo-aspel-presupuesto";

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
  ],
})
export class PresupuestoWebAspelWrapper {
  activeTabValue = signal("presupuesto");
}
