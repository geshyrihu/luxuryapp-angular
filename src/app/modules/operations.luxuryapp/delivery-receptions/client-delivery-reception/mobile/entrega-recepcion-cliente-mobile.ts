import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";

@Component({
  selector: "app-entrega-recepcion-cliente-lista-mobile",
  templateUrl: "./entrega-recepcion-cliente-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DataViewMobile,
    MobileListItem,
    MobileActionMenu,
    MobileButtonLabelEdit,
    MobileButtonLabelDelete,
    MobileButtonLabelItem,
  ],
})
export class EntregaRecepcionClienteListaMobile {
  data = input.required<any[]>();
  globalFilterFields = input<string[]>([]);
  departamentos = input<{ value: string }[]>([]);
  selectedDepartamento = input<string>("");
  showDepartmentFilter = input<boolean>(false);

  add = output<void>();
  edit = output<{ id: string; title: string }>();
  validar = output<string>();
  invalidar = output<string>();
  deleteFile = output<string>();
  departamentoChange = output<string>();
}
