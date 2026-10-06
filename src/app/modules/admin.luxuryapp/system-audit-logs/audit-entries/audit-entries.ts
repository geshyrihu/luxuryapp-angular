import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields, tableRows } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { DateService } from "@core/services/date.service";
import { PlatformService } from "@core/services/platform.service";
import { AuditEntry } from "./interfaces/audit-entry.interface";
import { AuditEntriesDesktop } from "./desktop/audit-entries-desktop";
import { AuditEntriesMobile } from "./mobile/audit-entries-mobile";

@Component({
  selector: "app-audit-entries",
  imports: [AuditEntriesDesktop, AuditEntriesMobile],
  templateUrl: "./audit-entries.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./audit-entries.scss"],
})
export class AuditEntries implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
  platformS = inject(PlatformService);

  data = signal<AuditEntry[]>([]);
  loading = signal(true);

  totalRecords = signal(0);
  rows = signal(tableRows());
  searchTerm = signal<string>("");
  currentPage = signal(1);

  filterOperationControl = new FormControl<string | null>(null);
  filterEntityControl = new FormControl<string | null>(null);
  filterDateRangeControl = new FormControl<Date[] | null>(null);

  operationOptions: SelectItemDto[] = [
    { label: "Create", value: "Create" },
    { label: "Update", value: "Update" },
    { label: "Delete", value: "Delete" }];

  entityOptions: SelectItemDto[] = [];

  readonly globalFilterFields = computed(() => {
    const data = this.data();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

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
}
