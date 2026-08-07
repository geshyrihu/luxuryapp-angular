import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxTag } from "@ui/adaptive/tag/tag";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { DatosServicioAddOrEdit } from "./datos-servicio-form";

@Component({
  selector: "app-calendario-maestro-readonly",
  templateUrl: "./calendario-maestro-readonly.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [AppIcon, LxTag, LxTooltipDirective],
})
export class CalendarioMaestroReadonly implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private dialogHandlerS = inject(DialogHandlerService);

  data = signal<any[]>([]);

  ngOnInit(): void {
    this.apiResponseS
      .onGetList(Endpoints.RefactorMantenimiento.calendariomaestroList)
      .then((result: any) => {
        this.data.set(Array.isArray(result) ? result : []);
      });
  }

  onVerDetalle(evento: any): void {
    this.dialogHandlerS.openDialog(
      DatosServicioAddOrEdit,
      evento,
      "Informacion de servicio",
      this.dialogHandlerS.sizeLg,
    );
  }
}
