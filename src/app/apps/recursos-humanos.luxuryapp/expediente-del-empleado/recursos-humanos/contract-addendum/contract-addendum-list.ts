import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { PrimeNgCustomTableEmptyMessage } from "@ui/web/primeng-custom-table-emptymessage/primeng-custom-table-emptymessage";
import { PrimeNgCustomTableFooter } from "@ui/web/primeng-custom-table-footer/primeng-custom-table-footer";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { DialogSize } from "src/app/core/enums/dialog-size.enum";
import {
  globalFilterFields,
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { ContractAddendumFormComponent } from "./contract-addendum-form";
import { ContractAddendumListDTO } from "./interfaces/contract-addendum.dto";

import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";

import { WebButtonIconDelete } from "@ui/buttons/web-icon/button-delete";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonIconItem } from "@ui/buttons/web-icon/button-item";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";

@Component({
  selector: "app-contract-addendum-list",
  templateUrl: "./contract-addendum-list.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    MobileListItem,
    WebButtonIconItem,
    WebButtonIconEdit,
    WebButtonIconDelete,
    MobileActionMenu,
    MobileButtonLabelItem,
    PrimeNgCustomTableEmptyMessage,
    DatePipe,
    TableModule,
    PrimeNgCustomCaption,
    PrimeNgCustomTableFooter,
    DataViewMobile,
  ],
})
export class ContractAddendumList implements OnInit {
  apiS = inject(ApiResponseService);
  dialogS = inject(DialogHandlerService);
  tableScrollH = inject(TableScrollHeightService);

  items = signal<ContractAddendumListDTO[]>([]);
  globalFilter = signal<string>("");
  tablePrimeNgRows: number = tablePrimeNgRows();
  rowsPerPageOptions: number[] = rowsPerPageOptions();
  globalFilterFields = globalFilterFields([
    "addendumNumber",
    "title",
    "addendumType",
    "addendumStatus",
  ]);

  ngOnInit(): void {
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
    this.dialogS
      .openDialog(
        ContractAddendumFormComponent,
        { data: { item: null } },
        data.title,
        DialogSize.lg,
      )
      .then(() => this.onLoadData());
  }

  onEdit(item: ContractAddendumListDTO): void {
    this.dialogS
      .openDialog(
        ContractAddendumFormComponent,
        { data: { item } },
        "Editar Adenda",
        DialogSize.lg,
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

  onDelete(id: string): void {
    this.apiS
      .onDelete(Endpoints.HR.ContractAddendum.delete(id))
      .then(() => this.onLoadData());
  }

  getAddendumTypeBadge(type: string): string {
    const map: Record<string, string> = {
      ModificacionSalario: "badge-warning",
      CambioPuesto: "badge-info",
      CambioDepartamento: "badge-info",
      CambioUbicacion: "badge-info",
      ExtensionContrato: "badge-primary",
      ModificacionJornada: "badge-info",
      ClausulaAdicional: "badge-neutral",
      OtrasCondiciones: "badge-neutral",
    };
    return map[type] ?? "badge-neutral";
  }

  getStatusBadge(status: string): string {
    const map: Record<string, string> = {
      Borrador: "badge-neutral",
      Pendiente: "badge-warning",
      Firmado: "badge-success",
      Cancelado: "badge-danger",
    };
    return map[status] ?? "badge-neutral";
  }
}
