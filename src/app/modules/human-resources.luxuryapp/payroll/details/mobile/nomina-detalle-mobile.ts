import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { ButtonMobile } from "@ui/buttons/mobile";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { NominaDetalleDTO } from "../../interfaces/nomina-detalle.interface";

@Component({
  selector: "app-nomina-detalle-mobile",
  templateUrl: "./nomina-detalle-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MobileListItem,
    ButtonMobile,
    DataViewMobile],
})
export class NominaDetalleMobile {
  data = input.required<NominaDetalleDTO[]>();
  globalFilterFields = input<string[]>([]);

  edit = output<NominaDetalleDTO>();
}
