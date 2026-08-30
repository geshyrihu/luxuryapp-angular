import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { ButtonModule } from "primeng/button";
import { TagModule } from "primeng/tag";
import { ContractRenewalService } from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/services/contract-renewal.service";
import {
  ContractRenewalEvaluationDTO,
  ContractRenewalDecision,
  ContractRenewalDecisionDTO,
  ContractRenewalStatus,
} from "src/app/apps/recursos-humanos.luxuryapp/expediente-del-empleado/employees/employees/interfaces/contract-renewal.dto";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";

type StatusSeverity = "info" | "success" | "warn" | "danger" | "secondary" | "contrast";

interface DecisionOption {
  value: ContractRenewalDecision;
  label: string;
}

@Component({
  selector: "app-contract-renewal-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    AppIcon,
    CustomInputSelectSignal,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <!-- Header Info -->
      <div class="modal-header-info">
        <div class="info-row">
          <span class="label">Contrato:</span>
          <span class="value">{{ data.renewal.contractNumber }}</span>
        </div>
        <div class="info-row">
          <span class="label">Empleado:</span>
          <span class="value">{{ data.renewal.employeeName }}</span>
        </div>
        <div class="info-row">
          <span class="label">Puesto:</span>
          <span class="value">{{ data.renewal.positionName }}</span>
        </div>
        <div class="info-row">
          <span class="label">Fecha Vencimiento:</span>
          <span class="value date">{{ data.renewal.contractEndDate | date: "dd/MM/yyyy" }}</span>
        </div>
        <div class="info-row">
          <span class="label">Estatus Actual:</span>
          <p-tag
            [value]="getStatusLabel(data.renewal.status)"
            [severity]="getStatusSeverity(data.renewal.status)"
          />
        </div>

        <!-- R1: Performance Evaluation Status Banner -->
        @if (data.renewal.performanceEvaluationId) {
          <div class="performance-evaluation-banner">
            <app-icon name="clipboard-check" class="pe-banner-icon" />
            <div class="pe-banner-content">
              <strong>Evaluación de Desempeño vinculada:</strong>
              <span [class.completed]="isPerformanceCompleted()">
                {{ isPerformanceCompleted() ? "Completada ✓" : "Pendiente ⚠" }}
              </span>
            </div>
          </div>
        } @else {
          <div class="performance-evaluation-banner warning">
            <app-icon name="alert-triangle" class="pe-banner-icon warning" />
            <div class="pe-banner-content">
              <strong>Sin Evaluación de Desempeño vinculada</strong>
              <span class="warning-text">
                Se requiere vincular una evaluación de desempeño completada para registrar la decisión
              </span>
            </div>
          </div>
        }

        <!-- Form Fields -->
        <div class="form-field">
          <label for="decision">Decisión *</label>
          <custom-input-select-signal
            id="decision"
            formControlName="decision"
            [data]="decisionOptions()"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccionar decisión"
            [required]="true"
            [filter]="true"
          />
          @if (form.get("decision")?.invalid && form.get("decision")?.touched) {
            <small class="p-error">La decisión es obligatoria</small>
          }
        </div>

        <div class="form-field">
          <label for="decisionDate">Fecha de Decisión *</label>
          <input
            type="date"
            id="decisionDate"
            formControlName="decisionDate"
            class="p-inputtext p-component"
            [class.ng-invalid]="form.get('decisionDate')?.invalid && form.get('decisionDate')?.touched"
          />
          @if (form.get("decisionDate")?.invalid && form.get('decisionDate')?.touched) {
            <small class="p-error">La fecha de decisión es obligatoria</small>
          }
        </div>

        <div class="form-field">
          <label for="comments">Comentarios</label>
          <textarea
            id="comments"
            formControlName="comments"
            rows="3"
            class="p-inputtext p-inputtextarea p-component"
            placeholder="Observaciones sobre la decisión..."
          ></textarea>
        </div>

        <div class="form-field">
          <label for="justification">Justificación</label>
          <textarea
            id="justification"
            formControlName="justification"
            rows="3"
            class="p-inputtext p-inputtextarea p-component"
            placeholder="Justificación técnica de la decisión (obligatoria para No Renovar)..."
          ></textarea>
        </div>

        <!-- R2: Special notice for NoRenovar decision -->
        @if (form.get("decision")?.value === "NoRenovar") {
          <div class="r2-notice">
            <app-icon name="info-circle" class="r2-icon" />
            <span>
              <strong>Regla R2:</strong> Al seleccionar "No Renovar", se agregará automáticamente el comentario:
              <code>// TODO: Enlazar con creación automática de RequestDismissal tras módulo de bajas.</code>
            </span>
          </div>
        }
      </div>

      <!-- Submit Buttons -->
      <div class="modal-actions">
        <p-button
          type="button"
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-text"
          (click)="onCancel()"
        />
        <p-button
          type="submit"
          [label]="isSubmitting() ? 'Guardando...' : 'Guardar Decisión'"
          [icon]="isSubmitting() ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
          [disabled]="form.invalid || isSubmitDisabled() || isSubmitting()"
        />
      </div>
    </form>
  `,
  styles: `
    :host {
      display: block;
      max-width: 600px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .modal-header-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--surface-100);
      border-radius: 8px;
      border: 1px solid var(--surface-border);
    }

    .info-row {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .info-row .label {
      font-weight: 600;
      min-width: 140px;
      color: var(--text-color-secondary);
    }

    .info-row .value {
      color: var(--text-color);
    }

    .info-row .value.date {
      font-family: var(--font-family-monospace);
    }

    .performance-evaluation-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      background: var(--surface-200);
      border: 1px solid var(--surface-border);
    }

    .performance-evaluation-banner.warning {
      background: var(--yellow-100);
      border-color: var(--yellow-300);
    }

    .pe-banner-icon {
      font-size: 1.25rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .pe-banner-icon.warning {
      color: var(--yellow-500);
    }

    .pe-banner-content {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.875rem;
    }

    .pe-banner-content strong {
      color: var(--text-color);
    }

    .pe-banner-content .warning-text {
      color: var(--text-color-secondary);
      font-weight: normal;
    }

    .pe-banner-content .completed {
      color: var(--green-600);
      font-weight: 600;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .form-field label {
      font-weight: 500;
      font-size: 0.875rem;
      color: var(--text-color);
    }

    .form-field small.p-error {
      color: var(--red-500);
      font-size: 0.75rem;
    }

    .r2-notice {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: var(--red-50);
      border: 1px solid var(--red-200);
      border-radius: 8px;
      color: var(--red-700);
      font-size: 0.875rem;
    }

    .r2-icon {
      color: var(--red-500);
      font-size: 1.125rem;
      margin-top: 0.125rem;
      flex-shrink: 0;
    }

    .r2-notice code {
      background: var(--red-100);
      padding: 0.125rem 0.375rem;
      border-radius: 4px;
      font-size: 0.75rem;
      white-space: pre-wrap;
      display: block;
      margin-top: 0.5rem;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--surface-border);
      margin-top: 0.5rem;
    }
  `,
})
export class ContractRenewalFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private renewalService = inject(ContractRenewalService);

  data: { renewal: ContractRenewalEvaluationDTO } = this.dialogConfig.data;

  form: FormGroup = this.fb.group({
    decision: [null as ContractRenewalDecision | null, Validators.required],
    decisionDate: [null, Validators.required],
    comments: [""],
    justification: [""],
  });

  isSubmitting = signal(false);

  // Decision options for select
  decisionOptions = signal<{ value: ContractRenewalDecision; label: string }[]>([
    { value: "Renovar", label: "Renovar" },
    { value: "NoRenovar", label: "No Renovar" },
    { value: "RenovarConCambios", label: "Renovar con Cambios" },
  ]);

  // R1: Check if linked PerformanceEvaluation is completed
  isPerformanceCompleted = computed(() => {
    const renewal = this.data.renewal;
    if (!renewal.performanceEvaluationId) return false;
    return renewal.status === "Decidido" || renewal.status === "EvaluacionCompletada";
  });

  // R1: Disable submit if PerformanceEvaluation not completed
  isSubmitDisabled = computed(() => {
    const renewal = this.data.renewal;
    const hasPerformanceEval = !!renewal.performanceEvaluationId;
    const performanceCompleted = this.isPerformanceCompleted();
    const decision = this.form.get("decision")?.value;

    // R1: If there's a linked PerformanceEvaluation, it must be completed
    if (hasPerformanceEval && !performanceCompleted) {
      return true;
    }

    // Form validation
    return this.form.invalid;
  });

  ngOnInit(): void {
    // Set default decision date to today
    const today = new Date().toISOString().split("T")[0];
    this.form.patchValue({ decisionDate: today });
  }

  protected getStatusLabel(status: ContractRenewalStatus): string {
    const labels: Record<string, string> = {
      EnAnalisis: "En Análisis",
      EvaluacionCompletada: "Evaluación Completada",
      Decidido: "Decidido",
      Cancelado: "Cancelado",
    };
    return labels[status] ?? status;
  }

  protected getStatusSeverity(status: ContractRenewalStatus): "info" | "success" | "warn" | "danger" | "secondary" | "contrast" {
    const severities: Record<string, "info" | "success" | "warn" | "danger" | "secondary" | "contrast"> = {
      EnAnalisis: "warn",
      EvaluacionCompletada: "info",
      Decidido: "success",
      Cancelado: "danger",
    };
    return severities[status] ?? "secondary";
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.isSubmitDisabled()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    try {
      const dto: ContractRenewalDecisionDTO = {
        decision: this.form.value.decision,
        decisionDate: this.form.value.decisionDate,
        comments: this.form.value.comments,
        justification: this.form.value.justification,
      };

      const result = await this.renewalService.registerDecision(
        this.data.renewal.id,
        dto.decision,
        dto.decisionDate,
        dto.comments,
        dto.justification
      );

      if (result) {
        this.dialogRef.close({ action: "save" });
      }
    } catch (error) {
      console.error("Error saving decision:", error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}