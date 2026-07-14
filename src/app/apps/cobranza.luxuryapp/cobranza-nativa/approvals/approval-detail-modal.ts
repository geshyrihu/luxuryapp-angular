import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { EFinancialApprovalOperationType } from "../interfaces/enums";
import { FinancialApprovalResponseDTO } from "../interfaces/financial-approval.dto";

@Component({
  selector: "app-approval-detail-modal",
  imports: [
    AppIcon,
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputTextAreaSignal,
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./approval-detail-modal.html",
})
export default class ApprovalDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  item = signal<FinancialApprovalResponseDTO | null>(null);
  payload = signal<any>(null);
  submitting = signal(false);

  EFinancialApprovalOperationType = EFinancialApprovalOperationType;

  reviewNotesCtrl = new FormControl("", {
    nonNullable: true,
    validators: [Validators.maxLength(500)],
  });

  ngOnInit() {
    const data: FinancialApprovalResponseDTO = this.config.data.item;
    this.item.set(data);
    try {
      this.payload.set(JSON.parse(data.operationPayload ?? "{}"));
    } catch {
      this.payload.set(null);
    }
  }

  get reviewerName(): string {
    return this.authS.infoUserAuth?.fullName ?? "revisor";
  }

  async onApprove() {
    const item = this.item();
    if (!item) return;
    this.submitting.set(true);
    try {
      const ok = await this.apiResponseS.onPost(
        Endpoints.CobranzaNative.FinancialApprovals.approve(
          item.id,
        ),
        {
          reviewedBy: this.reviewerName,
          reviewNotes: this.reviewNotesCtrl.value || null,
        },
      );
      if (ok) this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }

  async onReject() {
    if (!this.reviewNotesCtrl.value?.trim()) {
      this.reviewNotesCtrl.markAsTouched();
      return;
    }
    const item = this.item();
    if (!item) return;
    this.submitting.set(true);
    try {
      const ok = await this.apiResponseS.onPost(
        Endpoints.CobranzaNative.FinancialApprovals.reject(
          item.id,
        ),
        {
          reviewedBy: this.reviewerName,
          reviewNotes: this.reviewNotesCtrl.value,
        },
      );
      if (ok) this.ref.close(true);
    } finally {
      this.submitting.set(false);
    }
  }

  operationLabel(op: EFinancialApprovalOperationType): string {
    const labels: Record<EFinancialApprovalOperationType, string> = {
      [EFinancialApprovalOperationType.Condonacion]: "Condonacion",
      [EFinancialApprovalOperationType.DevolucionPago]: "Devolucion Pago",
      [EFinancialApprovalOperationType.ReaperturaPeriodo]: "Reapertura Periodo",
      [EFinancialApprovalOperationType.AnulacionCargoPagado]:
        "Anulacion Cargo Pagado",
      [EFinancialApprovalOperationType.AjusteAlAlza]: "Ajuste al Alza",
    };
    return labels[op] ?? String(op);
  }
}

