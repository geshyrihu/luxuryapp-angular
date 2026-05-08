import { inject, Injectable, signal, WritableSignal } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { Subject } from "rxjs";
import { BudgetProposalItemDTO } from "src/app/features/contabilidad/presupuesto-propuesta/models/budget-proposal.model";
import { environment } from "src/environments/environment";
import { AuthService } from "./auth.service";
import { ConsoleLoggerService } from "./console-logger.service";
@Injectable({
  providedIn: "root",
})
export class SignalRService {
  // 🧩 Servicios inyectados
  private authService = inject(AuthService);
  private consoleLogger = inject(ConsoleLoggerService);

  // 🔌 Conexión principal a SignalR
  private hubConnection!: signalR.HubConnection;

  // 📡 Signal que indica si estamos conectados
  private connectionStateSignal: WritableSignal<boolean> = signal(false);
  public connectionState = this.connectionStateSignal.asReadonly();

  // 🆔 ID de conexión asignada por el servidor
  private connectionIdSignal: WritableSignal<string | null> = signal(null);
  public connectionId = this.connectionIdSignal.asReadonly();

  // 👤 Usuario conectado reportado por el Hub
  private connectedUserSignal: WritableSignal<string | null> = signal(null);
  public connectedUser = this.connectedUserSignal.asReadonly();

  // ✉️ Stream general de mensajes entrantes
  private messageReceivedSource = new Subject<any>();
  public messageReceived$ = this.messageReceivedSource.asObservable();

  // 🔄 Stream exclusivo para actualizaciones de ítems de propuesta
  private budgetProposalItemUpdateSource = new Subject<BudgetProposalItemDTO>();
  public budgetProposalItemUpdate$ =
    this.budgetProposalItemUpdateSource.asObservable();

  // 📊 Stream para actualizaciones de gastos proyectados
  private projectedExpenseUpdateSource = new Subject<any>(); // Usar un tipo específico si se crea un DTO
  public projectedExpenseUpdate$ =
    this.projectedExpenseUpdateSource.asObservable();

  // 🚀 Iniciar conexión con SignalR
  public start(): void {
    // Evitar múltiples conexiones
    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.consoleLogger.custom(
        "🔌",
        "orange",
        "[SignalR] Se intentó iniciar una conexión ya existente.",
      );
      return;
    }

    // Construcción de la conexión
    this.consoleLogger.custom(
      "🔌",
      "blue",
      "[SignalR] Construyendo conexión...",
    );

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.API_BASE_SIGNALR}`, {
        // Se envía el token JWT en cada conexión
        accessTokenFactory: () => this.authService.getToken() as string,
        // Header personalizado para enviar el ConnectionId
        headers: { "X-Connection-Id": this.connectionId() || "" },
      })
      .configureLogging(signalR.LogLevel.Information)
      // Reintentos progresivos de reconexión
      .withAutomaticReconnect([2000, 5000, 10000, 20000, null])
      .build();

    // Intento de conexión
    this.consoleLogger.custom("🔌", "blue", "[SignalR] Iniciando conexión...");
    this.hubConnection
      .start()
      .then(() => {
        this.consoleLogger.custom(
          "🔌",
          "green",
          "[SignalR] Conexión iniciada con éxito.",
        );

        // Actualizamos signals globales
        this.connectionStateSignal.set(true);
        this.connectionIdSignal.set(this.hubConnection.connectionId);

        this.consoleLogger.custom(
          "STATE",
          "green",
          `[SignalR] connectionId = '${this.hubConnection.connectionId}'`,
        );

        // 🎧 Registrar listeners de eventos del servidor
        this.registerListeners();
      })
      .catch((err) => {
        this.consoleLogger.custom(
          "❌",
          "red",
          "[SignalR] Error iniciando conexión:",
          err,
        );
        this.connectionStateSignal.set(false);
      });

    // 🔄 Listeners de ciclo de vida (reconexión, cierre, etc.)
    this.addConnectionLifecycleListeners();
  }

  // 🛑 Detener conexión de forma manual
  public stop(): void {
    if (
      this.hubConnection &&
      this.hubConnection.state !== signalR.HubConnectionState.Disconnected
    ) {
      this.hubConnection
        .stop()
        .then(() => {
          this.consoleLogger.custom(
            "🛑",
            "red",
            "[SignalR] Conexión detenida limpiamente.",
          );

          // Reset total del estado
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

  // 👥 Unirse a un grupo único para propuestas
  public async joinProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    const groupName = `proposal-${customerId}-${fiscalYear}`;

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("JoinGroup", groupName);
        this.consoleLogger.custom(
          "🤝",
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

  // 🚪 Abandonar grupo
  public async leaveProposalGroup(
    customerId: string,
    fiscalYear: number,
  ): Promise<void> {
    const groupName = `proposal-${customerId}-${fiscalYear}`;

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      try {
        await this.hubConnection.invoke("LeaveGroup", groupName);
        this.consoleLogger.custom(
          "👋",
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

  // 🎧 Registración de eventos enviados por el servidor
  private registerListeners(): void {
    this.consoleLogger.custom(
      "🎧",
      "cyan",
      "[SignalR] Registrando listeners...",
    );

    // Usuario conectado (mensaje directo del hub)
    this.hubConnection.on("ConnectedUser", (mensaje: string) => {
      this.consoleLogger.custom(
        "👤",
        "blue",
        "[SignalR] Evento ConnectedUser recibido:",
        mensaje,
      );
      this.connectedUserSignal.set(mensaje);
    });

    // Notificación general
    this.hubConnection.on("ReceiveNotification", (payload: any) => {
      this.consoleLogger.custom(
        "📨",
        "purple",
        "[SignalR] Notificación recibida:",
        payload,
      );
      this.messageReceivedSource.next(payload);
    });

    // Actualización de un ítem del presupuesto
    this.hubConnection.on(
      "ReceiveBudgetProposalItemUpdate",
      (itemDTO: BudgetProposalItemDTO) => {
        this.consoleLogger.custom(
          "🔄",
          "green",
          "[SignalR] Update de Item recibido:",
          itemDTO,
        );
        this.budgetProposalItemUpdateSource.next(itemDTO);
      },
    );

    // Actualización de un gasto proyectado
    this.hubConnection.on("ReceiveProjectedExpenseUpdate", (payload: any) => {
      this.consoleLogger.custom(
        "📊",
        "blue",
        "[SignalR] Update de Gasto Proyectado recibido:",
        payload,
      );
      this.projectedExpenseUpdateSource.next(payload);
    });
  }

  // 🔁 Listeners para eventos de reconexión, cierre, etc.
  private addConnectionLifecycleListeners(): void {
    // Intentando reconectar
    this.hubConnection.onreconnecting((error) => {
      this.consoleLogger.custom(
        "⏳",
        "orange",
        "[SignalR] Reintentando...",
        error,
      );
      this.connectionStateSignal.set(false);
    });

    // Reconexión exitosa
    this.hubConnection.onreconnected((connectionId) => {
      this.consoleLogger.custom(
        "✅",
        "green",
        "[SignalR] Reconectado. ID:",
        connectionId,
      );
      this.connectionStateSignal.set(true);
      this.connectionIdSignal.set(connectionId);
    });

    // Conexión cerrada (voluntaria o por error)
    this.hubConnection.onclose((error) => {
      this.consoleLogger.custom(
        "🔌",
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









