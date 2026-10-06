import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ApiDatePipe } from "@shared/pipes/api-date.pipe";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ButtonMobile } from "@ui/buttons/mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/primitives/app-icon/app-icon";
import { IncidenciaNominaDTO } from "../../interfaces/incidencia-nomina.interface";

@Component({
  selector: "app-incidencias-nomina-mobile",
  templateUrl: "./incidencias-nomina-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ApiDatePipe,
    AppIcon,
    MobileListItem,
    LxTag,
    ButtonMobile,
    DataViewMobile,
  ],
})
export class IncidenciasNominaMobile {
  data = input.required<IncidenciaNominaDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  delete = output<IncidenciaNominaDTO>();

  getTipoSeverity(tipo: number): string {
    const map: Record<number, string> = {
      0: "danger",
      1: "warn",
      2: "warn",
      3: "info",
      4: "success",
      5: "secondary",
      6: "contrast",
      7: "secondary",
      8: "danger",
    };
    return map[tipo] ?? "secondary";
  }
}
