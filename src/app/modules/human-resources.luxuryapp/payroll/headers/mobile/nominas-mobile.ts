import { ButtonWeb } from "@ui/buttons/web";
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { NominaEncabezadoDTO } from "../../interfaces/nomina-encabezado.interface";

@Component({
  selector: "app-nominas-mobile",
  templateUrl: "./nominas-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, 
    CommonModule,
    MobileListItem,
    LxTag,
    DataViewMobile],
})
export class NominasMobile {
  data = input.required<NominaEncabezadoDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  view = output<NominaEncabezadoDTO>();

  getEstadoSeverity(estadoValue: number): string {
    const map: Record<number, string> = {
      0: "secondary",
      1: "info",
      2: "success",
      3: "contrast",
      4: "secondary",
    };
    return map[estadoValue] ?? "secondary";
  }
}
