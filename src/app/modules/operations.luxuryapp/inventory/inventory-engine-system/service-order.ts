import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxEditor } from "@ui/adaptive/editor/editor";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { DynamicDialogConfig, DynamicDialogRef } from "@core/services/dialog-handler.service";
import { MantenimientoPreventivoForm } from "@operations.luxuryapp/google-calendar/calendar/preventive-maintenance/mantenimiento-preventivo-form";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import { DialogHandlerService } from "@core/services/dialog-handler.service";

@Component({
  selector: "app-service-order",
  templateUrl: "./service-order.html",
  imports: [
    WebButtonIcon,
    CommonModule,
    ReactiveFormsModule,
    LxEditor,
    LxTooltipDirective,
    WebButtonLabel,
  ],
})
export class ServiceOrder implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);
  dialogHandlerService = inject(DialogHandlerService);
  authS = inject(AuthService);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  confirmS = inject(ConfirmService);

  maintenanceCalendars: any[] = [];
  idMachinery: number = 0;

  public editorConfig = {
    readOnly: true, // Opciones del editor, incluyendo readOnly
  };

  ngOnInit(): void {
    if (this.config.data) {
      this.idMachinery = this.config.data.id;
      if (this.idMachinery !== 0) {
        this.onLoadData();
      }
    }
  }

  onLoadData() {
    const urlApi =
      Endpoints.MaintenanceCalendars.listServiceByMachinery(this.idMachinery);
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.maintenanceCalendars = result.map((item: any) => ({
        ...item,
        activityControl: new FormControl(item.activity),
      }));
    });
  }

  async confirm(Id: any) {
    const ok = await this.confirmS.confirm("óDesea Eliminar este registro?");
    if (!ok) return;
    const urlApi = Endpoints.MaintenanceCalendars.delete(Id);
    this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
      this.onLoadData();
    });
  }
  showModalMaintenanceCalendar(data: any) {
    this.dialogHandlerService
      .openDialog(
        MantenimientoPreventivoForm,
        {
          id: data.id,
          task: data.task,
          idMachinery: data.idMachinery,
        },
        data.header,
        this.dialogHandlerService.sizeMd,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}


