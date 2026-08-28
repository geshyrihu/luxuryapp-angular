import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { LxSpinner } from "@ui/adaptive/spinner/spinner";
import { LxTag } from "@ui/adaptive/tag/tag";
import { DynamicDialogConfig } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { getStatusSeverity } from "../helpers/status-severity.helper";
interface LeaveRequestCalendarDetailDTO {
  employeeFullName: string;
  requestTypeName: string;
  requestDate: string;
  period: string;
  isPartial?: boolean;
  timeRange?: string;
  reason: string;
  status: string;
  approverName: string | null;
  approvalDate: string | null;
  attachmentUrl?: string | null;
}

@Component({
  selector: "app-permiso-detalle-modal",
  templateUrl: "./permiso-detalle-modal.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [LxSpinner, LxTag],
  styles: [`
    .detail-modal {
      display: grid;
      gap: 1rem;
      min-width: min(44rem, calc(100vw - 3rem));
      padding: 0.25rem 0.5rem 0.5rem;
    }

    .detail-hero {
      background:
        linear-gradient(135deg, rgba(245, 158, 11, 0.16), rgba(11, 118, 188, 0.08)),
        var(--surface-section);
      border: 1px solid var(--surface-border);
      border-radius: var(--ds-radius-xl, 1rem);
      padding: 1rem;
    }

    .detail-kicker {
      color: var(--text-color-secondary);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      margin: 0 0 0.35rem;
      text-transform: uppercase;
    }

    .detail-title {
      color: var(--text-color);
      font-size: 1.25rem;
      font-weight: 800;
      margin: 0;
    }

    .detail-subtitle {
      color: var(--text-color-secondary);
      margin: 0.5rem 0 0;
    }

    .detail-grid {
      display: grid;
      gap: 0.75rem;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .detail-item,
    .detail-note {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: var(--ds-radius-lg, 0.75rem);
      padding: 0.85rem;
    }

    .detail-label {
      color: var(--text-color-secondary);
      display: block;
      font-size: 0.75rem;
      font-weight: 700;
      margin-bottom: 0.35rem;
    }

    .detail-value {
      color: var(--text-color);
      font-weight: 700;
      line-height: 1.35;
      margin: 0;
    }

    .detail-note {
      grid-column: 1 / -1;
    }

    .detail-note .detail-value {
      font-weight: 500;
    }

    .detail-link {
      color: var(--primary-600);
      font-weight: 700;
      text-decoration: none;
    }

    .detail-link:hover {
      text-decoration: underline;
    }

    .detail-empty,
    .detail-loading {
      align-items: center;
      color: var(--text-color-secondary);
      display: flex;
      justify-content: center;
      min-height: 10rem;
      text-align: center;
    }

    @media screen and (max-width: 768px) {
      .detail-modal {
        min-width: 0;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class PermisoDetalleModal implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  getStatusSeverity = getStatusSeverity;

  id: string = this.config.data?.id;
  requestData = signal<LeaveRequestCalendarDetailDTO | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    if (this.id) {
      this.apiResponseS
        .onGetItem<LeaveRequestCalendarDetailDTO>(
          Endpoints.HR.LeaveRequestApproval.detail(this.id),
        )
        .then((data) => {
          this.requestData.set(data);
          this.loading.set(false);
        })
        .catch(() => this.loading.set(false));
    }
  }

  displayStatus(status: string | null | undefined): string {
    return status?.trim() || "Aprobada";
  }

  displayValue(value: string | null | undefined): string {
    return value?.trim() || "No disponible";
  }
}
