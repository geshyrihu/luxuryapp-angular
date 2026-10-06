import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { globalFilterFields } from "@core/helpers/table-options";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { PlatformService } from "@core/services/platform.service";
import { CalendarioMaestroEquipoForm } from "./calendario-maestro-equipo-form";
import { CalendarioMaestroEquipoDesktop } from "./desktop/calendario-maestro-equipo-desktop";
import { CalendarioMaestroEquipoMobile } from "./mobile/calendario-maestro-equipo-mobile";

import { ConfirmService } from "@ui/buttons/shared/confirm.service";

@Component({
  selector: "app-calendario-maestro-equipo",
  templateUrl: "./calendario-maestro-equipo.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CalendarioMaestroEquipoDesktop, CalendarioMaestroEquipoMobile],
})
export class CalendarioMaestroEquipo implements OnInit {
  apiResponseS = inject(ApiResponseService);
  confirmS = inject(ConfirmService);
  dialogHandlerS = inject(DialogHandlerService);
  platformS = inject(PlatformService);
  dataSignal = signal<any[]>([]);

  readonly globalFilterFields = computed(() =>
    globalFilterFields(this.dataSignal()),
  );
  loading = signal(true);
  ref: DynamicDialogRef;

  ngOnInit(): void {
    this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetList(Endpoints.CalendarioMaestroEquipo.base)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }
  async onDelete(id: any) {
    const confirmed = await this.confirmS.confirm(
      "¿Está seguro de eliminar este registro?",
    );
    if (!confirmed) return;
    this.apiResponseS
      .onDelete(Endpoints.CalendarioMaestroEquipo.delete(id))
      .then((result: boolean) => {
        if (result)
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
      });
  }

  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        CalendarioMaestroEquipoForm,
        data,
        data.title,
        this.dialogHandlerS.sizeXl,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}
