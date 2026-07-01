import { Component, output } from "@angular/core";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
@Component({
  selector: "app-task-report-actions",
  templateUrl: "./task-report-actions.html",
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
