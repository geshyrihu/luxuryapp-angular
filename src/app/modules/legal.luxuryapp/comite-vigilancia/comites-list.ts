import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { TableCaption } from "@ui/web/table-caption/table-caption";
import { TableEmptyMessage } from "@ui/web/table-empty-message/table-empty-message";
import { TableFooter } from "@ui/web/table-footer/table-footer";
import { AppTable, AppSortableColumn, AppSorticon } from "@ui/web/table/table";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tableRows,
} from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  CommitteeDirectoryGroup,
  CommitteeDirectoryMember,
} from "@core/interfaces/comite-vigilancia.interface";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

type CommitteeDirectoryFlatItem = CommitteeDirectoryMember & {
  customerName: string;
};

@Component({
  selector: "app-comites-list",
  templateUrl: "./comites-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TableEmptyMessage,
    AppTable,
    AppSortableColumn,
    AppSorticon,
    TableCaption,
    DataViewMobile,
    TableFooter,
    MobileListItem,
    AppIcon,
  ],
})
export class ComitesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dataSignal = signal<CommitteeDirectoryGroup[]>([]);
  loading = signal(true);
  tableRows = tableRows();
  rowsPerPageOptions = rowsPerPageOptions();

  flatData = computed<CommitteeDirectoryFlatItem[]>(() => {
    return this.dataSignal().flatMap((customerGroup) =>
      customerGroup.committeeMembers.map((member) => ({
        ...member,
        customerName: customerGroup.customer.nombreCorto,
      })),
    );
  });

  globalFilterFields = computed(() => {
    const data = this.flatData();
    if (!data || data.length === 0) return [];
    return globalFilterFields(data);
  });

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.loading.set(true);
    this.apiResponseS
      .onGetList<CommitteeDirectoryGroup[]>(
        Endpoints.LegalDirectories.committees,
      )
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }
}

