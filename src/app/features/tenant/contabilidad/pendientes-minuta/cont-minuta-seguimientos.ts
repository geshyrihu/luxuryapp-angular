import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonConfirm } from "src/app/core/components/buttons/web/custom-button-confirm";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { MeetingSeguimientoEdit } from "../../juntas-comite/junta-comite-minutas/meeting-seguimiento-edit";
@Component({
  selector: "app-cont-minuta-seguimientos",
  templateUrl: "./cont-minuta-seguimientos.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButton,
    CustomButtonConfirm,
    NgbTooltip,
  ],
})
export class ContMinutaSeguimientos implements OnInit {
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  dialogHandlerS = inject(DialogHandlerService);
  dataSignal = signal<any[]>([]);

  id = this.config.data.idItem;

  ngOnInit(): void {
    this.onLoadData();
  }
  onLoadData() {
    // Mostrar un mensaje de carga
    this.apiResponseS
      .onGetList(`ContabilidadMinuta/ListaSeguimientos/${this.id}`)
      .then((result: any) => {
        this.dataSignal.set(result);
      });
  }

  onDeleteSeguimiento(id: any) {
    this.apiResponseS
      .onDelete(`MeetingDertailsSeguimiento/${id}`)
      .then((result: boolean) => {
        if (result) {
          this.dataSignal.update((currentData) =>
            currentData.filter((item) => item.id !== id),
          );
        }
      });
  }
  onModalFormSeguimiento(idMeetingSeguimiento: any) {
    this.dialogHandlerS
      .openDialog(
        MeetingSeguimientoEdit,
        {
          idMeetingSeguimiento,
        },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((result: boolean) => {
        if (result) this.onLoadData();
      });
  }
}









