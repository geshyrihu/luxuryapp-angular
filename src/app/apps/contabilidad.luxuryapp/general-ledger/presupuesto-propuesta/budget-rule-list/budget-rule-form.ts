/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explócita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  BudgetAccountRuleCreateDTO,
  BudgetAccountRuleUpdateDTO,
} from "../../presupuesto-web-aspel/presupuestos.interfaces";

@Component({
  selector: "app-budget-rule-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./budget-rule-form.html",
})
export class BudgetRuleForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  fb = inject(FormBuilder);

  // Propiedades requeridas por WebButtonLabelSave
  id = "";
  submitting = signal(false);

  form: FormGroup = this.fb.group({
    id: [""],
    customerId: [0, Validators.required],
    ruleType: [0, Validators.required],
    accountNumber: ["", [Validators.required, Validators.maxLength(50)]],
    accountName: ["", Validators.maxLength(200)],
  });

  // Opciones para el selector de tipo
  ruleTypes = [
    { label: "Cuenta Extra (Inclusión)", value: 0 },
    { label: "Exclusión (Ocultar)", value: 1 },
  ];

  initialData: any;

  ngOnInit(): void {
    this.initialData = this.config.data;

    this.id = this.initialData.id || "";

    // Configurar customerId desde el contexto si es creación
    if (!this.id && this.initialData.customerId) {
      this.form.patchValue({ customerId: this.initialData.customerId });
    }

    if (this.id) {
      // Si tuvióramos endpoint GET by ID:
      // this.onLoadData();
      // Como no, asumimos que viene en data o lo pasamos completo
      this.form.patchValue(this.initialData);
    }
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "budget-account-rules",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const {
          id: _,
          customerId,
          ruleType,
          accountNumber,
          accountName,
        } = this.form.value;
        return this.id
          ? ({
              ruleType,
              accountNumber,
              accountName,
            } as BudgetAccountRuleUpdateDTO)
          : ({
              customerId,
              ruleType,
              accountNumber,
              accountName,
            } as BudgetAccountRuleCreateDTO);
      },
    });
  }
}
