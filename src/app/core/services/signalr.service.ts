import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";
import { BudgetProposalItemDTO } from "src/app/apps/contabilidad.luxuryapp/general-ledger/contabilidad/presupuesto-propuesta/interfaces/budget-proposal.model";
import { ConsoleLoggerService } from "src/app/core/services/console-logger.service";
import { PanicAlertRealTimeDto } from "src/app/apps/operations.luxuryapp/panic-alert/interfaces/panic-alert-real-time.dto";
import { environment } from "src/environments/environment";
import { AuthService } from "../auth/services/auth.service";
export interface GoogleCalendarEventRealTimeUpdateDto {
  customerId: string;
  eventId: string | null;
  recurrenceSeriesId: string | null;
  action: string;
  isRecurring: boolean;
  timestampUtc: string;
}

export interface NativeCollectionRealTimeUpdateDto {
  customerId: string;
  propertyId: string | null;
  chargeId: string | null;
  paymentId: string | null;
  allocationId: string | null;
  eventType: string;
  action: string;
  description: string | null;
  occurredAtUtc: string;
}

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  private authService = inject(AuthService);
  private consoleLogger = inject(ConsoleLoggerService);

  private hubConnection!: signalR.HubConnection;
  private joinedGroups = new Set<string>();

  private connectionStateSignal: WritableSignal<boolean> = signal(false);
  public connectionState = this.connectionStateSignal.asReadonly();

  private connectionIdSignal: WritableSignal<string | null> = signal(null);
  public connectionId = this.connectionIdSignal.asReadonly();

  private connectedUserSignal: WritableSignal<string | null> = signal(null);
  public connectedUser = this.connectedUserSignal.asReadonly();

  private messageReceivedSource = new Subject<any>();
  public messageReceived$ = this.messageReceivedSource.asObservable();

  private budgetProposalItemUpdateSource = new Subject<BudgetProposalItemDTO>();
  public budgetProposalItemUpdate$ =
    this.budgetProposalItemUpdateSource.asObservable();

  private projectedExpenseUpdateSource = new Subject<any>();
  public projectedExpenseUpdate$ =
    this.projectedExpenseUpdateSource.asObservable();

  private googleCalendarEventUpdateSource =
    new Subject<GoogleCalendarEventRealTimeUpdateDto>();
  public googleCalendarEventUpdate$ =
    this.googleCalendarEventUpdateSource.asObservable();

  private nativeCollectionUpdateSource =
    new Subject<NativeCollectionRealTimeUpdateDto>();
  public nativeCollectionUpdate$ =
    this.nativeCollectionUpdateSource.asObservable();

  private panicAlertReceivedSource = new Subject<PanicAlertRealTimeDto>();
  public panicAlertReceived$ = this.panicAlertReceivedSource.asObservable();

  private panicAlertAttendedSource = new Subject<PanicAlertRealTimeDto>();
  public panicAlertAttended$ = this.panicAlertAttendedSource.asObservable();

  public start(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.consoleLogger.custom(
        "LINK",
        "orange",
        "[SignalR] Se intento iniciar una conexion ya existente.",
      );
      return;
    }

    this.consoleLogger.custom(
      "LINK",
      "blue",
      "[SignalR] Construyendo conexion...",
    );

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_SIGNALR}`, {
        accessTokenFactory: () => this.authService.getToken() as string,
        headers: { "X-Connection-Id": this.connectionId() || "" },
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([2000, 5000, 10000, 20000, null])
      .build();

    this.addConnectionLifecycleListeners();
    this.registerListeners();

    this.consoleLogger.custom(
      "LINK",
      "blue",
      "[SignalR] Iniciando conexion...",
    );
    this.hubConnection
      .start()
      .then(() => {
        this.consoleLogger.custom(
          "LINK",
          "green",
          "[SignalR] Conexion iniciada con exito.",
        );

        this.connectionStateSignal.set(true);
        this.connectionIdSignal.set(this.hubConnection.connectionId);

        this.consoleLogger.custom(
          "STATE",
          "green",
          `[SignalR] connectionId = '${this.hubConnection.connectionId}'`,
        );

        void this.rejoinGroups();
      })
      .catch((err) => {
        this.consoleLogger.custom(
          "ERROR",
          "red",
          "[SignalR] Error iniciando conexion:",
          err,
        );
        this.connectionStateSignal.set(false);
      });
  }

  public stop(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.hubConnection
        .stop()
        .then(() => {
          this.consoleLogger.custom(
            "STOP",
            "red",
            "[SignalR] Conexion detenida limpiamente.",
          );

          this.connectionStateSignal.set(false);
          this.connectionIdSignal.set(null);
          this.connectedUserSignal.set(null);
          this.joinedGroups.clear();
        })
        .catch((err) =>
          this.consoleLogger.error(
            "Error al detener la conexion SignalR:",
            err,
          ),
        );
    }
  }

  public async joinProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    await this.joinGroup(`proposal-${customerId}-${fiscalYear}`);
  }

  public async leaveProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    await this.leaveGroup(`proposal-${customerId}-${fiscalYear}`);
  }

  public async joinNativeCollectionGroup(customerId: string): Promise<void> {
    await this.joinGroup(`native-collection-${customerId}`);
  }

  public async leaveNativeCollectionGroup(customerId: string): Promise<void> {
    await this.leaveGroup(`native-collection-${customerId}`);
  }

  public async joinNativeCollectionPropertyGroup(
    propertyId: string,
  ): Promise<void> {
    await this.joinGroup(`native-collection-property-${propertyId}`);
  }

  public async leaveNativeCollectionPropertyGroup(
    propertyId: string,
  ): Promise<void> {
    await this.leaveGroup(`native-collection-property-${propertyId}`);
  }

  private async joinGroup(groupName: string): Promise<void> {
    this.joinedGroups.add(groupName);

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("JoinGroup", groupName);
        this.consoleLogger.custom(
          "JOIN",
          "blue",
          `[SignalR] Unido al grupo: ${groupName}`,
        );
      } catch (err) {
        this.consoleLogger.error(`Error al unirse al grupo ${groupName}:`, err);
      }
    } else {
      this.consoleLogger.warn(
        `Grupo ${groupName} en espera. Se unira al conectar.`,
      );
    }
  }

  private async leaveGroup(groupName: string): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("LeaveGroup", groupName);
        this.joinedGroups.delete(groupName);
        this.consoleLogger.custom(
          "LEAVE",
          "blue",
          `[SignalR] Abandonado el grupo: ${groupName}`,
        );
      } catch (err) {
        this.consoleLogger.error(
          `Error al abandonar el grupo ${groupName}:`,
          err,
        );
      }
    } else {
      this.joinedGroups.delete(groupName);
      this.consoleLogger.warn(
        `No se pudo abandonar el grupo ${groupName}. Conexion no establecida.`,
      );
    }
  }

  private registerListeners(): void {
    this.consoleLogger.custom(
      "HEADSET",
      "cyan",
      "[SignalR] Registrando listeners...",
    );

    this.hubConnection.on("ConnectedUser", (message: string) => {
      this.consoleLogger.custom(
        "USER",
        "blue",
        "[SignalR] Evento ConnectedUser recibido:",
        message,
      );
      this.connectedUserSignal.set(message);
    });

    this.hubConnection.on("ReceiveNotification", (payload: any) => {
      this.consoleLogger.custom(
        "MAIL",
        "purple",
        "[SignalR] Notificacion recibida:",
        payload,
      );
      this.messageReceivedSource.next(payload);
    });

    this.hubConnection.on(
      "ReceiveBudgetProposalItemUpdate",
      (itemDTO: BudgetProposalItemDTO) => {
        this.consoleLogger.custom(
          "REFRESH",
          "green",
          "[SignalR] Update de Item recibido:",
          itemDTO,
        );
        this.budgetProposalItemUpdateSource.next(itemDTO);
      },
    );

    this.hubConnection.on("ReceiveProjectedExpenseUpdate", (payload: any) => {
      this.consoleLogger.custom(
        "CHART",
        "blue",
        "[SignalR] Update de Gasto Proyectado recibido:",
        payload,
      );
      this.projectedExpenseUpdateSource.next(payload);
    });

    this.hubConnection.on(
      "ReceiveGoogleCalendarEventUpdate",
      (payload: GoogleCalendarEventRealTimeUpdateDto) => {
        this.consoleLogger.custom(
          "CAL",
          "dodgerblue",
          "[SignalR] Update de Google Calendar recibido:",
          payload,
        );
        this.googleCalendarEventUpdateSource.next(payload);
      },
    );

    this.hubConnection.on(
      "ReceiveNativeCollectionUpdate",
      (payload: NativeCollectionRealTimeUpdateDto) => {
        this.consoleLogger.custom(
          "MONEY",
          "teal",
          "[SignalR] Update de Cobranza Nativa recibido:",
          payload,
        );
        this.nativeCollectionUpdateSource.next(payload);
      },
    );

    this.hubConnection.on(
      "ReceivePanicAlert",
      (payload: PanicAlertRealTimeDto) => {
        this.consoleLogger.custom(
          "ALERT",
          "red",
          "[SignalR] Alerta de pánico recibida:",
          payload,
        );
        this.panicAlertReceivedSource.next(payload);
      },
    );

    this.hubConnection.on(
      "ReceivePanicAlertAttended",
      (payload: PanicAlertRealTimeDto) => {
        this.consoleLogger.custom(
          "ALERT",
          "green",
          "[SignalR] Alerta de pánico atendida:",
          payload,
        );
        this.panicAlertAttendedSource.next(payload);
      },
    );
  }

  private addConnectionLifecycleListeners(): void {
    this.hubConnection.onreconnecting((error) => {
      this.consoleLogger.custom(
        "WAIT",
        "orange",
        "[SignalR] Reintentando...",
        error,
      );
      this.connectionStateSignal.set(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      this.consoleLogger.custom(
        "OK",
        "green",
        "[SignalR] Reconectado. ID:",
        connectionId,
      );
      this.connectionStateSignal.set(true);
      this.connectionIdSignal.set(connectionId);
      void this.rejoinGroups();
    });

    this.hubConnection.onclose((error) => {
      this.consoleLogger.custom(
        "LINK",
        "red",
        "[SignalR] Conexion cerrada:",
        error,
      );

      this.connectionStateSignal.set(false);
      this.connectionIdSignal.set(null);
      this.connectedUserSignal.set(null);
    });
  }

  private async rejoinGroups(): Promise<void> {
    for (const groupName of this.joinedGroups) {
      try {
        await this.hubConnection.invoke("JoinGroup", groupName);
        this.consoleLogger.custom(
          "SYNC",
          "blue",
          `[SignalR] Reingreso al grupo: ${groupName}`,
        );
      } catch (err) {
        this.consoleLogger.error(
          `Error al reingresar al grupo ${groupName}:`,
          err,
        );
      }
    }
  }
}
