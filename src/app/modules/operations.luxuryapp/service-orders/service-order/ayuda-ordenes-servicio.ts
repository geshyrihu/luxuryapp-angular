import { ChangeDetectionStrategy, Component } from "@angular/core";
import { AppIcon } from "@ui/shared/app-icon/app-icon";

@Component({
  selector: "app-ayuda-ordenes-servicio",
  templateUrl: "./ayuda-ordenes-servicio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon],
})
export class AyudaOrdenesServicio {}
