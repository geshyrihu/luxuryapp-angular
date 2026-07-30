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
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  CommitteeDirectoryGroup,
  CommitteeDirectoryMember,
} from "src/app/core/interfaces/comite-vigilancia.interface";

type CommitteeDirectoryFlatItem = CommitteeDirectoryMember & {
  customerName: string;
};

@Component({
  selector: "app-comites-list",
  templateUrl: "./comites-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    PrimeNgCustomTableEmptyMessage,
    TableModule,
    PrimeNgCustomCaption,
    DataViewMobile,
    PrimeNgCustomTableFooter,
    MobileListItem,
    AppIcon,
  ],
})
export class ComitesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  dataSignal = signal<CommitteeDirectoryGroup[]>([]);
  loading = signal(true);
  tablePrimeNgRows = tablePrimeNgRows();
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
      .onGetList<CommitteeDirectoryGroup[]>(Endpoints.LegalDirectories.committees)
      .then((result) => {
        this.dataSignal.set(result);
        this.loading.set(false);
      });
  }
}
