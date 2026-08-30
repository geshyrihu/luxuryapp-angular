import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { CurrencyPipe } from "@angular/common";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import {
  EContractType,
  EmployeeWorkContractDetailDTO,
} from "./interfaces/work-contract.dto";
import { EmployeeFileWorkPositionDTO } from "../employee-file/interfaces/employee-file.interfaces";

interface IWorkContractForm {
  contractType: import("@angular/forms").FormControl<EContractType>;
  startDate: import("@angular/forms").FormControl<Date | null>;
  endDate: import("@angular/forms").FormControl<Date | null>;
  notes: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-work-contract-form",
  templateUrl: "./work-contract-form.html",
  styleUrl: "./work-contract-form.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    CustomInputDateSignal,
    CustomInputSelectSignal,
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

  item = signal<Partial<EmployeeWorkContractDetailDTO> | null>(null);
  isEdit = signal(false);
  employeeContext = signal(false);
  contextEmployeeId = signal<string>("");
  submitting = signal(false);
  pdfFile = signal<File | null>(null);

  activePosition = signal<EmployeeFileWorkPositionDTO | null>(null);

  positionLabel = computed(() =>
    this.isEdit()
      ? (this.item()?.workPositionName ?? "")
      : (this.activePosition()?.puesto ?? ""),
  );

  salaryValue = computed(() =>
    this.isEdit()
      ? (this.item()?.salaryAtContract ?? 0)
      : (this.activePosition()?.sueldoBase ?? 0),
  );

  cb_contractType = [
    { value: "Indeterminado", label: "Indeterminado" },
    { value: "Determinado", label: "Determinado" },
    { value: "Temporal", label: "Temporal / Estacional" },
    { value: "ObraDeterminada", label: "Por Obra Determinada" },
    { value: "Practicas", label: "Prácticas Profesionales" },
    { value: "Outsourcing", label: "Outsourcing" },
    { value: "Honorarios", label: "Honorarios" },
  ];

  form!: FormGroup<IWorkContractForm>;

  ngOnInit(): void {
    const data = this.config.data?.item as Partial<EmployeeWorkContractDetailDTO> | null;
    const empId = this.config.data?.employeeId as string;
    this.item.set(data);
    this.isEdit.set(!!data);
    this.contextEmployeeId.set(empId ?? "");
    this.employeeContext.set(!!empId);

    this.form = this.fb.group<IWorkContractForm>({
      contractType: this.fb.control<EContractType>(data?.contractType ?? "Indeterminado"),
      startDate: this.fb.control<Date | null>(this.dateS.parseDate(data?.startDate)),
      endDate: this.fb.control<Date | null>(this.dateS.parseDate(data?.endDate)),
      notes: this.fb.control(data?.notes ?? ""),
    });

    if (empId && !data) {
      this.loadActivePosition(empId);
    }
  }

  private loadActivePosition(employeeId: string): void {
    this.apiS
      .onGetItem<EmployeeFileWorkPositionDTO>(
        Endpoints.HR.EmployeeFile.workPosition(employeeId),
      )
      .then((resp) => {
        if (resp) this.activePosition.set(resp);
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pdfFile.set(input?.files?.[0] ?? null);
  }

  onSubmit(): void {
    if (!this.apiS.validateForm(this.form)) return;
    this.submitting.set(true);

    const value = this.form.value;
    const employeeId = this.isEdit()
      ? (this.item()?.employeeId ?? "")
      : this.contextEmployeeId();
    const workPositionId = this.isEdit()
      ? (this.item()?.workPositionId ?? "")
      : (this.activePosition()?.workPositionId ?? "");
    const salaryAtContract = this.isEdit()
      ? (this.item()?.salaryAtContract ?? 0)
      : (this.activePosition()?.sueldoBase ?? 0);
    const contractNumber = this.item()?.contractNumber ?? "";

    const formData = new FormData();
    formData.append("employeeId", employeeId);
    formData.append("workPositionId", workPositionId);
    formData.append("contractNumber", contractNumber);
    formData.append("contractType", value.contractType ?? "Indeterminado");
    formData.append("startDate", this.dateS.getDateFormat(value.startDate) ?? "");
    if (value.endDate) {
      formData.append("endDate", this.dateS.getDateFormat(value.endDate) ?? "");
    }
    formData.append("salaryAtContract", String(salaryAtContract ?? 0));
    formData.append("notes", value.notes ?? "");

    const file = this.pdfFile();
    if (file) {
      formData.append("pdfFile", file, file.name);
    }

    const id = this.item()?.id ?? null;
    const url = id
      ? Endpoints.HR.EmployeeWorkContract.update(id)
      : Endpoints.HR.EmployeeWorkContract.create;

    this.apiS
      .onPostFile<EmployeeWorkContractDetailDTO>(url, formData)
      .then((result) => {
        this.submitting.set(false);
        if (result !== false) this.ref.close(true);
      });
  }

  onCancel(): void {
    this.ref.close();
  }
}
