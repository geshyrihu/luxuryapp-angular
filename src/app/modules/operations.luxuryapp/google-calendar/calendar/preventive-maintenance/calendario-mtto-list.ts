import { Component, signal, ChangeDetectionStrategy } from "@angular/core";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { GeneralAnualMantenimiento } from "../annual-maintenance-general/general-anual-mantenimiento";
import { ListadoAnualMantenimiento } from "../annual-maintenance-list/listado-anual-mantenimiento";
import { CronogramaAnualMantenimiento } from "./cronograma-anual-mantenimiento";
@Component({
  selector: "app-calendario-mtto-list",
  templateUrl: "./calendario-mtto-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTabs,
    ListadoAnualMantenimiento,
    CronogramaAnualMantenimiento,
    GeneralAnualMantenimiento,
  ],
})
export class CalendarioMttoList {
  tipoCalendario = signal("preventivo de equipos");
  activeTabValue = signal("tab1");
  tabs = [
    { id: "tab1", label: "Cronograma" },
    { id: "tab2", label: "Listado" },
    { id: "tab3", label: "General" },
  ];
  message(message: string) {
    this.tipoCalendario.set(message);
  }
}









