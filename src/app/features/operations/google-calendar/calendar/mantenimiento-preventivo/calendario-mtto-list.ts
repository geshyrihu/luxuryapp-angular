import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  IonLabel,
  IonSegment,
  IonSegmentButton,
} from "@ionic/angular/standalone";
import { TabsModule } from "primeng/tabs";
import { GeneralAnualMantenimiento } from "../general-anual-mantenimiento/general-anual-mantenimiento";
import { ListadoAnualMantenimiento } from "../listado-anual-mantenimiento/listado-anual-mantenimiento";
import { CronogramaAnualMantenimiento } from "./cronograma-anual-mantenimiento";
@Component({
  selector: "app-calendario-mtto-list",
  templateUrl: "./calendario-mtto-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    TabsModule,
    ListadoAnualMantenimiento,
    CronogramaAnualMantenimiento,
    GeneralAnualMantenimiento,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    FormsModule,
  ],
})
export class CalendarioMttoList {
  tipoCalendario = signal("preventivo de equipos");
  activeTabValue = signal("tab1");
  message(message: string) {
    this.tipoCalendario.set(message);
  }
}









