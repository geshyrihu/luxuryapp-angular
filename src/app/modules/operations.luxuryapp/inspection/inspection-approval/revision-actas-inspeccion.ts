import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { ButtonWeb } from "@ui/buttons/web";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import { AppTable } from "src/app/shared/ui/web/lux-table/lux-table";
import {
  INSPECTION_APPROVAL_STATUS,
  type InspectionApproval,
  type InspectionExecutionListItem,
  type InspectionExecutionSnapshot,
} from "../models/inspection.model";

type ReasonMode = "return" | "reopen" | null;

/**
 * Pantalla de revisión y firma digital de actas de inspección (Fase 3):
 * envía a revisión, devuelve con motivo, firma/cierra, reabre y genera anexos.
 * Toda la autorización se valida en backend (deny-by-default); la UI solo
 * habilita acciones según el estado del acta. Layout responsive: tablas en
 * desktop, listas apiladas en móvil.
 */
@Component({
  selector: "app-revision-actas-inspeccion",
  imports: [
    RouterModule,
    NgbTooltipModule,
    ApiDatePipe,
    ButtonWeb,
    LxIcon,
    AppTable,
    TableEmptyMessage,
    MobileListItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./revision-actas-inspeccion.html",
  styleUrl: "./revision-actas-inspeccion.scss",
})
export class RevisionActasInspeccion {
  private readonly apiS = inject(ApiResponseService);
  private readonly customerIdS = inject(CustomerIdService);
  private readonly authS = inject(AuthService);

  readonly STATUS = INSPECTION_APPROVAL_STATUS;

  readonly executions = signal<InspectionExecutionListItem[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly approval = signal<InspectionApproval | null>(null);
  readonly coverage = signal<InspectionExecutionSnapshot[]>([]);
  readonly busy = signal(false);
  readonly reasonMode = signal<ReasonMode>(null);
  readonly reasonText = signal("");

  readonly selectedExecution = computed(() =>
    this.executions().find((x) => x.id === this.selectedId()) ?? null,
  );

  readonly status = computed(
    () => this.approval()?.status ?? INSPECTION_APPROVAL_STATUS.DRAFT,
  );
  readonly canSubmit = computed(
    () =>
      this.status() === INSPECTION_APPROVAL_STATUS.DRAFT ||
      this.status() === INSPECTION_APPROVAL_STATUS.RETURNED ||
      this.status() === INSPECTION_APPROVAL_STATUS.REOPENED,
  );
  readonly canReturn = computed(
    () => this.status() === INSPECTION_APPROVAL_STATUS.PENDING_REVIEW,
  );
  readonly canSign = computed(
    () => this.status() === INSPECTION_APPROVAL_STATUS.PENDING_REVIEW,
  );
  readonly canReopen = computed(
    () => this.status() === INSPECTION_APPROVAL_STATUS.APPROVED,
  );
  readonly canCreateAnnex = computed(
    () => this.status() === INSPECTION_APPROVAL_STATUS.APPROVED,
  );

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        void this.loadExecutions(customerId);
      }
    });
  }

  statusBadgeClass(status: number): string {
    switch (status) {
      case INSPECTION_APPROVAL_STATUS.APPROVED:
        return "approval-chip approval-chip--approved";
      case INSPECTION_APPROVAL_STATUS.PENDING_REVIEW:
        return "approval-chip approval-chip--pending";
      case INSPECTION_APPROVAL_STATUS.RETURNED:
        return "approval-chip approval-chip--returned";
      case INSPECTION_APPROVAL_STATUS.REOPENED:
        return "approval-chip approval-chip--reopened";
      default:
        return "approval-chip approval-chip--draft";
    }
  }

  evaluationLabel(state: number): string {
    switch (state) {
      case 2:
        return "No accesible";
      case 3:
        return "Fuera de alcance";
      default:
        return "Evaluado";
    }
  }

  onPage(event: { first: number; rows: number }): void {
    void event;
  }

  async loadExecutions(customerId: string): Promise<void> {
    const result = await this.apiS.onGetList<InspectionExecutionListItem[]>(
      Endpoints.InspectionBaseline.executions(customerId),
    );
    this.executions.set(result ?? []);
  }

  async onRefresh(): Promise<void> {
    await this.loadExecutions(this.customerIdS.customerId());
    if (this.selectedId()) {
      await this.loadDetail(this.selectedId()!);
    }
  }

  async onSelect(item: InspectionExecutionListItem): Promise<void> {
    this.selectedId.set(item.id);
    this.reasonMode.set(null);
    this.reasonText.set("");
    await this.loadDetail(item.id);
  }

  private async loadDetail(executionId: string): Promise<void> {
    const [approval, coverage] = await Promise.all([
      this.apiS.onGetItem<InspectionApproval>(
        Endpoints.InspectionApprovals.get(executionId),
      ),
      this.apiS.onGetList<InspectionExecutionSnapshot[]>(
        Endpoints.InspectionBaseline.coverage(executionId),
      )]);
    this.approval.set(approval);
    this.coverage.set(coverage ?? []);
  }

  async onStartBaseline(): Promise<void> {
    if (!this.customerIdS.customerId()) return;
    this.busy.set(true);
    const created = await this.apiS.onPost<string>(
      Endpoints.InspectionBaseline.startInitialBaseline,
      {
        customerId: this.customerIdS.customerId(),
        assignedToUserId: this.authS.applicationUserId,
      },
      undefined,
      true,
      true,
    );
    this.busy.set(false);
    await this.onRefresh();
    if (typeof created === "string") {
      this.selectedId.set(created);
      await this.loadDetail(created);
    }
  }

  async onSubmit(): Promise<void> {
    await this.runAction(this.selectedId(), (id) =>
      this.apiS.onPost(Endpoints.InspectionApprovals.submit(id)),
    );
  }

  async onSign(): Promise<void> {
    await this.runAction(this.selectedId(), (id) =>
      this.apiS.onPost(Endpoints.InspectionApprovals.sign(id)),
    );
  }

  async onConfirmReason(): Promise<void> {
    const reason = this.reasonText().trim();
    if (!reason) return;
    const mode = this.reasonMode();
    const id = this.selectedId();
    if (!id) return;
    const url =
      mode === "reopen"
        ? Endpoints.InspectionApprovals.reopen(id)
        : Endpoints.InspectionApprovals.returnToInspector(id);
    await this.runAction(id, () => this.apiS.onPost(url, { reason }));
  }

  async onCreateAnnex(): Promise<void> {
    const id = this.selectedId();
    if (!id) return;
    this.busy.set(true);
    const annexId = await this.apiS.onPost<string>(
      Endpoints.InspectionApprovals.createAnnex,
      {
        originalInspectionExecutionId: id,
        assignedToUserId: this.authS.applicationUserId,
      },
    );
    this.busy.set(false);
    await this.onRefresh();
    if (typeof annexId === "string") {
      this.selectedId.set(annexId);
      await this.loadDetail(annexId);
    }
  }

  private async runAction(
    id: string | null,
    action: (id: string) => Promise<unknown>,
  ): Promise<void> {
    if (!id) return;
    this.busy.set(true);
    await action(id);
    this.busy.set(false);
    this.reasonMode.set(null);
    this.reasonText.set("");
    await this.onRefresh();
  }
}
