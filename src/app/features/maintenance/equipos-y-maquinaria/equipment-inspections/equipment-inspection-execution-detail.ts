import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { ImageModule } from "primeng/image";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EquipmentInspectionExecutionForm } from "./equipment-inspection-execution-form";
import { EquipmentInspectionExecutionDetailDTO } from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

@Component({
  selector: "app-equipment-inspection-execution-detail",
  templateUrl: "./equipment-inspection-execution-detail.html",
  imports: [CommonModule, TableModule, Tag, ImageModule, WebButtonLabel],
})
export class EquipmentInspectionExecutionDetail implements OnInit {
  private config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  loading = signal(true);
  detail = signal<EquipmentInspectionExecutionDetailDTO | null>(null);

  ngOnInit(): void {
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.equipmentInspectionS.getExecutionById(
        this.config.data.executionId,
      );
      this.detail.set(result);
    } finally {
      this.loading.set(false);
    }
  }

  onContinue(): void {
    const detail = this.detail();
    if (!detail) return;

    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionExecutionForm,
        { executionId: detail.id },
        "Completar inspeccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.equipmentInspectionS.notifyExecutionChanged();
          this.onLoadData();
        }
      });
  }

  statusLabel(status: number): string {
    return this.equipmentInspectionS.getStatusLabel(status);
  }

  statusTag(status: number) {
    return this.equipmentInspectionS.getStatusTag(status);
  }

  severityLabel(severity: number | null): string {
    return this.equipmentInspectionS.getSeverityLabel(severity);
  }

  severityTag(severity: number | null) {
    return this.equipmentInspectionS.getSeverityTag(severity);
  }
}
