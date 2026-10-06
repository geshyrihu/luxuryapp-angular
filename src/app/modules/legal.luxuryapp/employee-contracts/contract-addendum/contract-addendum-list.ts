import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { ContractAddendumFormComponent } from "./contract-addendum-form";
import { ContractAddendumListDesktop } from "./desktop/contract-addendum-list-desktop";
import { ContractAddendumListDTO } from "./interfaces/contract-addendum.dto";
import { ContractAddendumListMobile } from "./mobile/contract-addendum-list-mobile";

@Component({
  selector: "app-contract-addendum-list",
  templateUrl: "./contract-addendum-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ContractAddendumListDesktop, ContractAddendumListMobile],
})
export class ContractAddendumList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  confirmS = inject(ConfirmService);
  private route = inject(ActivatedRoute);
  employeeId = signal<string | null>(null);

  items = signal<ContractAddendumListDTO[]>([]);
  globalFilter = signal<string>("");
  globalFilterFields = globalFilterFields([
    "addendumNumber",
    "title",
    "addendumType",
    "addendumStatus"]);

  ngOnInit(): void {
    this.employeeId.set(this.route.snapshot.queryParamMap.get("employeeId"));
    this.onLoadData();
  }

  onLoadData(): void {
    this.apiS
      .onGetList<ContractAddendumListDTO[]>(
        Endpoints.HR.ContractAddendum.getAll,
      )
      .then((resp) => {
        if (resp) this.items.set(resp);
      });
  }

  onModalForm(data: { id: string; title: string }): void {
    this.dialogHandlerS
      .openDialog(
        ContractAddendumFormComponent,
        { data: { item: null } },
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: ContractAddendumListDTO): void {
    this.dialogHandlerS
      .openDialog(
        ContractAddendumFormComponent,
        { data: { item } },
        "Editar Adenda",
        this.dialogHandlerS.sizeXl,
      )
      .then(() => this.onLoadData());
  }

  onSign(item: ContractAddendumListDTO): void {
    // TODO: Implementar diálogo de firmar adenda
    console.log("Firmar adenda:", item.id);
  }

  onCancel(item: ContractAddendumListDTO): void {
    this.apiS
      .onPatch(Endpoints.HR.ContractAddendum.cancel(item.id), {})
      .then(() => this.onLoadData());
  }

  async onDelete(id: string): Promise<void> {
    const ok = await this.confirmS.confirm(
      "¿Está seguro de eliminar esta adenda de contrato?",
    );
    if (!ok) return;
    this.apiS
      .onDelete(Endpoints.HR.ContractAddendum.delete(id))
      .then(() => this.onLoadData());
  }
}
