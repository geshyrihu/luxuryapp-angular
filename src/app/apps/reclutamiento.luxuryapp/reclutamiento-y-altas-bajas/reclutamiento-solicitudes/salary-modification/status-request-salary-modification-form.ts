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
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints.reclutamiento";
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
  submitting = signal(false);

  id: string = "";

  cb_applicationRole = signal<SelectItemDto[]>([]);
  cb_si_no = signal<SelectItemDto[]>([]);

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
    const urlApi = EndpointsReclutamiento.RequestSalaryModification.getById(this.id);
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
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
      transformPayload: () => this.form.getRawValue(),
    });
  }
  onApplicationRoleSelectItem() {
    this.apiResponseS
      .onGetSelectItem<SelectItemDto[]>(`application-roles-to-administrator`)
      .then((response: any) => {
        this.cb_applicationRole.set(response);
      });
  }
}
