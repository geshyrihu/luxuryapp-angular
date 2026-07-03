import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputCurrencySignal } from "src/app/core/components/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  EContractType,
  WorkContractAddOrEditDTO,
  WorkContractDetailDTO,
} from "../models/work-contract.dto";

interface IWorkContractForm {
  employeeId: import("@angular/forms").FormControl<string>;
  contractType: import("@angular/forms").FormControl<EContractType>;
  startDate: import("@angular/forms").FormControl<Date | null>;
  endDate: import("@angular/forms").FormControl<Date | null>;
  probationEndDate: import("@angular/forms").FormControl<Date | null>;
  contractSalary: import("@angular/forms").FormControl<number>;
  notes: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-work-contract-form",
  templateUrl: "./work-contract-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputCurrencySignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class WorkContractFormComponent implements OnInit {
  apiS = inject(ApiResponseService);
  dateS = inject(DateService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  item = signal<Partial<WorkContractDetailDTO> | null>(null);
  isEdit = signal(false);
  employeeId = signal<string>("");
  submitting = signal(false);

  form!: FormGroup<IWorkContractForm>;

  cb_contractType: ISelectItem[] = [
    { value: "Indeterminado", label: "Indeterminado" },
    { value: "Determinado", label: "Determinado" },
    { value: "Temporal", label: "Temporal / Estacional" },
    { value: "ObraDeterminada", label: "Por Obra Determinada" },
    { value: "Practicas", label: "Prácticas Profesionales" },
    { value: "Outsourcing", label: "Outsourcing" },
    { value: "Honorarios", label: "Honorarios" },
  ];

  ngOnInit(): void {
    const data = this.config.data
      ?.item as Partial<WorkContractDetailDTO> | null;
    const empId = this.config.data?.employeeId as string;
    this.item.set(data);
    this.isEdit.set(!!data);
    this.employeeId.set(empId);

    this.form = this.fb.group<IWorkContractForm>({
      employeeId: this.fb.control(empId),
      contractType: this.fb.control<EContractType>(
        data?.contractType ?? "Indeterminado",
      ),
      startDate: this.fb.control<Date | null>(
        this.dateS.parseDate(data?.startDate),
      ),
      endDate: this.fb.control<Date | null>(
        this.dateS.parseDate(data?.endDate),
      ),
      probationEndDate: this.fb.control<Date | null>(
        this.dateS.parseDate(data?.probationEndDate),
      ),
      contractSalary: this.fb.control(data?.contractSalary ?? 0),
      notes: this.fb.control(""),
    });
  }

  onSubmit(): void {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiS,
      endpoint: Endpoints.HR.WorkContract.create.split("/")[0],
      id: this.item()?.id ?? null,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value) => {
        const dto: WorkContractAddOrEditDTO = {
          employeeId: value.employeeId,
          contractType: value.contractType,
          startDate: this.dateS.getDateFormat(value.startDate) ?? "",
          endDate: this.dateS.getDateFormat(value.endDate) ?? undefined,
          probationEndDate:
            this.dateS.getDateFormat(value.probationEndDate) ?? undefined,
          contractSalary: value.contractSalary,
          notes: value.notes,
        };
        return dto;
      },
    });
  }

  onCancel(): void {
    this.ref.close();
  }
}
