import { Component, inject, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  ContractAddendumAddOrEditDTO,
  ContractAddendumDetailDTO,
  EAddendumType,
} from "../models/contract-addendum.dto";

interface IContractAddendumForm {
  workContractId: import("@angular/forms").FormControl<string>;
  addendumType: import("@angular/forms").FormControl<EAddendumType>;
  title: import("@angular/forms").FormControl<string>;
  content: import("@angular/forms").FormControl<string>;
  effectiveDate: import("@angular/forms").FormControl<Date | null>;
  previousValue: import("@angular/forms").FormControl<string>;
  newValue: import("@angular/forms").FormControl<string>;
  notes: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-contract-addendum-form",
  templateUrl: "./contract-addendum-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class ContractAddendumFormComponent {
  apiS = inject(ApiResponseService);
  dateS = inject(DateService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  item = signal<ContractAddendumDetailDTO | null>(null);
  isEdit = signal(false);
  contractId = signal<string>("");
  submitting = signal(false);

  form!: FormGroup<IContractAddendumForm>;

  cb_addendumType: ISelectItem[] = [
    { value: "ModificacionSalario", label: "Modificación de Salario" },
    { value: "CambioPuesto", label: "Cambio de Puesto" },
    { value: "CambioDepartamento", label: "Cambio de Departamento" },
    { value: "CambioUbicacion", label: "Cambio de Ubicación" },
    { value: "ExtensionContrato", label: "Extensión de Contrato" },
    { value: "ModificacionJornada", label: "Modificación de Jornada" },
    { value: "ClausulaAdicional", label: "Clóusula Adicional" },
    { value: "OtrasCondiciones", label: "Otra Condición" },
  ];

  placeholderText =
    "Usa {{ADENDA_NUMERO}}, {{VALOR_ANTERIOR}}, {{VALOR_NUEVO}}, {{FECHA_EFECTIVA}} como variables dinámicas";

  ngOnInit(): void {
    const data = this.config.data?.item as ContractAddendumDetailDTO | null;
    const contractId = this.config.data?.contractId as string;
    this.item.set(data);
    this.isEdit.set(!!data);
    this.contractId.set(contractId);

    this.form = this.fb.group<IContractAddendumForm>({
      workContractId: this.fb.control(contractId),
      addendumType: this.fb.control<EAddendumType>(
        data?.addendumType ?? "ModificacionSalario",
      ),
      title: this.fb.control(data?.title ?? ""),
      content: this.fb.control(data?.content ?? ""),
      effectiveDate: this.fb.control<Date | null>(
        this.dateS.parseDate(data?.effectiveDate),
      ),
      previousValue: this.fb.control(data?.previousValue ?? ""),
      newValue: this.fb.control(data?.newValue ?? ""),
      notes: this.fb.control(data?.notes ?? ""),
    });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: "hr/contract-addendums",
      id: this.item()?.id ?? null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value) => {
        const dto: ContractAddendumAddOrEditDTO = {
          workContractId: value.workContractId,
          addendumType: value.addendumType,
          title: value.title,
          content: value.content,
          effectiveDate: this.dateS.getDateFormat(value.effectiveDate) ?? "",
          previousValue: value.previousValue || undefined,
          newValue: value.newValue || undefined,
          notes: value.notes || undefined,
          addendumTemplateId: undefined,
        };
        return dto;
      },
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
