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
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
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
  submitting = signal(false);

  cb_status = signal<SelectItemDto[]>([]);
  cb_si_no = signal<SelectItemDto[]>([]);
  id: string = "";

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    applicationUserId: ["", Validators.required],
    confirmationFinish: [false, Validators.required],
    currentSalary: [0, Validators.required], // Assumed number
    employeeId: [0, Validators.required],
    executionDate: [null as Date | null, Validators.required],
    finalSalary: [0, Validators.required],
    folio: ["", Validators.required],
    applicationRoleCurrentId: [0, Validators.required],
    applicationRoleNewId: [0, Validators.required],
    requestDate: [null as Date | null, Validators.required],
    retroactive: [false, Validators.required],
    soport: [""],
    status: [null as number | null, Validators.required],
    workPositionId: [0, Validators.required],
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
    const urlApi = `requestsalarymodification/getbyid/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "requestsalarymodification",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
