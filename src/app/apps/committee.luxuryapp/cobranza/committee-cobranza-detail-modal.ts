import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { CobranzaOnlineStatementResponseDto } from "../interfaces/committee-cobranza.dto";

@Component({
  selector: "app-committee-cobranza-detail-modal",
  templateUrl: "./committee-cobranza-detail-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    CommonModule,
    TableModule,
    CurrencyPipe,
    DatePipe,
    LxTag,
    ButtonModule,
    RippleModule,
  ],
})
export class CommitteeCobranzaDetailModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly loading = signal(true);
  readonly detail = signal<CobranzaOnlineStatementResponseDto | null>(null);

  readonly row = this.config.data?.row;
  readonly customerId = this.config.data?.customerId as string | undefined;

  ngOnInit(): void {
    void this.loadDetail();
  }

  close() {
    this.ref.close();
  }

  getConceptSeverity(
    concepto: string,
  ): "success" | "info" | "warning" | "danger" | "secondary" | "contrast" {
    const normalized = concepto.toUpperCase();
    if (normalized.includes("MTTO") || normalized.includes("MANTENIMIENTO"))
      return "info";
    if (normalized.includes("EXTRA")) return "warning";
    if (
      normalized.includes("RESERVA") ||
      normalized.includes("PAGO") ||
      normalized.includes("ABONO")
    )
      return "success";
    if (normalized.includes("MULTA") || normalized.includes("SANCION"))
      return "danger";
    return "secondary";
  }

  getBalanceClass(balance: number): string {
    if (balance > 0) return "text-orange-600";
    if (balance < 0) return "text-green-600";
    return "text-color";
  }

  private async loadDetail() {
    if (!this.customerId || !this.row?.numCtaBase) {
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    try {
      const response =
        await this.apiResponseS.onGetItem<CobranzaOnlineStatementResponseDto>(
          Endpoints.Committee.Cobranza.morosoDetalle(
            this.customerId,
            this.row.numCtaBase,
          ),
        );
      if (response) {
        this.detail.set(response);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
