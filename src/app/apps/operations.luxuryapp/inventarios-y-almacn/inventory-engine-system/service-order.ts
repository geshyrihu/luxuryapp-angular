import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxEditor } from "@ui/adaptive/editor/editor";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { ConfirmationService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MantenimientoPreventivoForm } from "src/app/apps/operations.luxuryapp/google-calendar/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";

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
  public confirmationService = inject(ConfirmationService);

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
      Endpoints.RefactorOperations.maintenanceCalendarsListServiceById(
        this.idMachinery,
      );
    this.apiResponseS.onGetList(urlApi).then((result: any) => {
      this.maintenanceCalendars = result.map((item: any) => ({
        ...item,
        activityControl: new FormControl(item.activity),
      }));
    });
  }

  confirm(event: Event, Id: any) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "óDesea Eliminar este registro?",
      icon: "mdi:alert",
      accept: () => {
        //confirm action

        const urlApi =
          Endpoints.RefactorOperations.maintenanceCalendarsById(Id);
        this.apiResponseS.onDelete(urlApi).then((result: boolean) => {
          this.onLoadData();
        });
      },
      reject: () => {
        //reject action
      },
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
