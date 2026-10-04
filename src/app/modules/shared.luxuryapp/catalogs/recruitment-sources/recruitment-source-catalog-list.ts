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
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { RecruitmentSourceCatalogListDesktop } from "./desktop/recruitment-source-catalog-list-desktop";
import { RecruitmentSourceCatalogDTO } from "./interfaces/recruitment-source-catalog.dto";
import { RecruitmentSourceCatalogListMobile } from "./mobile/recruitment-source-catalog-list-mobile";
import { RecruitmentSourceCatalogForm } from "./recruitment-source-catalog-form";

@Component({
  selector: "app-recruitment-source-catalog-list",
  templateUrl: "./recruitment-source-catalog-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecruitmentSourceCatalogListDesktop, RecruitmentSourceCatalogListMobile],
})
export class RecruitmentSourceCatalogList implements OnInit {
  dialogHandlerS = inject(DialogHandlerService);
  apiResponseS = inject(ApiResponseService);
  platformS = inject(PlatformService);

  dataSignal = signal<RecruitmentSourceCatalogDTO[]>([]);
  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<RecruitmentSourceCatalogDTO[]>(
        Endpoints.Catalogs.RecruitmentSources.getAll,
      )
      .then((result) => {
        if (result) this.dataSignal.set(result);
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.Catalogs.RecruitmentSources.delete(id))
      .then((result) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        RecruitmentSourceCatalogForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
