import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EquipmentInspectionExecutionDetail } from "./equipment-inspection-execution-detail";
import { EquipmentInspectionExecutionForm } from "./equipment-inspection-execution-form";
import { EquipmentInspectionExecutionListDTO } from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";

@Component({
  selector: "app-equipment-inspection-execution-history-list",
  templateUrl: "./equipment-inspection-execution-history-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    LxTooltipDirective,
    TableModule,
    LxTag,
    DataViewMobile,
    PrimeNgCustomCaption,
  ],
})
export class EquipmentInspectionExecutionHistoryList implements OnInit {
  private config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  private equipmentInspectionS = inject(EquipmentInspectionService);

  machineryIdInput = input<string>("");
  machineryNameInput = input<string>("");

  machineryId = "";
  machineryName = "Equipo";
  initialized = false;

  data = signal<EquipmentInspectionExecutionListDTO[]>([]);
  loading = signal(true);

  globalFilterFields = computed(() => globalFilterFields(this.data()));
  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();

  constructor() {
    effect(() => {
      this.equipmentInspectionS.executionRefreshVersion();
      if (this.initialized && this.machineryId) {
        this.onLoadData();
      }
    });
  }

  ngOnInit(): void {
    this.machineryId = this.machineryIdInput() || this.config.data?.id;
    this.machineryName =
      this.machineryNameInput() || this.config.data?.nameMachinery || "Equipo";
    this.initialized = true;
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.equipmentInspectionS.getExecutionsByMachinery(
        this.machineryId,
      );
      this.data.set(result || []);
    } finally {
      this.loading.set(false);
    }
  }

  onView(id: string): void {
    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionExecutionDetail,
        { executionId: id },
        "Detalle de inspeccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onContinue(id: string): void {
    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionExecutionForm,
        { executionId: id },
        "Completar inspeccion",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) {
          this.equipmentInspectionS.notifyExecutionChanged();
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
