import { ButtonWeb } from "@ui/buttons/web";
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxImage } from "@ui/adaptive/image/image";
import { LxTag } from "@ui/adaptive/tag/tag";
import { IonInputCheckbox } from "@ui/inputs/mobile/ion-input-checkbox";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { IRegistroChecador } from "../interfaces/chekador-empleados.models";

@Component({
  selector: "app-chekador-list-mobile",
  templateUrl: "./chekador-list-mobile.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonWeb, 
    LxTag,
    LxImage,
    IonInputCheckbox,
    FormsModule,
    DataViewMobile],
})
export class ChekadorListMobile {
  data = input.required<IRegistroChecador[]>();
  globalFilterFields = input<string[]>([]);
  desde = input<string>("");
  hasta = input<string>("");
  soloAnomalias = input<boolean>(false);

  desdeChange = output<string>();
  hastaChange = output<string>();
  soloAnomaliasChange = output<boolean>();
  applyFilters = output<void>();
  clearFilters = output<void>();
  approve = output<IRegistroChecador>();
  reject = output<IRegistroChecador>();

  getBadgeSeverity(
    estadoAnomalia: string | null,
  ): "success" | "danger" | "warn" | "secondary" {
    if (!estadoAnomalia) return "secondary";
    if (estadoAnomalia === "Aprobada") return "success";
    if (estadoAnomalia === "Rechazada") return "danger";
    return "warn";
  }
}
