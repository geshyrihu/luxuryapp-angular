import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { SelectItemDto } from "@core/interfaces/select-item.dto";
import { ButtonMobile } from "@ui/buttons/mobile";
import { LuxInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { MobileActionMenu } from "@ui/mobile/action-menu-mobile/action-menu-mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { InspectionListItem } from "../../models/inspection.model";

@Component({
  selector: "app-lista-inspecciones-mobile",
  templateUrl: "./lista-inspecciones-mobile.html",
  styleUrls: ["../lista-inspecciones.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonMobile,
    FormsModule,
    LuxInputSelectSignal,
    DataViewMobile,
    MobileActionMenu,
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
  applyFilters = output<void>();
  clearFilters = output<void>();
}
