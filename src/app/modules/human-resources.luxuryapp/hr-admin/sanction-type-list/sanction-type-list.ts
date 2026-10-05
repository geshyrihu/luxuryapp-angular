import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";

import { Endpoints } from "@core/constants/endpoints/endpoints";
import { DialogSize } from "@core/enums/dialog-size.enum";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { SanctionTypeListDTO } from "@human-resources.luxuryapp/evaluation/hr-catalog/interfaces/hr-catalog.interfaces";
import { SanctionTypeListDesktop } from "./desktop/sanction-type-list-desktop";
import { SanctionTypeListMobile } from "./mobile/sanction-type-list-mobile";
import { SanctionTypeForm } from "./sanction-type-form";

@Component({
  selector: "app-sanction-type-list",
  templateUrl: "./sanction-type-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SanctionTypeListDesktop, SanctionTypeListMobile],
})
export class SanctionTypeList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  items = signal<SanctionTypeListDTO[]>([]);
  readonly globalFilterFields = globalFilterFields(["name", "severityLevel"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<SanctionTypeListDTO[]>(Endpoints.Settings.sanctionTypes)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS
      .openDialog(SanctionTypeForm, data, data.title, DialogSize.sm)
      .then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.Settings.deleteSanctionType(id))
      .then(() => this.onLoadData());
  }
}
