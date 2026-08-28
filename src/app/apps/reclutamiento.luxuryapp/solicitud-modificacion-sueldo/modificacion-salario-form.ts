import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { DateService } from "src/app/core/services/date.service";

interface RequestSalaryModificationEditDTO {
  id: string;
  applicationUserId: string;
  confirmationFinish: boolean;
  currentSalary: number;
  employeeId: string;
  executionDate: string | null;
  finalSalary: number;
  folio: string;
  applicationRoleCurrentId: string;
  applicationRoleNewId: string;
  requestDate: string | null;
  retroactive: boolean;
  soport?: string | null;
  status: number;
  workPositionId: string;
}

@Component({
  selector: "app-modificacion-salario-form",
  templateUrl: "./modificacion-salario-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class ModificacionSalarioForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private enumSelectS = inject(EnumSelectService);
  private dateS = inject(DateService);
  submitting = signal(false);

  cb_status = signal<SelectItemDto[]>([]);
  cb_si_no = signal<SelectItemDto[]>([]);
  id: string = "";

  private toDate(value: string | Date | null): Date | null {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
  }

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    applicationUserId: ["", Validators.required],
    confirmationFinish: [false, Validators.required],
    currentSalary: [0, Validators.required],
    employeeId: ["", Validators.required],
    executionDate: [null as Date | null, Validators.required],
    finalSalary: [0, Validators.required],
    folio: ["", Validators.required],
    applicationRoleCurrentId: ["", Validators.required],
    applicationRoleNewId: ["", Validators.required],
    requestDate: [null as Date | null, Validators.required],
    retroactive: [false, Validators.required],
    soport: [""],
    status: [null as number | null, Validators.required],
    workPositionId: ["", Validators.required],
  });

  async ngOnInit() {
    this.cb_si_no.set(await firstValueFrom(this.enumSelectS.boolYesNo()));
    this.cb_status.set(await firstValueFrom(this.enumSelectS.status()));
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
      this.form.controls.id.setValue(this.id);
    }
  }

  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.getById(
      this.id,
    );
    this.apiResponseS
      .onGetItem<RequestSalaryModificationEditDTO>(urlApi)
      .then((result) => {
        this.form.patchValue({
          ...result,
          executionDate: this.toDate(result.executionDate),
          requestDate: this.toDate(result.requestDate),
        });
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: EndpointsReclutamiento.RequestSalaryModification.base,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        ...this.form.getRawValue(),
        executionDate: this.dateS.getDateFormat(this.form.getRawValue().executionDate),
        requestDate: this.dateS.getDateFormat(this.form.getRawValue().requestDate),
      }),
    });
  }
}
