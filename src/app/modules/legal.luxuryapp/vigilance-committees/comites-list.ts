import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  CommitteeDirectoryGroup,
  CommitteeDirectoryMember,
} from "@core/interfaces/comite-vigilancia.interface";
import { PlatformService } from "@core/services/platform.service";
import { ComitesListDesktop } from "./desktop/comites-list-desktop";
import { ComitesListMobile } from "./mobile/comites-list-mobile";

type CommitteeDirectoryFlatItem = CommitteeDirectoryMember & {
  customerName: string;
};

@Component({
  selector: "app-comites-list",
  templateUrl: "./comites-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ComitesListDesktop, ComitesListMobile],
})
export class ComitesList implements OnInit {
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  dataSignal = signal<CommitteeDirectoryGroup[]>([]);
  loading = signal(true);

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
