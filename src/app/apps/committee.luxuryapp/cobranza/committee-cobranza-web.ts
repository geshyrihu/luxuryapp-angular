import { CommonModule, CurrencyPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, computed } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";
import { TooltipModule } from "primeng/tooltip";
import { PieChart } from "@ui/web/charts/pie-chart";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { CommitteeCobranzaDetailModal } from "./committee-cobranza-detail-modal";
import { CommitteeMorosoItemDto } from "../interfaces/committee-cobranza.dto";
import { CommitteeCobranzaBaseService } from "./committee-cobranza-base.service";

@Component({
  selector: "app-committee-cobranza-web",
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    CurrencyPipe,
    PrimeNgCustomCaption,
    PrimeNgCustomTableEmptyMessage,
    TagModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    AppIcon,
    PieChart,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./committee-cobranza-web.html",
})
export class CommitteeCobranzaWeb {
  baseService = inject(CommitteeCobranzaBaseService);
  private dialogS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);

  openDetailModal(item: CommitteeMorosoItemDto) {
    const customerId = this.customerIdS.customerId();
    this.dialogS.openDialogCustom(CommitteeCobranzaDetailModal, {
      title: `Detalle de Movimientos - ${item.departamento}`,
      size: DialogSize.md,
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

  getBalanceClass(amount: number): string {
    if (amount > 0) return "text-orange-600";
    if (amount < 0) return "text-green-600";
    return "text-500";
  }

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    const normal = concepto.toLowerCase();
    if (normal.includes("mantenimiento")) return "info";
    if (normal.includes("sancion") || normal.includes("multa")) return "danger";
    if (normal.includes("gas")) return "warning";
    if (normal.includes("agua")) return "success";
    return "secondary";
  }
}
