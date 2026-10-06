import { ButtonWeb } from "@ui/buttons/web";
import { Component, output, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-task-report-actions",
  templateUrl: "./task-report-actions.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ButtonWeb, ],
})
export class TaskReportActions {
  previewClicked = output<void>();
  sendReportClicked = output<void>();
  onPreview(): void {
    this.previewClicked.emit();
  }

  onSendReport(): void {
    this.sendReportClicked.emit();
  }
}
