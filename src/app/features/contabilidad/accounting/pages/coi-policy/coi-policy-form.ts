import { DecimalPipe } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonAdd } from "src/app/core/components/buttons/web/custom-button-add";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";

export interface IPolicyDetailForm {
  accountId: FormControl<string>;
  propertyId: FormControl<string | null>;
  providerId: FormControl<string | null>;
  concept: FormControl<string>;
  amount: FormControl<number>;
  nature: FormControl<number | null>; // 1 o -1
}

export interface IPolicyForm {
  id: FormControl<string>;
  customerId: FormControl<string>;
  policyType: FormControl<number | null>;
  policyNumber: FormControl<number>;
  date: FormControl<Date | null>;
  concept: FormControl<string>;
  details: FormArray<FormGroup<IPolicyDetailForm>>;
}

@Component({
  selector: "app-form-coi-policy",
  imports: [
    ReactiveFormsModule,
    CustomButtonSave,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputNumberSignal,
    CustomButtonDelete,
    CustomButtonAdd,
    DecimalPipe,
  ],
  templateUrl: "./coi-policy-form.html",
})
export class CoiPolicyForm implements OnInit {
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);

  // Math global para el template
  math = Math;

  // States
  id = "";
  submitting = signal(false);
  data = this.config.data;

  // Comboboxes
  policyTypeOptions = [
    { label: "Ingreso (1)", value: 1 },
    { label: "Egreso (2)", value: 2 },
    { label: "Diario (3)", value: 3 },
  ];

  natureOptions = [
    { label: "Cargo (1)", value: 1 },
    { label: "Abono (-1)", value: -1 },
  ];

  form: FormGroup<IPolicyForm> = this.formB.group({
    id: new FormControl("", { nonNullable: true }),
    customerId: new FormControl(this.data.customerId || "", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    policyType: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    policyNumber: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    date: new FormControl<Date | null>(new Date(), {
      validators: [Validators.required],
    }),
    concept: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(255)],
    }),
    details: this.formB.array<FormGroup<IPolicyDetailForm>>([]),
  });

  // Signals reactivos para el cuadre (usualmente Angular 21 permite enlazar form.valueChanges con signals)
  sumCargos = signal<number>(0);
  sumAbonos = signal<number>(0);

  ngOnInit(): void {
    if (this.data.id && this.data.id !== "") {
      this.id = this.data.id;
      this.onLoadData();
    } else {
      // Póliza nueva, agregar al menos 2 líneas para balancear
      this.addDetailBase();
      this.addDetailBase();
    }

    // Reactividad a cambios del formarray
    this.form.controls.details.valueChanges.subscribe((details) => {
      let cargos = 0;
      let abonos = 0;
      details.forEach((d) => {
        if (d.nature === 1) cargos += Number(d.amount) || 0;
        if (d.nature === -1) abonos += Number(d.amount) || 0;
      });
      this.sumCargos.set(cargos);
      this.sumAbonos.set(abonos);
    });
  }

  async onLoadData() {
    this.submitting.set(true);
    const result = await this.apiResponseS.onGetItem<any>(
      `coi-policies/${this.id}`,
    );
    if (result) {
      this.form.patchValue({
        id: result.id,
        customerId: result.customerId,
        policyType: result.policyType,
        policyNumber: result.policyNumber,
        date: new Date(result.date),
        concept: result.concept,
      });

      // Llenar FormArray
      result.details?.forEach((d) => {
        const detailGroup = this.createDetailGroup();
        detailGroup.patchValue(d);
        this.form.controls.details.push(detailGroup);
      });
    }
    this.submitting.set(false);
  }

  createDetailGroup(): FormGroup<IPolicyDetailForm> {
    return this.formB.group({
      accountId: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required],
      }),
      propertyId: new FormControl<string | null>(null),
      providerId: new FormControl<string | null>(null),
      concept: new FormControl("", {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(255)],
      }),
      amount: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.01)],
      }),
      nature: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
    });
  }

  addDetail() {
    this.form.controls.details.push(this.createDetailGroup());
  }

  private addDetailBase() {
    this.form.controls.details.push(this.createDetailGroup());
  }

  removeDetail(index: number) {
    this.form.controls.details.removeAt(index);
  }

  async onSubmit() {
    // Si la suma no cuadra (Double Validation), frenar el submit manual
    if (
      this.sumCargos() !== this.sumAbonos() ||
      this.form.controls.details.length < 2
    ) {
      return;
    }

    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "coi-policies",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}
