import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { InputDatepicker } from "@ui/inputs/adaptive/input-datepicker/input-datepicker";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CheckboxModule } from "@ui/web/primeng-checkbox/primeng-checkbox";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { RecurrenceInput } from "../../instances/recurrence-input/recurrence-input";

interface ITaskTemplateItemForm {
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<number | null>;
  recurrenceRule: FormControl<string>;
  timeWindowStart: FormControl<Date | null>;
  timeWindowEnd: FormControl<Date | null>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-task-template-item-form",
  templateUrl: "./task-template-item-form.html",
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    RecurrenceInput,
    InputDatepicker,
    CheckboxModule,
    CustomInputCheckSignal,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [DatePipe],
})
export class TaskTemplateItemForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private apiResponseS = inject(ApiResponseService);
  private enumSelectService = inject(EnumSelectService);
  private datePipe = inject(DatePipe);

  submitting = signal(false);
  priorities = signal<SelectItemDto[]>([]);
  templateId = signal<string | null>(null);
  item = signal<any | null>(null);

  form: FormGroup<ITaskTemplateItemForm> = this.formBuilder.group({
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl("", { nonNullable: true }),
    priority: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    recurrenceRule: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    timeWindowStart: new FormControl<Date | null>(null),
    timeWindowEnd: new FormControl<Date | null>(null),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.templateId.set(this.config.data?.templateId);
    const itemData = this.config.data?.item;
    this.item.set(itemData);
    this.loadPriorities();

    if (itemData) {
      // Convert string times to Date objects if necessary for p-datepicker
      // Assuming backend returns "HH:mm:ss" or ISO strings.
      // p-datepicker expects Date objects for [timeOnly]="true" usually.
      const patchData = { ...itemData };
      if (typeof patchData.timeWindowStart === "string") {
        patchData.timeWindowStart = this.parseTime(patchData.timeWindowStart);
      }
      if (typeof patchData.timeWindowEnd === "string") {
        patchData.timeWindowEnd = this.parseTime(patchData.timeWindowEnd);
      }
      this.form.patchValue(patchData);
    }
  }

  // Helper to parse "HH:mm" string to Date object for the picker
  private parseTime(timeString: string): Date | null {
    if (!timeString) return null;
    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  loadPriorities() {
    firstValueFrom(
      this.enumSelectService.onLoadEnumList("priority-level"),
    ).then((resp) => {
      this.priorities.set(resp);
    });
  }

  async onSubmit() {
    const apiUrl = "recurring-tasks/templates";

    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.item()
        ? `${apiUrl}/items/${this.item().id}`
        : `${apiUrl}/${this.templateId()}/items`,
      method: this.item() ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (formValue) => {
        const dto: any = { ...formValue };
        if (formValue.timeWindowStart instanceof Date) {
          dto.timeWindowStart = this.datePipe.transform(
            formValue.timeWindowStart,
            "HH:mm",
          );
        }
        if (formValue.timeWindowEnd instanceof Date) {
          dto.timeWindowEnd = this.datePipe.transform(
            formValue.timeWindowEnd,
            "HH:mm",
          );
        }
        return dto;
      },
    });
  }
}
