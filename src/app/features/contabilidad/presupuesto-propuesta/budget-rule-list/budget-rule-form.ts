import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import {
  BudgetAccountRuleCreateDTO,
  BudgetAccountRuleUpdateDTO,
} from "../../presupuesto-web-aspel/presupuestos.interfaces";

@Component({
  selector: "app-budget-rule-form",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomButtonSave,
  ],
  templateUrl: "./budget-rule-form.html",
})
export class BudgetRuleForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);
  fb = inject(FormBuilder);

  // Propiedades requeridas por CustomButtonSave
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
    if (this.form.invalid) return;

    this.submitting.set(true);
    const id = this.form.get("id")?.value;

    if (id) {
      // UPDATE
      const dto: BudgetAccountRuleUpdateDTO = {
        ruleType: this.form.get("ruleType")?.value,
        accountNumber: this.form.get("accountNumber")?.value,
        accountName: this.form.get("accountName")?.value,
      };

      const url = `BudgetAccountRules/${id}`;
      this.apiResponseS.onPut(url, dto).then((res) => {
        res ? this.ref.close(true) : this.submitting.set(false);
      });
    } else {
      // CREATE
      const dto: BudgetAccountRuleCreateDTO = {
        customerId: this.form.get("customerId")?.value,
        ruleType: this.form.get("ruleType")?.value,
        accountNumber: this.form.get("accountNumber")?.value,
        accountName: this.form.get("accountName")?.value,
      };

      const url = `BudgetAccountRules`;
      this.apiResponseS.onPost(url, dto).then((res) => {
        res ? this.ref.close(true) : this.submitting.set(false);
      });
    }
  }
}
