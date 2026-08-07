import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DateService } from "src/app/core/services/date.service";
import { AppIcon } from "../../../../shared/ui/shared/app-icon/app-icon";
import { AuditEntry } from "./interfaces/audit-entry.interface";

@Component({
  selector: "app-audit-entries",
  imports: [
    PrimeNgCustomTableEmptyMessage,
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    LxCard,
    LxTag,
    WebButtonIcon,
    WebButtonLabel,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    DataViewMobile,
    MobileListItem,
    PrimeNgCustomCaption,
    AppIcon,
  ],
  templateUrl: "./audit-entries.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./audit-entries.scss"],
})
export class AuditEntries implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);

  data = signal<AuditEntry[]>([]);
  loading = signal(true);

  totalRecords = signal(0);
  rows = signal(tablePrimeNgRows());
  searchTerm = signal<string>("");
  currentPage = signal(1);

  filterOperationControl = new FormControl<string | null>(null);
  filterEntityControl = new FormControl<string | null>(null);
  filterDateRangeControl = new FormControl<Date[] | null>(null);

  operationOptions: SelectItemDto[] = [
    { label: "Create", value: "Create" },
    { label: "Update", value: "Update" },
    { label: "Delete", value: "Delete" },
  ];

  entityOptions: SelectItemDto[] = [];

  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  readonly rowsPerPageOptions: number[] = rowsPerPageOptions();

  /** Agrupa las filas Update por (entityName+entityId) para expandir */
  groupedData = computed(() => {
    const items = this.data();
    const map = new Map<string, AuditEntry[]>();
    for (const item of items) {
      if (item.operationType === "Update" && item.propertyName) {
        const key = `${item.entityName}|${item.entityId}|${item.changedAt}`;
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(item);
      }
    }
    // Return the first item of each group as the "row", plus non-update items
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

  ngOnInit(): void {
    this.onLoadData(true);
  }

  onLoadData(isNewSearch: boolean = false): void {
    if (isNewSearch) {
      this.currentPage.set(1);
    }

    this.loading.set(true);
    const urlApi = Endpoints.AuditEntries.base;

    const params: any = {
      page: this.currentPage(),
      recordsNumber: this.rows(),
      filter: this.searchTerm(),
    };

    if (this.filterOperationControl.value) {
      params.operationType = this.filterOperationControl.value;
    }

    if (this.filterEntityControl.value) {
      params.entityName = this.filterEntityControl.value;
    }

    const dates = this.filterDateRangeControl.value;
    if (dates && dates.length === 2) {
      if (dates[0]) params.startDate = this.dateS.getDateFormat(dates[0]);
      if (dates[1]) params.endDate = this.dateS.getDateFormat(dates[1]);
    }

    this.apiResponseS.onGetList(urlApi, params).then((result: any) => {
      if (result) {
        if (isNewSearch) {
          this.data.set(result.items || []);
          this.totalRecords.set(result.totalRecords ?? 0);
          this.collectEntityNames(result.items || []);
        } else {
          const newItems = result.items || [];
          this.data.update((current) => [...current, ...newItems]);
          this.totalRecords.set(result.totalRecords ?? this.data().length);
          this.collectEntityNames(newItems);
        }
      } else {
        this.data.set([]);
        this.totalRecords.set(0);
      }
      this.loading.set(false);
    });
  }

  private collectEntityNames(items: AuditEntry[]): void {
    const names = new Set<string>();
    for (const item of this.entityOptions) {
      names.add(item.value as string);
    }
    for (const item of items) {
      if (item.entityName) names.add(item.entityName);
    }
    this.entityOptions = Array.from(names)
      .sort()
      .map((name) => ({ label: name, value: name }));
  }

  onPageChange(event: any): void {
    this.rows.set(event.rows);
    this.currentPage.set(event.first / event.rows + 1);
    this.onLoadData(true);
  }

  toggleExpand(item: AuditEntry): void {
    item.expanded = !item.expanded;
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.onLoadData(true);
  }

  loadMore(): void {
    this.currentPage.update((p) => p + 1);
    this.onLoadData();
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
