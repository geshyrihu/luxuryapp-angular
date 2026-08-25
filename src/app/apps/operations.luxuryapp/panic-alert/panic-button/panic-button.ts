import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  viewChild,
} from "@angular/core";
import { AspRoleService } from "src/app/core/auth/services/asp-role.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { GeolocationService } from "src/app/core/services/geolocation.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { PanicAlertCreateDto } from "../interfaces/panic-alert-create.dto";
import { PanicAlertDto } from "../interfaces/panic-alert.dto";

const EMITTER_ROLES: ApplicationRole[] = [
  ApplicationRole.SuperUsuario,
  ApplicationRole.Direccion,
  ApplicationRole.Legal,
  ApplicationRole.CoordinacionLegal,
  ApplicationRole.RecursosHumanos,
  ApplicationRole.Reclutamiento,
  ApplicationRole.GerenteMantenimiento,
  ApplicationRole.SistemasGeneral,
  ApplicationRole.Mensajeria,
  ApplicationRole.SupervisionOperativa,
  ApplicationRole.Administrador,
  ApplicationRole.GerenteOperaciones,
  ApplicationRole.GerenteAtencion,
  ApplicationRole.Asistente,
  ApplicationRole.Almacenista,
  ApplicationRole.Contador,
  ApplicationRole.Cobranza,
  ApplicationRole.JefeMantenimiento,
  ApplicationRole.TecnicoMantenimiento,
  ApplicationRole.Recepcionista,
  ApplicationRole.MasterConcierge,
  ApplicationRole.Concierge,
  ApplicationRole.JardineriaInterna,
  ApplicationRole.JefeSeguridadInterna,
  ApplicationRole.SeguridadInterna,
  ApplicationRole.Monitorista,
  ApplicationRole.EntrenadorGimnasio,
  ApplicationRole.SupervisorObra,
  ApplicationRole.Sistemas,
  ApplicationRole.Ludotecaria,
  ApplicationRole.Paqueteria,
  ApplicationRole.Chofer,
  ApplicationRole.BellBoy,
  ApplicationRole.SnackBar,
];

const HOLD_DURATION_MS = 1500;
const COUNTDOWN_SECONDS = 5;

