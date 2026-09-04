import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import { WorkPositionScheduleDto } from "./interfaces/work-position-schedule.dto";

interface ReplaceUsageFormGroup {
  replacementScheduleId: FormControl<string | null>;
}

export interface ReplaceUsageResult {
  replacementScheduleId: string;
}

interface ReplaceUsageDialogData {
  schedule: WorkPositionScheduleDto;
  positionsCount: number;
}

@Component({
  selector: "app-work-position-schedule-replace-usage-form",
  templateUrl: "./work-position-schedule-replace-usage-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ReactiveFormsModule, CustomInputSelectSignal, WebButtonLabelSave, AppIcon],
})
export class WorkPositionScheduleReplaceUsageForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  schedules = signal<WorkPositionScheduleDto[]>([]);

  private dialogData = (this.config.data ?? {}) as Partial<ReplaceUsageDialogData>;
  protected readonly schedule = this.dialogData.schedule;
  protected readonly positionsCount = this.dialogData.positionsCount ?? 0;

  cb_replacementSchedules = computed<SelectItemDto[]>(() => {
    const excludedId = this.schedule?.id;
    return this.schedules()
      .filter((s) => s.isActive && s.id !== excludedId)
      .map((s) => ({ label: s.name, value: s.id }));
  });
  hasReplacementOptions = computed(() => this.cb_replacementSchedules().length > 0);

  form: FormGroup<ReplaceUsageFormGroup> = this.formB.group({
    replacementScheduleId: new FormControl<string | null>(null, {
      validators: [Validators.required],
      nonNullable: false,
    }),
  });

  ngOnInit(): void {
    void this.loadSchedules();
  }

  private async loadSchedules(): Promise<void> {
    const data = await this.apiResponseS.onGetList<WorkPositionScheduleDto[]>(
      Endpoints.Catalogs.WorkPositionSchedule.getAll,
    );
    if (data) this.schedules.set(data);
  }

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) return;
    const replacementScheduleId = this.form.controls.replacementScheduleId.value;
    if (!replacementScheduleId) return;

    this.submitting.set(true);
    this.ref.close({ replacementScheduleId } satisfies ReplaceUsageResult);
  }

  onCancel(): void {
    this.ref.close();
  }
}
