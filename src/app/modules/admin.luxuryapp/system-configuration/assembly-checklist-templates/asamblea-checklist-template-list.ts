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
import { AsambleaChecklistTemplateForm } from "./asamblea-checklist-template-form";
import { AsambleaChecklistTemplateListDesktop } from "./desktop/asamblea-checklist-template-list-desktop";
import { AsambleaChecklistTemplateDto } from "./interfaces/asamblea-checklist-template.dto";
import { AsambleaChecklistTemplateListMobile } from "./mobile/asamblea-checklist-template-list-mobile";

@Component({
  selector: "app-asamblea-checklist-template-list",
  templateUrl: "./asamblea-checklist-template-list.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsambleaChecklistTemplateListDesktop,
    AsambleaChecklistTemplateListMobile,
  ],
})
export class AsambleaChecklistTemplateList implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);

  readonly dataSignal = signal<AsambleaChecklistTemplateDto[]>([]);
  readonly globalFilterFields = globalFilterFields([
    "code",
    "title",
    "category",
    "defaultResponsibleRole",
  ]);

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList<AsambleaChecklistTemplateDto[]>(
        Endpoints.AsambleaChecklistTemplate.getAll,
      )
      .then((result) => {
        if (result) {
          this.dataSignal.set(result);
        }
      });
  }

  onDelete(id: string) {
    this.apiResponseS
      .onDelete(Endpoints.AsambleaChecklistTemplate.delete(id))
      .then((response) => {
        if (response) {
          this.onLoadData();
        }
      });
  }

  onModalForm(data: { id: string; title: string }) {
    this.dialogHandlerS
      .openDialog(
        AsambleaChecklistTemplateForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }
}
