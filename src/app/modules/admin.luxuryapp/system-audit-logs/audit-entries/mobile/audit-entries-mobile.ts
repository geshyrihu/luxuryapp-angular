import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxCard } from "@ui/adaptive/card/card";
import { LxIcon } from "@ui/adaptive/icon/icon";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxDataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AuditEntry } from "../interfaces/audit-entry.interface";

@Component({
  selector: "app-audit-entries-mobile",
  templateUrl: "./audit-entries-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonWeb,
    ApiDatePipe,
    LxCard,
    LxTag,
    LuxDataViewMobile,
    MobileListItem,
    LxIcon,
  ],
})
export class AuditEntriesMobile {
  data = input.required<AuditEntry[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  globalFilterFields = input<string[]>([]);

  search = output<string>();
  loadMore = output<void>();
  toggleExpand = output<AuditEntry>();

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
