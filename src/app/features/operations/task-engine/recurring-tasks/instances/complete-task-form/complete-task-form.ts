import { Component, OnInit, inject, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { TaskInstance } from "src/app/core/models/recurring-tasks/task-instance.model";
import { ApiResponseService } from "src/app/core/services/api-response.service";

interface ICompleteTaskForm {
  comments: FormControl<string>;
  attachments: FormControl<any[]>;
}

@Component({
  selector: "app-complete-task-form",
  templateUrl: "./complete-task-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextAreaSignal,
    FileUploadModule,
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

  ngOnInit(): void {
    this.task = this.config.data?.task;
    this.form = this.formBuilder.group({
      comments: new FormControl("", { nonNullable: true }),
      attachments: new FormControl<any[]>([], { nonNullable: true }), // For handling file uploads
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.submitting.set(true);

    const dto = {
      comments: this.form.value.comments,
    };

    this.apiResponseS
      .onPost<any>(`recurring-tasks/instances/${this.task.id}/complete`, dto)
      .then((result) => {
        if (result) {
          // result is T | false, so true means success
          this.ref.close(true);
        }
        // No else needed, error handling and toasts are done by ApiResponseService
      })
      .finally(() => this.submitting.set(false));
  }
}
