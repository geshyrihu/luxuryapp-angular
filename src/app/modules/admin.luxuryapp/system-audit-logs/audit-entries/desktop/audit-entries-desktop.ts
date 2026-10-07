import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { rowsPerPageOptions } from "@core/helpers/table-options";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputDateSignal } from "@ui/inputs/web/lux-input-date-signal";
import { LuxInputSelectSignal } from "@ui/inputs/web/lux-input-select-signal";
import { LuxTableCaption } from "src/app/shared/ui/web/lux-table-caption/lux-table-caption";
import { TableEmptyMessage } from "src/app/shared/ui/web/lux-table-empty-message/lux-table-empty-message";
import {
  AppSortableColumn,
  AppSorticon,
  AppTable,
} from "src/app/shared/ui/web/lux-table/lux-table";
import { AuditEntry } from "../interfaces/audit-entry.interface";

@Component({
  selector: "app-audit-entries-desktop",
  templateUrl: "./audit-entries-desktop.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    TableEmptyMessage,
    ApiDatePipe,
    ReactiveFormsModule,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    LxCard,
    LxTag,
    LuxInputDateSignal,
    LuxInputSelectSignal,
    LuxTableCaption,
  ],
})
export class AuditEntriesDesktop {
  data = input.required<AuditEntry[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  rows = input<number>(0);
  globalFilterFields = input<string[]>([]);
  operationOptions = input<SelectItemDto[]>([]);
  entityOptions = input<SelectItemDto[]>([]);
  filterOperationControl = input.required<FormControl<string | null>>();
  filterEntityControl = input.required<FormControl<string | null>>();
  filterDateRangeControl = input.required<FormControl<Date[] | null>>();

  pageChange = output<any>();
  search = output<string>();
  loadData = output<void>();
  toggleExpand = output<AuditEntry>();

  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  /** Agrupa las filas Update por (entityName+entityId) para expandir */
  readonly groupedData = computed(() => {
    const items = this.data();
    const result: AuditEntry[] = [];
    const seen = new Set<string>();
    for (const item of items) {
      if (item.operationType === "Update" && item.propertyName) {
        const key = `${item.entityName}|${item.entityId}|${item.changedAt}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push({ ...item, groupKey: key, expanded: false });
        }
      } else {
        result.push(item);
      }
    }
    return result;
  });

  getGroupItems(groupKey: string): AuditEntry[] {
    return this.data().filter((item) => {
      const key = `${item.entityName}|${item.entityId}|${item.changedAt}`;
      return key === groupKey && item.propertyName;
    });
  }

  getOperationSeverity(
    op: string,
  ): "success" | "info" | "warn" | "danger" | "contrast" {
    switch (op) {
      case "Create":
        return "success";
      case "Update":
        return "info";
      case "Delete":
        return "danger";
      default:
        return "contrast";
    }
  }
}
