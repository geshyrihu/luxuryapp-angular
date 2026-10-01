import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { MobileButtonLabelDelete } from "@ui/buttons/mobile-label/button-delete";
import { MobileButtonLabelEdit } from "@ui/buttons/mobile-label/button-edit";
import { MobileButtonLabelItem } from "@ui/buttons/mobile-label/button-item";
import { MobileButtonLabel } from "@ui/buttons";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { InspectionListItem } from "../../models/inspection.model";

@Component({
  selector: "app-lista-inspecciones-mobile",
  templateUrl: "./lista-inspecciones-mobile.html",
  styleUrls: ["../lista-inspecciones.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    CustomInputSelectSignal,
    DataViewMobile,
    MobileActionMenu,
    MobileButtonLabelDelete,
    MobileButtonLabelEdit,
    MobileButtonLabelItem,
    MobileButtonLabel,
  ],
})
export class ListaInspeccionesMobile {
  groupedData = input<Record<string, InspectionListItem["inspecciones"]>>({});
  areasResponsables = input<SelectItemDto[]>([]);
  selectedArea = input("");
  selectedRecurrence = input("");

  add = output<void>();
  edit = output<{ id: string; title: string }>();
  detalles = output<string>();
  delete = output<string>();
  reportes = output<void>();
  filterAreaChange = output<string>();
  filterRecurrenceChange = output<string>();
}
