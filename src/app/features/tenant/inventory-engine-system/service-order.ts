import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { ConfirmationService } from "primeng/api";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { EditorModule } from "primeng/editor";
import { TooltipModule } from "primeng/tooltip";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { MantenimientoPreventivoForm } from "src/app/features/tenant/calendar/mantenimiento-preventivo/mantenimiento-preventivo-form";
@Component({
  selector: "app-service-order",
  templateUrl: "./service-order.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorModule,
    TooltipModule,
    CustomButton,
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
    const urlApi = `MaintenanceCalendars/ListService/${this.idMachinery}`;
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
      message: "Ã³Desea Eliminar este registro?",
      icon: "mdi:alert",
      accept: () => {
        //confirm action

        const urlApi = `MaintenanceCalendars/${Id}`;
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

