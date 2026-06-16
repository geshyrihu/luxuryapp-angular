import { CommonModule } from "@angular/common";
import { Component, computed, inject, input, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonItem } from "src/app/core/components/buttons/web/custom-button-item";
import { PrimeNgCustomCaption } from "src/app/core/components/primeng-custom-caption/primeng-custom-caption";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { AspRoleService } from "src/app/core/services/asp-role.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EquipmentInspectionDefinitionListDTO } from "./equipment-inspection.models";
import { EquipmentInspectionDefinitionForm } from "./equipment-inspection-definition-form";
import { EquipmentInspectionExecutionForm } from "./equipment-inspection-execution-form";
import { EquipmentInspectionService } from "./equipment-inspection.service";

@Component({
  selector: "app-equipment-inspection-definitions-list",
  templateUrl: "./equipment-inspection-definitions-list.html",
  imports: [
    CommonModule,
    TableModule,
    Tag,
    CustomButtonDelete,
    CustomButtonEdit,
    CustomButtonItem,
    PrimeNgCustomCaption,
  ],
})
export class EquipmentInspectionDefinitionsList implements OnInit {
  private config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  public aspRoleS = inject(AspRoleService);
  public AspRole = EApplicationRole;

  machineryIdInput = input<string>("");
  machineryNameInput = input<string>("");

  machineryId: string = "";
  machineryName: string = "Equipo";

  data = signal<EquipmentInspectionDefinitionListDTO[]>([]);
  loading = signal(true);

  globalFilterFields = computed(() => globalFilterFields(this.data()));
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  ngOnInit(): void {
    this.machineryId = this.machineryIdInput() || this.config.data?.id;
    this.machineryName =
      this.machineryNameInput() || this.config.data?.nameMachinery || "Equipo";
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.equipmentInspectionS.getDefinitionsByMachinery(
        this.machineryId,
      );
      this.data.set(result || []);
    } finally {
      this.loading.set(false);
    }
  }

  async onToggleActive(item: EquipmentInspectionDefinitionListDTO) {
    const result = await this.equipmentInspectionS.toggleDefinition(
      item.id,
      !item.isActive,
    );

    if (result !== false) {
      await this.onLoadData();
    }
  }

  async onDelete(id: string) {
    const result = await this.equipmentInspectionS.deleteDefinition(id);
    if (result) {
      await this.onLoadData();
    }
  }

  onAddOrEdit(id?: string): void {
    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionDefinitionForm,
        {
          id,
          machineryId: this.machineryId,
          machineryName: this.machineryName,
        },
        id ? "Editar definicion de inspeccion" : "Nueva definicion de inspeccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onStartManual(definitionId: string): void {
    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionExecutionForm,
        {
          definitionId,
          machineryId: this.machineryId,
          machineryName: this.machineryName,
        },
        "Captura de inspeccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.equipmentInspectionS.notifyExecutionChanged();
        }
      });
  }

  recurrenceLabel(item: EquipmentInspectionDefinitionListDTO): string {
    return this.equipmentInspectionS.getRecurrenceLabel(
      item.recurrenceUnit,
      item.recurrenceInterval,
      item.dayOfMonth,
    );
  }
}
