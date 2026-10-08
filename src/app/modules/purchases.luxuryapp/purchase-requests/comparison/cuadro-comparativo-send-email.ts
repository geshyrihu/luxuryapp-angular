import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from "@angular/core";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { CustomToastService } from "@core/services/custom-toast.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { ButtonWeb } from "@ui/buttons/web";

interface ComparisonEmailRecipient {
  id: string;
  name: string;
  email: string;
  source: string;
  role: string;
}

@Component({
  selector: "app-cuadro-comparativo-send-email",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb, CommonModule],
  template: `
    <div class="d-flex flex-column gap-3 pt-2 pb-2">
      <p class="text-body-secondary text-sm mb-0">
        Selecciona los destinatarios del cuadro comparativo. Puedes agregar
        correos adicionales manualmente.
      </p>

      @if (loading()) {
      <div class="text-body-secondary">Cargando destinatarios...</div>
      } @else {
      <section class="border-1 border rounded p-2">
        <div class="fw-semibold mb-2">Comite de vigilancia</div>
        @if (comite().length === 0) {
        <div class="text-body-secondary text-sm">
          Sin miembros de comite registrados.
        </div>
        } @else {
        <div class="d-flex flex-column gap-2">
          @for (recipient of comite(); track recipient.email) {
          <label class="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              [checked]="isSelected(recipient.email)"
              (change)="toggle(recipient.email)"
            />
            <span>
              <strong>{{ recipient.name }}</strong>
              <span class="text-body-secondary text-sm">
                &middot; {{ recipient.email }}
                @if (recipient.role) { &middot; {{ recipient.role }} }
              </span>
            </span>
          </label>
          }
        </div>
        }
      </section>

      <section class="border-1 border rounded p-2">
        <div class="fw-semibold mb-2">Configuracion de correo del cliente</div>
        @if (configuracion().length === 0) {
        <div class="text-body-secondary text-sm">
          Sin contactos de correo configurados.
        </div>
        } @else {
        <div class="d-flex flex-column gap-2">
          @for (recipient of configuracion(); track recipient.email) {
          <label class="d-flex align-items-center gap-2">
            <input
              type="checkbox"
              [checked]="isSelected(recipient.email)"
              (change)="toggle(recipient.email)"
            />
            <span>
              <strong>{{ recipient.name }}</strong>
              <span class="text-body-secondary text-sm">
                &middot; {{ recipient.email }}
                @if (recipient.role) { &middot; {{ recipient.role }} }
              </span>
            </span>
          </label>
          }
        </div>
        }
      </section>

      <div>
        <label class="fw-semibold d-block mb-1">Correos adicionales</label>
        <textarea
          class="form-control"
          rows="2"
          placeholder="correo1@dominio.com, correo2@dominio.com"
          [value]="manualEmails()"
          (input)="onManualEmailsInput($event)"
        ></textarea>
      </div>

      <div>
        <label class="fw-semibold d-block mb-1">Copia (CC)</label>
        <input
          type="text"
          class="form-control"
          placeholder="copia@dominio.com"
          [value]="toCC()"
          (input)="onToCCInput($event)"
        />
      </div>

      <div>
        <label class="fw-semibold d-block mb-1">Proveedor sugerido</label>
        <select
          class="form-select"
          [value]="suggestedProvider()"
          (change)="onSuggestedProviderChange($event)"
        >
          <option value="">-- Sin sugerencia --</option>
          @for (option of providerOptions; track option.value) {
          <option [value]="option.value">{{ option.label }}</option>
          }
        </select>
      </div>

      <div>
        <label class="fw-semibold d-block mb-1">Texto adicional (opcional)</label>
        <textarea
          class="form-control"
          rows="3"
          placeholder="Nota que se agregara al correo despues de la justificacion"
          [value]="additionalNote()"
          (input)="onAdditionalNoteInput($event)"
        ></textarea>
      </div>
      }

      <div
        class="d-flex justify-content-end gap-2 mt-3 pt-3 border-top-1 border"
      >
        <lux-button-web
          label="Cancelar"
          severity="secondary"
          variant="outline"
          size="small"
          (clicked)="onCancel()"
        />
        <lux-button-web
          kind="send-email"
          severity="contrast"
          size="small"
          [loading]="sending()"
          [disabled]="loading() || sending()"
          (clicked)="onSend()"
        />
      </div>
    </div>
  `,
})
export class CuadroComparativoSendEmail {
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  customToastService = inject(CustomToastService);

