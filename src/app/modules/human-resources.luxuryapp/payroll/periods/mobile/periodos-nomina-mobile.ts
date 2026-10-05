import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelDelete } from "@ui/buttons/web-label/button-delete";
import { WebButtonLabelEdit } from "@ui/buttons/web-label/button-edit";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { PeriodoNominaDTO } from "../../interfaces/periodo-nomina.interface";

@Component({
  selector: "app-periodos-nomina-mobile",
  templateUrl: "./periodos-nomina-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    AppIcon,
    MobileListItem,
    LxTag,
    WebButtonLabelEdit,
    WebButtonLabelDelete,
    DataViewMobile,
  ],
})
export class PeriodosNominaMobile {
  data = input.required<PeriodoNominaDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  edit = output<PeriodoNominaDTO>();
  delete = output<PeriodoNominaDTO>();

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Abierto: "success",
      EnProceso: "info",
      Cerrado: "secondary",
    };
    return map[estado] ?? "secondary";
  }
}
