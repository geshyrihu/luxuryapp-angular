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
} from "@angular/forms";
import { ApiResponseService } from "@core/http/services/api-response.service";
import { TaskInstance } from "@core/interfaces/recurring-tasks/task-instance.interface";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { ButtonWeb } from "@ui/buttons/web";
import { LuxInputTextAreaSignal } from "@ui/inputs/web/lux-input-textarea-signal";

interface ICompleteTaskForm {
  comments: FormControl<string>;
  attachments: FormControl<any[]>;
}

@Component({
  selector: "app-complete-task-form",
  templateUrl: "./complete-task-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    LuxInputTextAreaSignal,
    LxFileUpload,
    ButtonWeb,
  ],
})
export class CompleteTaskForm implements OnInit {
  private formBuilder = inject(FormBuilder);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  // private recurringTasksService = inject(RecurringTasksService); // REMOVED
  private apiResponseS = inject(ApiResponseService);
  submitting = signal(false);
  form: FormGroup<ICompleteTaskForm>;
  task: TaskInstance;
  selectedFiles = signal<File[]>([]);

  ngOnInit(): void {
    this.task = this.config.data?.task;
    this.form = this.formBuilder.group({
      comments: new FormControl("", { nonNullable: true }),
      attachments: new FormControl<any[]>([], { nonNullable: true }),
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles.set(event.files ?? []);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);

    const formData = new FormData();
    formData.append("comments", this.form.value.comments ?? "");
    for (const file of this.selectedFiles()) {
      formData.append("attachments", file);
    }

    this.apiResponseS
      .onPostFile<any>(
        `recurring-tasks/instances/${this.task.id}/complete`,
        formData,
      )
      .then((result) => {
        if (result) {
          this.ref.close(true);
        }
      })
      .finally(() => this.submitting.set(false));
  }
}
