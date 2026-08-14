import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from "@angular/core";
import { LxConfirmDialog } from "@ui/adaptive/confirm-dialog/confirm-dialog";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  ApprovalConfirmationResult,
  ApprovalPanelRequest,
} from "../interfaces/approval.interface";
import { MotivoRechazoFormulario } from "../motivo-rechazo-formulario/motivo-rechazo-formulario";
import { GenericApprovalPanel } from "../shared/generic-approval-panel";
import { ApprovalConfirmationModal } from "../shared/modal-approval-confirmation";
import { ApprovalDetailModal } from "../shared/modal-approval-detail";
import { ApprovalStateService } from "./state/approval-state.service";
@Component({
  selector: "app-panel-aprobaciones",
  templateUrl: "./panel-aprobaciones.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxConfirmDialog, GenericApprovalPanel],
})
export class PanelAprobaciones implements OnInit {
  private state = inject(ApprovalStateService);
  private dialogHandlerS = inject(DialogHandlerService);

  public requests = this.state.requests;
  public loading = this.state.loading;
  columns = [
    { field: "customerName", header: "Cliente" },
    { field: "employeeFullName", header: "Empleado" },
    { field: "roleName", header: "Puesto" },
    { field: "requestType", header: "Tipo" },
    { field: "requestTypeName", header: "Detalle" },
    { field: "startDate", header: "Inicio", isDate: true },
    { field: "endDate", header: "Fin", isDate: true },
  ];

  ngOnInit(): void {
    this.state.loadRequests();
  }

  onViewDetail(request: ApprovalPanelRequest): void {
    this.dialogHandlerS.openDialog<unknown>(
      ApprovalDetailModal,
      { request },
      `Detalle de Solicitud (${request.requestType})`,
      this.dialogHandlerS.sizeLg,
    );
  }

  onApprove(request: ApprovalPanelRequest): void {
    this.dialogHandlerS
      .openDialog<ApprovalConfirmationResult>(
        ApprovalConfirmationModal,
        { request },
        "Confirmar Aprobación",
        this.dialogHandlerS.sizeLg,
      )
      .then((result) => {
        if (result?.approved) {
          this.state.approveRequest(request, result.paidStatus);
        }
      });
  }

  onReject(request: ApprovalPanelRequest): void {
    this.dialogHandlerS
      .openDialog<string>(
        MotivoRechazoFormulario,
        {},
        `Motivo del Rechazo (${request.requestType})`,
        this.dialogHandlerS.sizeSm,
      )
      .then((reason: string) => {
        if (reason) {
          this.state.rejectRequest(request, reason);
        }
      });
  }
}
