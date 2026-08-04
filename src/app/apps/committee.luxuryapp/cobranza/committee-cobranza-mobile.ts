import { ChangeDetectionStrategy, Component, inject, computed } from "@angular/core";
import { CurrencyPipe, CommonModule } from "@angular/common";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PieChart } from "@ui/web/charts/pie-chart";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";

@Component({
  selector: "app-committee-cobranza-mobile",
  standalone: true,
  imports: [CurrencyPipe, CommonModule, AppIcon, PieChart],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-mobile.html",
})
export class CommitteeCobranzaMobile {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogS.openDialogCustom(CommitteeCobranzaDetailModal, {
      title: `Detalle de Movimientos - ${item.departamento}`,
      size: DialogSize.full,
      data: {
        row: item,
        customerId: customerId,
      },
    });
  }

  readonly maintenanceMetrics = computed(() => {
    return this.baseService.morososData()?.currentCharges?.maintenance;
  });

  readonly extraordinaryMetrics = computed(() => {
    return this.baseService.morososData()?.currentCharges?.extraordinary;
  });

  readonly maintenanceChartData = computed(() => {
    const m = this.maintenanceMetrics();
    if (!m || m.total <= 0) {
      return {
        data: [{ name: "Sin Mantenimiento", value: 1 }],
        colors: ["#e2e8f0"],
      };
    }

    return {
      data: [
        { name: "Cobrado", value: m.collected },
        { name: "Pendiente", value: m.pending > 0 ? m.pending : 0 },
      ],
      colors: ["#22c55e", "#f59e0b"],
    };
  });

  readonly extraordinaryChartData = computed(() => {
    const m = this.extraordinaryMetrics();
    if (!m || m.total <= 0) {
      return null;
    }

    return {
      data: [
        { name: "Cobrado", value: m.collected },
        { name: "Pendiente", value: m.pending > 0 ? m.pending : 0 },
      ],
      colors: ["#22c55e", "#f59e0b"],
    };
  });
}
