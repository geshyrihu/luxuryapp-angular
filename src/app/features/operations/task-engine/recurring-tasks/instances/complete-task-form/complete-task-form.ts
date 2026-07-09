import { Component, OnInit, inject, signal, ChangeDetectionStrategy } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { TaskInstance } from "src/app/core/models/recurring-tasks/task-instance.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";

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
    CustomInputTextAreaSignal,
    LxFileUpload,
    WebButtonLabelSave,
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
      .onPostFile<any>(`recurring-tasks/instances/${this.task.id}/complete`, formData)
      .then((result) => {
        if (result) {
          this.ref.close(true);
        }
      })
      .finally(() => this.submitting.set(false));
  }
}
