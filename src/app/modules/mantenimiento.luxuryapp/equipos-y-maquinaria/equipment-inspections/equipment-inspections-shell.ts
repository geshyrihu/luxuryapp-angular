import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
} from "@angular/core";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { LxTabs } from "@ui/adaptive/tabs/tabs";
import { EquipmentInspectionDefinitionsList } from "./equipment-inspection-definitions-list";
import { EquipmentInspectionExecutionHistoryList } from "./equipment-inspection-execution-history-list";
import { EquipmentInspectionQrList } from "./equipment-inspection-qr-list";

@Component({
  selector: "app-equipment-inspections-shell",
  templateUrl: "./equipment-inspections-shell.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTabs,
    EquipmentInspectionDefinitionsList,
    EquipmentInspectionExecutionHistoryList,
    EquipmentInspectionQrList,
  ],
})
export class EquipmentInspectionsShell {
  private config = inject(DynamicDialogConfig);

  activeTab = signal("definitions");
  tabs = [
    { id: "definitions", label: "Configuradas" },
    { id: "history", label: "Historial" },
    { id: "qr", label: "QR" },
  ];
  machineryId: string = this.config.data.id;
  machineryName: string = this.config.data.nameMachinery || "Equipo";
}
