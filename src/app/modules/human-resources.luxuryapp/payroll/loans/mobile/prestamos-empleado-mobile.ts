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
import { PrestamoEmpleadoDTO } from "../../interfaces/prestamo-empleado.interface";

@Component({
  selector: "app-prestamos-empleado-mobile",
  templateUrl: "./prestamos-empleado-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, 
    CommonModule,
    MobileListItem,
    LxTag,
    DataViewMobile],
})
export class PrestamosEmpleadoMobile {
  data = input.required<PrestamoEmpleadoDTO[]>();
  globalFilterFields = input<string[]>([]);

  add = output<void>();
  view = output<PrestamoEmpleadoDTO>();
  delete = output<PrestamoEmpleadoDTO>();

  getEstadoSeverity(estado: string): string {
    const map: Record<string, string> = {
      Pendiente: "warn",
      Autorizado: "success",
      Cancelado: "danger",
      Liquidado: "secondary",
    };
    return map[estado] ?? "secondary";
  }

  getProgreso(item: PrestamoEmpleadoDTO): number {
    if (item.numeroPagos === 0) return 0;
    return Math.round((item.pagosRealizados / item.numeroPagos) * 100);
  }
}