  solicitudCompraId: string = this.config.data?.solicitudCompraId ?? "";
  providerOptions: { label: string; value: string }[] =
    this.config.data?.providerOptions ?? [];

  loading = signal(true);
  sending = signal(false);
  comite = signal<ComparisonEmailRecipient[]>([]);
  configuracion = signal<ComparisonEmailRecipient[]>([]);
  selected = signal<Set<string>>(new Set<string>());
  manualEmails = signal("");
  toCC = signal("");
  suggestedProvider = signal("");
  additionalNote = signal("");

  constructor() {
    this.loadRecipients();
  }

  private async loadRecipients(): Promise<void> {
    try {
      const result: any = await this.apiResponseS.onGetItem(
        Endpoints.PurchaseRequests.cuadroComparativoEmailRecipients(
          this.solicitudCompraId,
        ),
      );
      this.comite.set(result?.comite ?? []);
      this.configuracion.set(result?.configuracion ?? []);
    } catch {
      this.customToastService.showError(
        "No se pudieron cargar los destinatarios.",
        "Error",
      );
    } finally {
      this.loading.set(false);
    }
  }

  isSelected(email: string): boolean {
    return this.selected().has(email.toLowerCase());
  }

  toggle(email: string): void {
    const next = new Set(this.selected());
    const key = email.toLowerCase();
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    this.selected.set(next);
  }

  onManualEmailsInput(event: Event): void {
    this.manualEmails.set((event.target as HTMLTextAreaElement).value);
  }

  onToCCInput(event: Event): void {
    this.toCC.set((event.target as HTMLInputElement).value);
  }

  onSuggestedProviderChange(event: Event): void {
    this.suggestedProvider.set((event.target as HTMLSelectElement).value);
  }

  onAdditionalNoteInput(event: Event): void {
    this.additionalNote.set((event.target as HTMLTextAreaElement).value);
  }

  private parseEmails(value: string): string[] {
    return value
      .split(/[,;\s]+/)
      .map((email) => email.trim())
      .filter((email) => email.length > 0);
  }

  onSend(): void {
    if (this.sending()) return;

    const manual = this.parseEmails(this.manualEmails());
    const recipients = [
      ...new Set([...this.selected(), ...manual.map((e) => e.toLowerCase())]),
    ];
    const invalid = [...recipients, ...this.parseEmails(this.toCC())].find(
      (email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    );

    if (recipients.length === 0) {
      this.customToastService.showInfo(
        "Sin destinatarios",
        "Selecciona al menos un destinatario o agrega un correo.",
      );
      return;
    }

    if (invalid) {
      this.customToastService.showError(
        `Correo invalido: ${invalid}`,
        "Error de validacion",
      );
      return;
    }

    this.sending.set(true);
    this.apiResponseS
      .onPost(
        Endpoints.PurchaseRequests.cuadroComparativoSendEmail(
          this.solicitudCompraId,
        ),
        {
          recipients,
          toCC: this.parseEmails(this.toCC()),
          evidenceIds: [],
          suggestedProvider: this.suggestedProvider().trim(),
          additionalNote: this.additionalNote().trim(),
        },
      )
      .then((result) => {
        if (result) {
          this.customToastService.showSuccess(
            "Correo enviado",
            "El cuadro comparativo se envio correctamente.",
          );
          this.ref.close(true);
        }
      })
      .finally(() => {
        this.sending.set(false);
      });
  }

  onCancel(): void {
    this.ref.close();
  }
}
