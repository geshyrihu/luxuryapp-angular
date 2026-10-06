import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SanctionListDesktop } from "./desktop/sanction-list-desktop";
import { SanctionListDTO } from "./interfaces/sanction.dto";
import { SanctionListMobile } from "./mobile/sanction-list-mobile";
import { SanctionFormComponent } from "./sanction-form";

@Component({
  selector: "app-sanction-list",
  templateUrl: "./sanction-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [SanctionListDesktop, SanctionListMobile],
})
export class SanctionList {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  items = signal<SanctionListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = globalFilterFields([
    "employeeName",
    "sanctionTypeName",
    "sanctionStatus"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<SanctionListDTO[]>(Endpoints.HR.Sanction.getAll)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onCreate(incidentId: string): void {
    this.dialogHandlerS
      .openDialog(
        SanctionFormComponent,
        { data: { incidentId } },
        "Nueva Sanción",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onChangeStatus(item: SanctionListDTO): void {
    this.dialogHandlerS
      .openDialog(
        SanctionFormComponent,
        { data: { id: item.id, changeStatus: true } },
        "Cambiar Estado de Sanción",
        this.dialogHandlerS.sizeMd,
      )
      .then(() => this.onLoadData());
  }
}
