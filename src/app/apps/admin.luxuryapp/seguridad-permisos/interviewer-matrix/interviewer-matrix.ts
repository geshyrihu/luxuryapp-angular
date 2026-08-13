import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxCard } from "@ui/adaptive/card/card";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppTag } from "@ui/web/tag/tag";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { InterviewerMatrixService } from "./interviewer-matrix.service";
import {
  InterviewerMatrixItemDto,
  InterviewerMatrixRoleOptionDto,
} from "./interfaces/interviewer-matrix.dto";

type MatrixCellState = "active" | "inactive" | "empty";

@Component({
  selector: "app-interviewer-matrix",
  standalone: true,
  templateUrl: "./interviewer-matrix.html",
  styleUrls: ["./interviewer-matrix.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LxCard, LxSkeleton, AppIcon, AppTag],
})
export class InterviewerMatrix implements OnInit {
  private service = inject(InterviewerMatrixService);
  private customerIdS = inject(CustomerIdService);

  loading = signal(true);
  savingKey = signal<string | null>(null);
  interviewerRoles = signal<InterviewerMatrixRoleOptionDto[]>([]);
  workPositionRoles = signal<InterviewerMatrixRoleOptionDto[]>([]);
  rules = signal<InterviewerMatrixItemDto[]>([]);
  readonly activeCustomerId = this.customerIdS.customerId;
  readonly activeCustomerName = computed(
    () => this.customerIdS.nombreCorto() || this.customerIdS.customerName(),
  );
  readonly customerReady = this.customerIdS.customerDataReady;

  readonly rulesMap = computed(() => {
    const map = new Map<string, InterviewerMatrixItemDto>();
    for (const rule of this.rules()) {
      map.set(this.getCellKey(rule.interviewerRole, rule.workPositionRole), rule);
    }
    return map;
  });

  readonly activeRulesCount = computed(
    () => this.rules().filter((rule) => rule.isActive).length,
  );

  readonly activeRowsCount = computed(() => {
    const rows = new Set(
      this.rules()
        .filter((rule) => rule.isActive)
        .map((rule) => rule.workPositionRole),
    );
    return rows.size;
  });

  readonly activeColumnsCount = computed(() => {
    const columns = new Set(
      this.rules()
        .filter((rule) => rule.isActive)
        .map((rule) => rule.interviewerRole),
    );
    return columns.size;
  });

  readonly activeRowCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const rule of this.rules()) {
      if (!rule.isActive) continue;
      counts.set(rule.workPositionRole, (counts.get(rule.workPositionRole) ?? 0) + 1);
    }
    return counts;
  });

  readonly activeColumnCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const rule of this.rules()) {
      if (!rule.isActive) continue;
      counts.set(rule.interviewerRole, (counts.get(rule.interviewerRole) ?? 0) + 1);
    }
    return counts;
  });

  private readonly invalidRoleLabels = ["--seleccione una opción--", "--seleccione una opcion--"];

  constructor() {
    effect(() => {
      const customerId = this.activeCustomerId();
      const isReady = this.customerReady();

      if (!isReady) {
        this.rules.set([]);
        return;
      }

      if (customerId) {
        void this.loadMatrixForCustomer(customerId);
      }
    });
  }

  ngOnInit(): void {
    this.loading.set(false);
  }

  private async loadMatrixForCustomer(customerId: string): Promise<void> {
    if (!customerId) {
      this.interviewerRoles.set([]);
      this.workPositionRoles.set([]);
      this.rules.set([]);
      return;
    }

    this.loading.set(true);
    try {
      const board = await this.service.getBoard(customerId);
      this.interviewerRoles.set(board?.interviewerRoles ?? []);
      this.workPositionRoles.set(board?.workPositionRoles ?? []);
      this.rules.set(board?.rules ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  getCellKey(interviewerRole: number, workPositionRole: number): string {
    return `${interviewerRole}-${workPositionRole}`;
  }

  toRoleValue(value: number | null | undefined): number {
    return Number(value ?? 0);
  }

  getActiveRowCount(workPositionRole: number): number {
    return this.activeRowCounts().get(workPositionRole) ?? 0;
  }

  getActiveColumnCount(interviewerRole: number): number {
    return this.activeColumnCounts().get(interviewerRole) ?? 0;
  }

  getCellState(interviewerRole: number, workPositionRole: number): MatrixCellState {
    const rule = this.rulesMap().get(this.getCellKey(interviewerRole, workPositionRole));
    if (!rule) return "empty";
    return rule.isActive ? "active" : "inactive";
  }

  isSavingCell(interviewerRole: number, workPositionRole: number): boolean {
    return this.savingKey() === this.getCellKey(interviewerRole, workPositionRole);
  }

  async toggleCell(interviewerRole: number, workPositionRole: number): Promise<void> {
    const customerId = this.activeCustomerId();
    if (!customerId) return;

    const cellKey = this.getCellKey(interviewerRole, workPositionRole);
    const existingRule = this.rulesMap().get(cellKey);

    this.savingKey.set(cellKey);
    try {
      if (!existingRule) {
        const created = await this.service.create({
          customerId,
          interviewerRole,
          workPositionRole,
          isActive: true,
        });

        if (created && typeof created !== "boolean") {
          this.rules.update((current) => [...current, created]);
        }
        return;
      }

      if (existingRule.isActive) {
        await this.service.remove(existingRule.id);
        this.rules.update((current) => current.filter((rule) => rule.id !== existingRule.id));
        return;
      }

      const updated = await this.service.update(existingRule.id, {
        id: existingRule.id,
        customerId: existingRule.customerId,
        interviewerRole,
        workPositionRole,
        isActive: true,
      });

      if (updated && typeof updated !== "boolean") {
        this.rules.update((current) =>
          current.map((rule) => (rule.id === existingRule.id ? updated : rule)),
        );
      }
    } finally {
      this.savingKey.set(null);
    }
  }
}
