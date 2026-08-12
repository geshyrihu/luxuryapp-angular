import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxSkeleton } from "@ui/adaptive/skeleton/skeleton";
import { WebInputSelect } from "@ui/inputs/web/input-select/input-select";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { AppTag } from "@ui/web/tag/tag";
import { InterviewerMatrixService } from "./interviewer-matrix.service";
import { InterviewerMatrixItemDto } from "./interfaces/interviewer-matrix.dto";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

type MatrixCellState = "active" | "inactive" | "empty";

@Component({
  selector: "app-interviewer-matrix",
  standalone: true,
  templateUrl: "./interviewer-matrix.html",
  styleUrls: ["./interviewer-matrix.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, LxCard, LxSkeleton, WebInputSelect, AppIcon, AppTag],
})
export class InterviewerMatrix implements OnInit {
  private service = inject(InterviewerMatrixService);

  loading = signal(true);
  savingKey = signal<string | null>(null);
  customers = signal<SelectItemDto[]>([]);
  roles = signal<SelectItemDto[]>([]);
  selectedCustomerId = signal<string>("");
  rules = signal<InterviewerMatrixItemDto[]>([]);

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
        .map((rule) => rule.interviewerRole),
    );
    return rows.size;
  });

  readonly activeColumnsCount = computed(() => {
    const columns = new Set(
      this.rules()
        .filter((rule) => rule.isActive)
        .map((rule) => rule.workPositionRole),
    );
    return columns.size;
  });

  readonly activeRowCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const rule of this.rules()) {
      if (!rule.isActive) continue;
      counts.set(rule.interviewerRole, (counts.get(rule.interviewerRole) ?? 0) + 1);
    }
    return counts;
  });

  readonly activeColumnCounts = computed(() => {
    const counts = new Map<number, number>();
    for (const rule of this.rules()) {
      if (!rule.isActive) continue;
      counts.set(rule.workPositionRole, (counts.get(rule.workPositionRole) ?? 0) + 1);
    }
    return counts;
  });

  private readonly invalidRoleLabels = ["--seleccione una opción--", "--seleccione una opcion--"];

  ngOnInit(): void {
    this.loadCatalogs();
  }

  private loadCatalogs(): void {
    this.loading.set(true);
    Promise.all([this.service.getCustomers(), this.service.getRoles()])
      .then(([customers, roles]) => {
        const customerItems = customers ?? [];
        const roleItems = (roles ?? []).filter((role) => this.isValidRoleOption(role));

        this.customers.set(customerItems);
        this.roles.set(roleItems);

        if (!this.selectedCustomerId() && customerItems.length === 1) {
          this.onCustomerChange(String(customerItems[0].value ?? ""));
        }
      })
      .finally(() => this.loading.set(false));
  }

  private isValidRoleOption(role: SelectItemDto): boolean {
    const label = String(role.label ?? "").trim().toLowerCase();
    const value = this.toRoleValue(role.value);

    return !this.invalidRoleLabels.includes(label) && Number.isFinite(value) && value > 0;
  }

  onCustomerChange(customerId: string): void {
    this.selectedCustomerId.set(customerId);
    if (!customerId) {
      this.rules.set([]);
      return;
    }

    this.loading.set(true);
    this.service
      .getByCustomer(customerId)
      .then((data) => this.rules.set(data ?? []))
      .finally(() => this.loading.set(false));
  }

  getCellKey(interviewerRole: number, workPositionRole: number): string {
    return `${interviewerRole}-${workPositionRole}`;
  }

  toRoleValue(value: SelectItemDto["value"]): number {
    return Number(value ?? 0);
  }

  getActiveRowCount(interviewerRole: number): number {
    return this.activeRowCounts().get(interviewerRole) ?? 0;
  }

  getActiveColumnCount(workPositionRole: number): number {
    return this.activeColumnCounts().get(workPositionRole) ?? 0;
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
    const customerId = this.selectedCustomerId();
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
