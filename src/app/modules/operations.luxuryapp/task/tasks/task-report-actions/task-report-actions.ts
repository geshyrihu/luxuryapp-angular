import { Component, output, ChangeDetectionStrategy } from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
@Component({
  selector: "app-task-report-actions",
  templateUrl: "./task-report-actions.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [WebButtonLabel],
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
