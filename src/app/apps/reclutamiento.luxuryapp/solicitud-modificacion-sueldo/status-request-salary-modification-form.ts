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
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { DateService } from "src/app/core/services/date.service";

interface RequestSalaryModificationStatusFormDTO {
  id: string;
  employeeId: string;
  workPositionId: string;
  requestDate: string | null;
  soport?: string | null;
  applicationRoleCurrentId: number;
  applicationRoleNewId: number;
  currentSalary: number;
  finalSalary: number;
  executionDate: string | null;
  folio: string;
  retroactive: boolean;
  status: number;
  applicationUserId: string;
  confirmationFinish: boolean;
}

@Component({
  selector: "app-status-request-salary-modification-form",
  templateUrl: "./status-request-salary-modification-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputNumberSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class StatusRequestSalaryModificationForm implements OnInit {
  private formB = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  private dateS = inject(DateService);
  submitting = signal(false);

  id: string = "";

  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_si_no = signal<SelectItemDto[]>([]);

  private toDate(value: string | Date | null): Date | null {
    if (!value) return null;
    return value instanceof Date ? value : new Date(value);
  }

  form = this.formB.nonNullable.group({
    id: [{ value: this.config.data.id, disabled: true }],
    employeeId: ["", Validators.required],
    workPositionId: ["", Validators.required],
    requestDate: [null as Date | null, Validators.required],
    soport: [""],
    applicationRoleCurrentId: [0, Validators.required],
    applicationRoleNewId: [0, Validators.required],
    currentSalary: [0, Validators.required],
    finalSalary: [0, Validators.required],
    executionDate: [null as Date | null, Validators.required],
    folio: ["", Validators.required],
    retroactive: [false, Validators.required],
    status: [null as number | null, Validators.required],
    applicationUserId: ["", Validators.required],
    confirmationFinish: [false, Validators.required],
  });

  async ngOnInit() {
    this.cb_si_no.set(await firstValueFrom(this.enumSelectS.boolYesNo()));
    this.onApplicationRoleSelectItem();
    this.id = this.config.data.id;
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.getById(
      this.id,
    );
    this.apiResponseS
      .onGetItem<RequestSalaryModificationStatusFormDTO>(urlApi)
      .then((result) => {
        this.form.patchValue({
          ...result,
          requestDate: this.toDate(result.requestDate),
          executionDate: this.toDate(result.executionDate),
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
        requestDate: this.dateS.getDateFormat(this.form.getRawValue().requestDate),
        executionDate: this.dateS.getDateFormat(this.form.getRawValue().executionDate),
      }),
    });
  }
  onApplicationRoleSelectItem() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.applicationRolesToAdministrator,
      )
      .then((response) => {
        this.cb_applicationRole.set(response);
      });
  }
}
