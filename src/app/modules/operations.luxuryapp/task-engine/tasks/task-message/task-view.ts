import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { AppAvatar } from "@ui/web/avatar/avatar";
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
import { AuthService } from "@core/auth/services/auth.service";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DialogHandlerService,
  DynamicDialogConfig,
} from "@core/services/dialog-handler.service";
import { ROUTES } from "src/app/routing/route-paths";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import Swal from "sweetalert2";
import { TaskClose } from "../task-close";
import { TaskFollowup } from "../task-follow-up/task-followup";
import { TaskProgram } from "../task-program";
import { TaskReopen } from "../task-reopen";
import { TaskChecklistPanel } from "./task-checklist-panel/task-checklist-panel";
import { TaskForm } from "./task-form";
import { TaskJustificationPanel } from "./task-justification-panel/task-justification-panel";
import {
  TaskAdditionalImage,
  TaskFollowUpEvidenceImage,
  TaskFollowUpItem,
  TaskResponsible,
} from "../shared/interfaces/task-refactor.interface";
@Component({
  selector: "app-task-view",
  templateUrl: "./task-view.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    LxTag,
    AppAvatar,
    WebButtonLabel,
    AppIcon,
    TaskChecklistPanel,
    TaskJustificationPanel,
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
  responsibles = signal<TaskResponsible[]>([]);
  additionalImages = signal<TaskAdditionalImage[]>([]);
  followUps = signal<TaskFollowUpItem[]>([]);
  evidenceImages = signal<Record<string, TaskFollowUpEvidenceImage[]>>({});

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
      // Obtener el ticketId de los parómetros de la ruta
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
        // Manejo del Error NG0100 (ExpressionChanged) - Ver GEMINI.md ó3.12
        setTimeout(() => {
          this.ticket.set(response);
          if (response === null) {
            this.notTicket.set(true);
            return;
          }
          this.loadCollections();
        }, 0);
      })
      .catch((error: any) => {
        console.error("Error loading ticket data:", error);
      });
  }

  private async loadCollections(): Promise<void> {
    const [responsibles, additionalImages, followUps] = await Promise.all([
      this.apiResponseS.onGetList<TaskResponsible[]>(
        Endpoints.TaskResponsibles.list(this.id),
      ),
      this.apiResponseS.onGetList<TaskAdditionalImage[]>(
        Endpoints.TaskAdditionalImages.list(this.id),
      ),
      this.apiResponseS.onGetList<TaskFollowUpItem[]>(
        Endpoints.TaskFollowUps.listByTicketMessage(this.id),
      ),
    ]);

    this.responsibles.set(responsibles ?? []);
    this.additionalImages.set(additionalImages ?? []);
    this.followUps.set(followUps ?? []);

    await Promise.all(
      (followUps ?? []).map(async (followUp) => {
        const evidence = await this.apiResponseS.onGetList<
          TaskFollowUpEvidenceImage[]
        >(Endpoints.TaskFollowUpEvidenceImages.list(followUp.id));
        this.evidenceImages.update((current) => ({
          ...current,
          [followUp.id]: evidence ?? [],
        }));
      }),
    );
  }

  hasEvidence(): boolean {
    return Object.values(this.evidenceImages()).some((images) => images.length > 0);
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
      text: "Se colocaré el ticket en proceso",
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
    this.router.navigate(ROUTES.TICKETS.MENSAJES(this.ticketGroupId));
  }
}
