import { Component, Input, signal } from "@angular/core";
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
  @Input() tipoCalendario: string = "preventivo de equipos";
  activeTabValue = signal("tab1");
  // Función que recibe el mensaje y lo guarda en la variable `message`
  message(message: string) {
    this.tipoCalendario = message;
  }
}









