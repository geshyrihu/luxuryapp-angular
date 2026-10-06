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
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ContractTemplateFormComponent } from "./contract-template-form";
import { ContractTemplateListDesktop } from "./desktop/contract-template-list-desktop";
import { ContractTemplateListDTO } from "./interfaces/contract-template.dto";
import { ContractTemplateListMobile } from "./mobile/contract-template-list-mobile";

@Component({
  selector: "app-contract-template-list",
  templateUrl: "./contract-template-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContractTemplateListDesktop, ContractTemplateListMobile],
})
export class ContractTemplateList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);

  items = signal<ContractTemplateListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = computed(() => globalFilterFields(this.items()));

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<ContractTemplateListDTO[]>(
        Endpoints.HR.ContractTemplate.getAll,
      )
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        ContractTemplateFormComponent,
        { item: null },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: ContractTemplateListDTO): void {
    this.dialogHandlerS
      .openDialog(
        ContractTemplateFormComponent,
        { item },
        "Editar Machote",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onToggleActive(item: ContractTemplateListDTO): void {
    this.apiS
      .onPatch(Endpoints.HR.ContractTemplate.toggleActive(item.id), {})
      .then(() => this.onLoadData());
  }

  async onDelete(id: string): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar este machote de contrato?",
    );
    if (!ok) return;
    this.apiS
      .onDelete(Endpoints.HR.ContractTemplate.delete(id))
      .then(() => this.onLoadData());
  }
}
