import { ChangeDetectionStrategy, Component } from "@angular/core";
import { LxIcon } from "@ui/adaptive/icon/icon";

@Component({
  selector: "app-ayuda-ordenes-servicio",
  templateUrl: "./ayuda-ordenes-servicio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxIcon],
})
export class AyudaOrdenesServicio {}
