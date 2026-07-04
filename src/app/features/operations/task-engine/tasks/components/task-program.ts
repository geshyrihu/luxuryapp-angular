import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputAutoComplete } from "@ui/inputs/web/custom-input-autocomplete-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  CrudSubmitOptions,
  FormHelper,
} from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DateService } from "src/app/core/services/date.service";

interface IITaskMessageDTOProgramForm {
  id: FormControl<string | null>;
  scheduledDate: FormControl<Date | string>;
  assigneeId: FormControl<string>;
  assignee: FormControl<string>;
  applicationUserId: FormControl<string>;
}

@Component({
  selector: "app-task-program",
  templateUrl: "./task-program.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputDateSignal,
    CustomInputAutoComplete,
    WebButtonLabelSave,
  ],
})
export class TaskProgram implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private formB = inject(FormBuilder);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  // Signal para ComboBox
  cb_user = signal<ISelectItem[]>([]);

  form: FormGroup<IITaskMessageDTOProgramForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    scheduledDate: new FormControl<Date | string>(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assigneeId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignee: new FormControl("", { nonNullable: true }),
    applicationUserId: new FormControl(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;
    this.form.controls.id.setValue(this.id);

    await this.onLoadUsers();
    await this.onLoadData();
  }

  async onLoadUsers(): Promise<void> {
    const result: any = await this.apiResponseS.onGetList(
      Endpoints.Tasks.participants(this.config.data.ticketGroupId),
    );
    this.cb_user.set(result as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Tasks.programation(this.id),
    );

    // Extraer assigneeId
    let assigneeId = "";
    if (result.assigneeId !== null && result.assigneeId !== undefined) {
      assigneeId =
        typeof result.assigneeId === "object" && result.assigneeId !== null
          ? (result.assigneeId as any).value
          : result.assigneeId;
    }

    // Buscar el usuario asignado completo
    const selectedAssignee = assigneeId
      ? this.cb_user().find((item) => item.value === assigneeId)
      : null;

    this.form.patchValue({
      scheduledDate: this.dateS.parseDate(result.scheduledDate) ?? new Date(),
      assigneeId,
      assignee: selectedAssignee ? selectedAssignee.label : "",
    });
  }

  saveUserId = (item: ISelectItem) => {
    this.form.patchValue({
      assigneeId: item?.value ? String(item.value) : "",
      assignee: item?.label,
    });
  };

  onSubmit() {
    const options: CrudSubmitOptions = {
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Tasks.programation(this.id),
      id: null, // Force POST
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue: any) => {
        return {
          scheduledDate: this.dateS.getDateFormat(formValue.scheduledDate),
          assigneeId: formValue.assigneeId,
          applicationUserId: formValue.applicationUserId,
        };
      },
    };
    FormHelper.submitCrud(options);
  }
}
