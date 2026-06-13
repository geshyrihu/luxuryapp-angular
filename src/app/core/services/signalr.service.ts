import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";
import { BudgetProposalItemDTO } from "src/app/features/tenant/contabilidad/presupuesto-propuesta/models/budget-proposal.model";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { ConsoleLoggerService } from "./console-logger.service";

export interface GoogleCalendarEventRealTimeUpdateDTO {
  customerId: string;
  eventId: string | null;
  recurrenceSeriesId: string | null;
  action: string;
  isRecurring: boolean;
  timestampUtc: string;
}

@Injectable({
  providedIn: "root",
})
export class SignalRService {
  private authService = inject(AuthService);
  private consoleLogger = inject(ConsoleLoggerService);

  private hubConnection!: signalR.HubConnection;

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
    new Subject<GoogleCalendarEventRealTimeUpdateDTO>();
  public googleCalendarEventUpdate$ =
    this.googleCalendarEventUpdateSource.asObservable();

  public start(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.consoleLogger.custom(
        "ðŸ”Œ",
        "orange",
        "[SignalR] Se intentó iniciar una conexión ya existente.",
      );
      return;
    }

    this.consoleLogger.custom(
      "ðŸ”Œ",
      "blue",
      "[SignalR] Construyendo conexión...",
    );

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_SIGNALR}`, {
        accessTokenFactory: () => this.authService.getToken() as string,
        headers: { "X-Connection-Id": this.connectionId() || "" },
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect([2000, 5000, 10000, 20000, null])
      .build();

    this.consoleLogger.custom("ðŸ”Œ", "blue", "[SignalR] Iniciando conexión...");
    this.hubConnection
      .start()
      .then(() => {
        this.consoleLogger.custom(
          "ðŸ”Œ",
          "green",
          "[SignalR] Conexión iniciada con éxito.",
        );

        this.connectionStateSignal.set(true);
        this.connectionIdSignal.set(this.hubConnection.connectionId);

        this.consoleLogger.custom(
          "STATE",
          "green",
          `[SignalR] connectionId = '${this.hubConnection.connectionId}'`,
        );

        this.registerListeners();
      })
      .catch((err) => {
        this.consoleLogger.custom(
          "âŒ",
          "red",
          "[SignalR] Error iniciando conexión:",
          err,
        );
        this.connectionStateSignal.set(false);
      });

    this.addConnectionLifecycleListeners();
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
            "ðŸ›‘",
            "red",
            "[SignalR] Conexión detenida limpiamente.",
          );

          this.connectionStateSignal.set(false);
          this.connectionIdSignal.set(null);
          this.connectedUserSignal.set(null);
        })
        .catch((err) =>
          this.consoleLogger.error(
            "Error al detener la conexión SignalR:",
            err,
          ),
        );
    }
  }

  public async joinProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    const groupName = `proposal-${customerId}-${fiscalYear}`;

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("JoinGroup", groupName);
        this.consoleLogger.custom(
          "ðŸ¤",
          "blue",
          `[SignalR] Unido al grupo: ${groupName}`,
        );
      } catch (err) {
        this.consoleLogger.error(`Error al unirse al grupo ${groupName}:`, err);
      }
    } else {
      this.consoleLogger.warn(
        `No se pudo unir al grupo ${groupName}. Conexión no establecida.`,
      );
    }
  }

  public async leaveProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    const groupName = `proposal-${customerId}-${fiscalYear}`;

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("LeaveGroup", groupName);
        this.consoleLogger.custom(
          "ðŸ‘‹",
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
      this.consoleLogger.warn(
        `No se pudo abandonar el grupo ${groupName}. Conexión no establecida.`,
      );
    }
  }

  private registerListeners(): void {
    this.consoleLogger.custom(
      "ðŸŽ§",
      "cyan",
      "[SignalR] Registrando listeners...",
    );

    this.hubConnection.on("ConnectedUser", (mensaje: string) => {
      this.consoleLogger.custom(
        "ðŸ‘¤",
        "blue",
        "[SignalR] Evento ConnectedUser recibido:",
        mensaje,
      );
      this.connectedUserSignal.set(mensaje);
    });

    this.hubConnection.on("ReceiveNotification", (payload: any) => {
      this.consoleLogger.custom(
        "ðŸ“¨",
        "purple",
        "[SignalR] Notificación recibida:",
        payload,
      );
      this.messageReceivedSource.next(payload);
    });

    this.hubConnection.on(
      "ReceiveBudgetProposalItemUpdate",
      (itemDTO: BudgetProposalItemDTO) => {
        this.consoleLogger.custom(
          "ðŸ”„",
          "green",
          "[SignalR] Update de Item recibido:",
          itemDTO,
        );
        this.budgetProposalItemUpdateSource.next(itemDTO);
      },
    );

    this.hubConnection.on("ReceiveProjectedExpenseUpdate", (payload: any) => {
      this.consoleLogger.custom(
        "ðŸ“Š",
        "blue",
        "[SignalR] Update de Gasto Proyectado recibido:",
        payload,
      );
      this.projectedExpenseUpdateSource.next(payload);
    });

    this.hubConnection.on(
      "ReceiveGoogleCalendarEventUpdate",
      (payload: GoogleCalendarEventRealTimeUpdateDTO) => {
        this.consoleLogger.custom(
          "ðŸ“…",
          "dodgerblue",
          "[SignalR] Update de Google Calendar recibido:",
          payload,
        );
        this.googleCalendarEventUpdateSource.next(payload);
      },
    );
  }

  private addConnectionLifecycleListeners(): void {
    this.hubConnection.onreconnecting((error) => {
      this.consoleLogger.custom(
        "â³",
        "orange",
        "[SignalR] Reintentando...",
        error,
      );
      this.connectionStateSignal.set(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      this.consoleLogger.custom(
        "âœ…",
        "green",
        "[SignalR] Reconectado. ID:",
        connectionId,
      );
      this.connectionStateSignal.set(true);
      this.connectionIdSignal.set(connectionId);
    });

    this.hubConnection.onclose((error) => {
      this.consoleLogger.custom(
        "ðŸ”Œ",
        "red",
        "[SignalR] Conexión cerrada:",
        error,
      );

      this.connectionStateSignal.set(false);
      this.connectionIdSignal.set(null);
      this.connectedUserSignal.set(null);
    });
  }
}