@Component({
  selector: "app-panic-button",
  imports: [AppIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <button
        type="button"
        class="panic-btn"
        [class.panic-btn--sending]="isSending()"
        [class.panic-btn--hold]="isHolding()"
        (mousedown)="onHoldStart()"
        (mouseup)="onHoldEnd()"
        (mouseleave)="onHoldCancel()"
        (touchstart)="onHoldStart()"
        (touchend)="onHoldEnd()"
        (touchcancel)="onHoldCancel()"
        [disabled]="isSending()"
        aria-label="Alerta de pónico: mantón presionado para activar"
        title="Mantón presionado para activar alerta de pónico"
      >
        <div class="panic-btn__ring" [style.--progress]="holdProgress() + '%'">
          <app-icon icon="material-symbols-light:error" class="panic-btn__icon" />
        </div>
        @if (isSending()) {
          <span class="panic-btn__label">Enviando...</span>
        }
      </button>

      <!-- Ventana de cancelación: la alerta sale solo al llegar a 0.
         <dialog>.showModal() renderiza en el top layer del navegador:
         inmune a transforms/z-index de ancestros (fix overlay tras router-outlet) -->
      @if (isCountingDown()) {
        <dialog
          #countdownDialog
          class="panic-countdown-dialog"
          (cancel)="onCancelCountdown()"
        >
          <div class="panic-countdown">
            <app-icon icon="material-symbols-light:error" class="panic-countdown__icon" />
            <p class="panic-countdown__title">Enviando alerta de pónico en</p>
            <p class="panic-countdown__seconds">{{ countdownSeconds() }}</p>
            <button
              type="button"
              class="panic-countdown__cancel"
              (click)="onCancelCountdown()"
            >
              Cancelar
            </button>
          </div>
        </dialog>
      }
    }
  `,
  styles: `
    :host {
      display: inline-block;
    }

    .panic-btn {
      position: relative;
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 6px;
      border-radius: 8px;
      transition: transform 0.15s ease;
    }

    .panic-btn:hover:not(:disabled) {
      transform: scale(1.1);
    }

    .panic-btn:active:not(:disabled) {
      transform: scale(0.95);
    }

    .panic-btn__ring {
      position: relative;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: conic-gradient(
        #dc2626 var(--progress, 0%),
        rgba(220, 38, 38, 0.15) var(--progress, 0%)
      );
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s linear;
    }

    .panic-btn--hold .panic-btn__ring {
      background: conic-gradient(
        #dc2626 var(--progress, 0%),
        rgba(220, 38, 38, 0.3) var(--progress, 0%)
      );
      box-shadow: 0 0 12px rgba(220, 38, 38, 0.4);
    }

    .panic-btn--sending .panic-btn__ring {
      background: rgba(220, 38, 38, 0.2);
      animation: pulse 1s infinite;
    }

    .panic-btn__icon {
      font-size: 20px;
      color: #dc2626;
      z-index: 1;
    }

    .panic-btn--sending .panic-btn__icon {
      color: #991b1b;
      animation: pulse 1s infinite;
    }

    .panic-btn__label {
      font-size: 11px;
      font-weight: 600;
      color: #dc2626;
      white-space: nowrap;
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

    /* Mobile variant */
    :host(.mobile) .panic-btn__ring {
      width: 48px;
      height: 48px;
    }

    :host(.mobile) .panic-btn__icon {
      font-size: 28px;
    }

    /* Cuenta regresiva cancelable (dialog nativo en top layer) */
    .panic-countdown-dialog {
      border: none;
      padding: 0;
      background: transparent;
      max-width: 340px;
      width: calc(100vw - 48px);
      overflow: visible;
    }

    .panic-countdown-dialog::backdrop {
      background: rgba(0, 0, 0, 0.75);
    }

    .panic-countdown {
      background: var(--ds-bg-card, #fff);
      border: 3px solid #dc2626;
      border-radius: 16px;
      padding: 32px 24px;
      max-width: 340px;
      width: 100%;
      text-align: center;
      box-shadow: 0 8px 32px rgba(220, 38, 38, 0.4);
    }

    .panic-countdown__icon {
      font-size: 48px;
      color: #dc2626;
      animation: pulse 1s infinite;
    }

    .panic-countdown__title {
      font-size: 16px;
      font-weight: 600;
      margin: 12px 0 4px;
    }

    .panic-countdown__seconds {
      font-size: 56px;
      font-weight: 800;
      color: #dc2626;
      line-height: 1;
      margin: 8px 0 20px;
    }

    .panic-countdown__cancel {
      width: 100%;
      padding: 16px;
      border: none;
      border-radius: 12px;
      background: var(--ds-bg-secondary, #f3f4f6);
      color: var(--ds-text-primary, #374151);
      font-size: 18px;
      font-weight: 700;
      cursor: pointer;
    }

    .panic-countdown__cancel:active {
      background: var(--ds-bg-tertiary, #e5e7eb);
    }
  `,
})
export class PanicButton implements OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private geolocationS = inject(GeolocationService);

  variant = input<"desktop" | "mobile">("desktop");
  alertTriggered = output<PanicAlertDto>();

  private aspRoleService = inject(AspRoleService);

  visible = computed(() => this.aspRoleService.hasAny(EMITTER_ROLES));

  isHolding = signal(false);
  isSending = signal(false);
  holdProgress = signal(0);
  countdownSeconds = signal(0);
  isCountingDown = computed(() => this.countdownSeconds() > 0);

  private holdTimer: ReturnType<typeof setTimeout> | null = null;
  private progressTimer: ReturnType<typeof setInterval> | null = null;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;
  private holdStartTime = 0;

  private countdownDialog =
    viewChild<ElementRef<HTMLDialogElement>>("countdownDialog");

  constructor() {
    // El @if crea el <dialog> al iniciar la cuenta; aqué se abre como modal
    // (showModal solo puede llamarse con el elemento ya en el DOM)
    effect(() => {
      const dialog = this.countdownDialog()?.nativeElement;
      if (dialog && !dialog.open) {
        dialog.showModal();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.clearCountdown();
  }

  onHoldStart(): void {
    if (this.isSending() || this.isHolding() || this.isCountingDown()) return;

    this.isHolding.set(true);
    this.holdStartTime = Date.now();
    this.holdProgress.set(0);

    this.progressTimer = setInterval(() => {
      const elapsed = Date.now() - this.holdStartTime;
      const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      this.holdProgress.set(progress);

      if (progress >= 100) {
        this.clearTimers();
        this.startCountdown();
      }
    }, 30);
  }

  /**
   * Ventana de cancelación: la alerta se envía solo cuando la cuenta
   * regresiva llega a 0. Un botón grande de Cancelar la aborta.
   */
  private startCountdown(): void {
    this.isHolding.set(false);
    this.holdProgress.set(0);
    this.countdownSeconds.set(COUNTDOWN_SECONDS);

    this.countdownTimer = setInterval(() => {
      if (navigator.vibrate) {
        navigator.vibrate(80);
      }

      const remaining = this.countdownSeconds() - 1;
      this.countdownSeconds.set(remaining);

      if (remaining <= 0) {
        this.clearCountdown();
        this.triggerAlert();
      }
    }, 1000);
  }

  onCancelCountdown(): void {
    this.clearCountdown();
    this.countdownSeconds.set(0);
  }

  private clearCountdown(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  onHoldEnd(): void {
    if (this.isHolding() && !this.isSending()) {
      this.clearTimers();
      this.holdProgress.set(0);
      this.isHolding.set(false);
    }
  }

  onHoldCancel(): void {
    this.clearTimers();
    this.holdProgress.set(0);
    this.isHolding.set(false);
  }

  private async triggerAlert(): Promise<void> {
    this.isHolding.set(false);
    this.isSending.set(true);

    try {
      // Vibrate if available
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }

      const position = await this.geolocationS.getCurrentPosition();

      const dto: PanicAlertCreateDto = {
        latitude: position?.latitude ?? null,
        longitude: position?.longitude ?? null,
        locationAccuracy: position?.accuracy ?? null,
        message: null,
      };

      const result = await this.apiResponseS.onPost<PanicAlertDto>(
        Endpoints.PanicAlerts.create,
        dto,
      );

      if (result !== false) {
        this.alertTriggered.emit(result);
      }
    } finally {
      this.isSending.set(false);
      this.holdProgress.set(0);
    }
  }

  private clearTimers(): void {
    if (this.holdTimer) {
      clearTimeout(this.holdTimer);
      this.holdTimer = null;
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }
}
