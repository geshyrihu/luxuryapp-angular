import { ChangeDetectionStrategy, Component, inject, signal } from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";

export interface DuplicateEmployeeMatch {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono: string;
  estatus: string;
  nombreEdificio: string;
}

interface DuplicateEmployeeWarningDialogData {
  matches: DuplicateEmployeeMatch[];
  requestPositionId: string;
  candidateProcessId: string;
}

@Component({
  selector: "app-duplicate-employee-warning-modal",
  standalone: true,
  templateUrl: "./duplicate-employee-warning-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [WebButtonLabel],
  styles: [
    `
      :host {
        display: block;
      }

      .duplicate-warning {
        border: 1px solid var(--surface-border);
        border-radius: var(--ds-radius-lg);
        overflow: hidden;
      }

      .duplicate-warning__hero {
        background: color-mix(in srgb, var(--orange-500) 12%, var(--surface-card));
        border-bottom: 1px solid var(--surface-border);
        padding: var(--ds-space-md);
      }

      .duplicate-warning__table {
        border-collapse: collapse;
        width: 100%;
      }

      .duplicate-warning__table th,
      .duplicate-warning__table td {
        border-bottom: 1px solid var(--surface-border);
        padding: 0.75rem;
        text-align: left;
      }

      .duplicate-warning__table th {
        background: var(--surface-50);
        color: var(--text-color-secondary);
        font-size: 0.75rem;
        text-transform: uppercase;
      }

      .duplicate-warning__actions {
        display: flex;
        gap: var(--ds-space-sm);
        justify-content: flex-end;
        padding: var(--ds-space-md);
      }
    `,
  ],
})
export class DuplicateEmployeeWarningModal {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly apiResponseS = inject(ApiResponseService);

  readonly submittingId = signal<string | null>(null);
  readonly data = this.config.data as DuplicateEmployeeWarningDialogData;
  readonly matches = this.data.matches ?? [];

  async onReactivate(match: DuplicateEmployeeMatch): Promise<void> {
    if (this.submittingId()) return;

    this.submittingId.set(match.id);
    const result = await this.apiResponseS.onPost<boolean>(
      EndpointsReclutamiento.RequestEmployeeRegister.reactivateAndMigrate,
      {
        existingEmployeeId: match.id,
        requestPositionId: this.data.requestPositionId,
        candidateProcessId: this.data.candidateProcessId,
      },
    );
    this.submittingId.set(null);

    if (result) this.ref.close("reactivated");
  }

  onContinue(): void {
    this.ref.close("continue");
  }
}
