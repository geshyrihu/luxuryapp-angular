import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { AddendumTemplateFormComponent } from "./addendum-template-form";
import { AddendumTemplateListDesktop } from "./desktop/addendum-template-list-desktop";
import { AddendumTemplateListDTO } from "./interfaces/addendum-template.dto";
import { AddendumTemplateListMobile } from "./mobile/addendum-template-list-mobile";

@Component({
  selector: "app-addendum-template-list",
  templateUrl: "./addendum-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AddendumTemplateListDesktop, AddendumTemplateListMobile],
})
export class AddendumTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  items = signal<AddendumTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = globalFilterFields(["name", "addendumType"]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<AddendumTemplateListDTO[]>(
        Endpoints.HR.AddendumTemplate.getAll,
      )
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        AddendumTemplateFormComponent,
        { data: { item: null } },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: AddendumTemplateListDTO): void {
    this.dialogHandlerS
      .openDialog(
        AddendumTemplateFormComponent,
        { data: { item } },
        "Editar Machote de Adenda",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onToggleActive(item: AddendumTemplateListDTO): void {
    this.apiS
      .onPatch(Endpoints.HR.AddendumTemplate.toggleActive(item.id), {})
      .then(() => this.onLoadData());
  }

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.AddendumTemplate.delete(id))
      .then(() => this.onLoadData());
  }
}
