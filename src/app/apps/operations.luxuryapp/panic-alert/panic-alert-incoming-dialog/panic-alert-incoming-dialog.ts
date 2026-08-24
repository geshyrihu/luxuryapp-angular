import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { SignalRService } from "src/app/core/services/signalr.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PanicAlertRealTimeDto } from "../interfaces/panic-alert-real-time.dto";

const RECIPIENT_ROLES: ApplicationRole[] = [
  ApplicationRole.Administrador,
  ApplicationRole.GerenteOperaciones,
  ApplicationRole.GerenteAtencion,
  ApplicationRole.Asistente,
];

@Component({
  selector: "app-panic-alert-incoming-dialog",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (activeAlert()) {
      <div class="panic-overlay" (click)="$event.stopPropagation()">
        <div class="panic-dialog">
          <div class="panic-dialog__header">
            <app-icon icon="material-symbols-light:error" class="panic-dialog__icon" />
            <span class="panic-dialog__title">Alerta de Pánico</span>
          </div>

          <div class="panic-dialog__body">
            <p class="panic-dialog__name">
              {{ activeAlert()!.triggeredByName }}
            </p>
            <p class="panic-dialog__time">
              {{ formatTime(activeAlert()!.createdAt) }}
            </p>

            @if (activeAlert()!.message) {
              <p class="panic-dialog__message">{{ activeAlert()!.message }}</p>
            }

            @if (activeAlert()!.latitude && activeAlert()!.longitude) {
              <a
                class="panic-dialog__map-link"
                [href]="getMapUrl(activeAlert()!)"
                target="_blank"
                rel="noopener noreferrer"
              >
                <app-icon icon="material-symbols-light:location-on" class="text-sm" />
                Ver ubicación en mapa
              </a>
            }
          </div>

          <div class="panic-dialog__actions">
            <button
              type="button"
              class="panic-dialog__btn panic-dialog__btn--attend"
              (click)="onAttend()"
              [disabled]="isProcessing()"
            >
              <app-icon icon="material-symbols-light:check-circle" />
              Atender
            </button>
            <button
              type="button"
              class="panic-dialog__btn panic-dialog__btn--close"
              (click)="onClose()"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <!-- Sonido de alerta -->
      <audio
        #alertAudio
        src="assets/sounds/panic-alert.mp3"
        loop
        preload="auto"
      ></audio>
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .panic-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .panic-dialog {
      background: var(--ds-bg-card, #fff);
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 8px 32px rgba(220, 38, 38, 0.3);
      animation: slideIn 0.3s ease-out;
    }

    .panic-dialog__header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #dc2626;
    }

    .panic-dialog__icon {
      font-size: 32px;
      color: #dc2626;
      animation: pulse 1s infinite;
    }

    .panic-dialog__title {
      font-size: 18px;
      font-weight: 700;
      color: #dc2626;
    }

    .panic-dialog__body {
      margin-bottom: 20px;
    }

    .panic-dialog__name {
      font-size: 16px;
      font-weight: 600;
      margin: 0 0 4px;
    }

    .panic-dialog__time {
      font-size: 13px;
      color: var(--ds-text-secondary, #6b7280);
      margin: 0 0 12px;
    }

    .panic-dialog__message {
      font-size: 14px;
      color: var(--ds-text-secondary, #374151);
      margin: 0 0 12px;
      font-style: italic;
    }

    .panic-dialog__map-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #2563eb;
      font-size: 13px;
      text-decoration: none;
      margin-top: 8px;
    }

    .panic-dialog__map-link:hover {
      text-decoration: underline;
    }

    .panic-dialog__actions {
      display: flex;
      gap: 12px;
    }

    .panic-dialog__btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: opacity 0.15s;
    }

    .panic-dialog__btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .panic-dialog__btn--attend {
      background: #dc2626;
      color: white;
    }

    .panic-dialog__btn--attend:hover:not(:disabled) {
      background: #b91c1c;
    }

    .panic-dialog__btn--close {
      background: var(--ds-bg-secondary, #f3f4f6);
      color: var(--ds-text-primary, #374151);
    }

    .panic-dialog__btn--close:hover {
      background: var(--ds-bg-tertiary, #e5e7eb);
    }

    @keyframes slideIn {
      from {
        transform: translateY(-20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
})
export class PanicAlertIncomingDialog implements OnInit {
  private signalRService = inject(SignalRService);
  private aspRoleS = inject(AspRoleService);
  private apiResponseS = inject(ApiResponseService);
  private customToastS = inject(CustomToastService);
  private destroyRef = inject(DestroyRef);

  activeAlert = signal<PanicAlertRealTimeDto | null>(null);
  isProcessing = signal(false);

  private alertAudio: HTMLAudioElement | null = null;

  ngOnInit(): void {
    // Aviso al emisor cuando alguien atiende su alerta (el servidor solo
    // envía este evento al usuario que la disparó, sin filtro de rol)
    this.signalRService.panicAlertAttended$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alert) => {
        this.customToastS.showInfo(
          "Tu alerta está siendo atendida",
          `${alert.triggeredByName} está atendiendo tu alerta de pánico`,
        );
      });

    // Solo escuchar si el usuario tiene rol receptor
    if (!this.aspRoleS.canAccessAny(RECIPIENT_ROLES)) return;

    this.signalRService.panicAlertReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((alert) => {
        this.activeAlert.set(alert);
        this.playSound();
      });
  }

  async onAttend(): Promise<void> {
    const alert = this.activeAlert();
    if (!alert) return;

    this.isProcessing.set(true);
    try {
      await this.apiResponseS.onPut(
        Endpoints.PanicAlerts.attend(alert.id),
        null,
      );
      this.onClose();
    } finally {
      this.isProcessing.set(false);
    }
  }

  onClose(): void {
    this.stopSound();
    this.activeAlert.set(null);
  }

  getMapUrl(alert: PanicAlertRealTimeDto): string {
    return `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;
  }

  formatTime(isoDate: string): string {
    return new Date(isoDate).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  private playSound(): void {
    try {
      if (!this.alertAudio) {
        this.alertAudio = new Audio("assets/sounds/panic-alert.mp3");
        this.alertAudio.loop = true;
      }
      this.alertAudio.currentTime = 0;
      this.alertAudio.play().catch(() => {
        // Autoplay blocked — degrade silently
      });
    } catch {
      // Audio not available
    }
  }

  private stopSound(): void {
    if (this.alertAudio) {
      this.alertAudio.pause();
      this.alertAudio.currentTime = 0;
    }
  }
}
