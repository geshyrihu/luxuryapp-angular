import { CommonModule } from "@angular/common";
import { Component, inject, input, OnInit, signal, ChangeDetectionStrategy } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { Tag } from "primeng/tag";
import { WebButtonLabelItem } from "@ui/buttons/web-label/button-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EquipmentInspectionQrForm } from "./equipment-inspection-qr-form";
import { EquipmentInspectionQrPrintService } from "./equipment-inspection-qr-print.service";
import {
  EquipmentQrBatchDownloadDTO,
  EquipmentQrLabelListDTO,
} from "./equipment-inspection.models";
import { EquipmentInspectionService } from "./equipment-inspection.service";

import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-equipment-inspection-qr-list",
  templateUrl: "./equipment-inspection-qr-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconItem,
    TooltipModule,
    CommonModule,
    TableModule,
    Tag,

    PrimeNgCustomCaption,
  ],
})
export class EquipmentInspectionQrList implements OnInit {
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private equipmentInspectionS = inject(EquipmentInspectionService);
  private qrPrintS = inject(EquipmentInspectionQrPrintService);

  machineryIdInput = input<string>("");
  machineryNameInput = input<string>("");

  machineryId = "";
  machineryName = "Equipo";

  data = signal<EquipmentQrLabelListDTO[]>([]);
  loading = signal(true);

  ngOnInit(): void {
    this.machineryId = this.machineryIdInput() || this.config.data?.id;
    this.machineryName =
      this.machineryNameInput() || this.config.data?.nameMachinery || "Equipo";
    this.onLoadData();
  }

  async onLoadData(): Promise<void> {
    this.loading.set(true);
    try {
      const result = await this.equipmentInspectionS.getQrLabelsByMachinery(
        this.machineryId,
      );
      this.data.set(result || []);
    } finally {
      this.loading.set(false);
    }
  }

  onCreate(): void {
    this.dialogHandlerS
      .openDialog(
        EquipmentInspectionQrForm,
        {
          machineryId: this.machineryId,
          defaultName: `QR ${this.machineryName}`,
        },
        "Nueva etiqueta QR",
        this.dialogHandlerS.sizeMd,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  async onRegenerate(id: string): Promise<void> {
    const result = await this.equipmentInspectionS.regenerateQrLabel(id);
    if (result !== false) {
      await this.onLoadData();
    }
  }

  async onPrint(id: string): Promise<void> {
    const payload = await this.equipmentInspectionS.downloadQrLabel(id);
    if (payload) {
      await this.qrPrintS.printOne(payload);
    }
  }

  async onPrintAll(): Promise<void> {
    const payload: EquipmentQrBatchDownloadDTO = {
      customerId: this.customerIdS.customerId(),
      machineryIds: [this.machineryId],
      qrLabelIds: [],
      onlyActive: true,
    };

    const result = await this.equipmentInspectionS.downloadQrBatch(payload);
    if (result && result.length > 0) {
      await this.qrPrintS.printMany(result, `QR-${this.machineryName}`);
    }
  }
}
