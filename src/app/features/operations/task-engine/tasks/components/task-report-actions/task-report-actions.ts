import { Component, output } from "@angular/core";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
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

