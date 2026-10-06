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
import { IncidentTypeListDTO } from "@human-resources.luxuryapp/evaluation/hr-catalog/interfaces/hr-catalog.interfaces";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { IncidentTypeListDesktop } from "./desktop/incident-type-list-desktop";
import { IncidentTypeListMobile } from "./mobile/incident-type-list-mobile";
import { IncidentTypeForm } from "./incident-type-form";

@Component({
  selector: "app-incident-type-list",
  templateUrl: "./incident-type-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IncidentTypeListDesktop, IncidentTypeListMobile],
})
export class IncidentTypeList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  items = signal<IncidentTypeListDTO[]>([]);
  readonly globalFilterFields = globalFilterFields([
    "name",
    "category",
    "defaultSeverity",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<IncidentTypeListDTO[]>(Endpoints.Settings.incidentTypes)
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogS
      .openDialog(IncidentTypeForm, data, data.title, DialogSize.sm)
      .then(() => this.onLoadData());
  }

  async onDelete(id: string): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este tipo de incidencia?",
    );
    if (!ok) return;
    this.apiS
      .onDelete(Endpoints.Settings.deleteIncidentType(id))
      .then(() => this.onLoadData());
  }
}
