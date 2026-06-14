import { Component, output } from "@angular/core";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
@Component({
  selector: "app-task-report-actions",
  templateUrl: "./task-report-actions.html",
  imports: [CustomButton],
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
