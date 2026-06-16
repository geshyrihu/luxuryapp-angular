import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TabsModule } from "primeng/tabs";
import { EquipmentInspectionDefinitionsList } from "./equipment-inspection-definitions-list";
import { EquipmentInspectionExecutionHistoryList } from "./equipment-inspection-execution-history-list";
import { EquipmentInspectionQrList } from "./equipment-inspection-qr-list";

@Component({
  selector: "app-equipment-inspections-shell",
  templateUrl: "./equipment-inspections-shell.html",
  imports: [
    CommonModule,
    TabsModule,
    EquipmentInspectionDefinitionsList,
    EquipmentInspectionExecutionHistoryList,
    EquipmentInspectionQrList,
  ],
})
export class EquipmentInspectionsShell {
  private config = inject(DynamicDialogConfig);

  activeTab = signal("definitions");
  machineryId: string = this.config.data.id;
  machineryName: string = this.config.data.nameMachinery || "Equipo";
}
