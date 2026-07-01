import { Component, inject, OnInit, signal } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
} from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import {
  addCircleOutline,
  alertCircleOutline,
  arrowBackOutline,
  calendarOutline,
  chatbubblesOutline,
  checkmarkCircleOutline,
  createOutline,
  lockClosedOutline,
  lockOpenOutline,
  syncOutline,
  timeOutline,
} from "ionicons/icons";
import { AvatarModule } from "primeng/avatar";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { CustomButton } from "src/app/core/components/web/buttons";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import Swal from "sweetalert2";
import { TaskClose } from "../../components/task-close";
import { TaskProgram } from "../../components/task-program";
import { TaskReopen } from "../../components/task-reopen";
import { TaskFollowup } from "../../task-follow-up/pages/task-followup";
import { TaskForm } from "./task-form";
@Component({
  selector: "app-task-view",
  templateUrl: "./task-view.html",
  imports: [
    CardModule,
    AvatarModule,
    CustomButton,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel,
    IonAvatar,
    IonBadge,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonList,
    AppIcon,
  ],
})
export class TaskView implements OnInit {
  apiResponseS = inject(ApiResponseService);
  authS = inject(AuthService);
  customerIdS = inject(CustomerIdService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  dialogHandlerS = inject(DialogHandlerService);
  config = inject(DynamicDialogConfig, { optional: true });
  id: string = "";
  ticketGroupId: string = "";
  submitting = signal(false);
  notTicket = signal(false);

  ticket = signal<any>(null);

  applicationUserId: string = this.authS.applicationUserId;
  NotificationsId: string = "";

  constructor() {
    addIcons({
      addCircleOutline,
      alertCircleOutline,
      arrowBackOutline,
      calendarOutline,
      chatbubblesOutline,
      checkmarkCircleOutline,
      createOutline,
      lockClosedOutline,
      lockOpenOutline,
      syncOutline,
      timeOutline,
    });
  }

  async ngOnInit() {
    if (this.config?.data) {
      this.id = this.config.data.id;
      this.ticketGroupId = this.config.data.ticketGroupId;
      this.onLoadData();
    } else {
      // Obtener el ticketId de los parámetros de la ruta
      this.route.params.subscribe((params) => {
        this.id = params["ticketMessageId"];
        this.ticketGroupId = params["ticketGroupId"];
        if (this.id) this.onLoadData();
      });
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.view(this.id))
      .then((response: any) => {
        // Manejo del Error NG0100 (ExpressionChanged) - Ver GEMINI.md §3.12
        setTimeout(() => {
          this.ticket.set(response);
          if (response === null) {
            this.notTicket.set(true);
          }
        }, 0);
      })
      .catch((error: any) => {
        console.error("Error loading ticket data:", error);
      });
  }
  onModalForm(data: any) {
    this.dialogHandlerS
      .openDialog(
        TaskForm,
        { id: data.id, ticketGroupId: this.ticketGroupId },
        data.title,
        this.dialogHandlerS.sizeLg,
      )
      .then(() => {
        this.onLoadData();
      });
  }

  onFollowUp(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskFollowup,
        { id: id },
        "Seguimiento",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onProgram(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskProgram,
        { id: id, ticketGroupId: this.ticketGroupId },
        "Programar actividad",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onClosed(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskClose,
        { id: id },
        "Cerrar ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onReopen(id: string) {
    this.dialogHandlerS
      .openDialog(
        TaskReopen,
        { id: id },
        "Re abrir ticket",
        this.dialogHandlerS.sizeLg,
      )
      .then((responseData: boolean) => {
        if (responseData) this.onLoadData();
      });
  }

  onProgress(id: string) {
    Swal.fire({
      title: "Confirmar",
      text: "Se colocará el ticket en proceso",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0d3b66",
      cancelButtonColor: "#9B1B30",
      confirmButtonText: "Sí, en proceso!",
      cancelButtonText: "Cancelar",
    }).then((responseData) => {
      if (responseData.value) {
        this.apiResponseS
          .onGetItem(
            Endpoints.Tasks.inProgressLower(id, this.authS.applicationUserId),
          )
          .then(() => {
            this.onLoadData();
          });
      }
    });
  }

  goBack() {
    this.router.navigate(["/Tasks/messages", this.ticketGroupId]);
  }
}

