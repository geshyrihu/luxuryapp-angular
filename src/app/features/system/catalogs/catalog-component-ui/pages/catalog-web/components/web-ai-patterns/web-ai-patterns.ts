import { CommonModule } from "@angular/common";
import { Component, ViewChild } from "@angular/core";
import { CardModule } from "primeng/card";
import { DividerModule } from "primeng/divider";
import { ButtonModule } from "primeng/button";
import { DialogSize } from "src/app/core/enums/dialog-size";
import { AiChatWidget } from "src/app/shared/components/ai-chat-widget/ai-chat-widget";
import { ImageAnalysisDialogComponent } from "src/app/shared/components/image-analysis-dialog/image-analysis-dialog.component";

@Component({
  selector: "app-web-ai-patterns",
  imports: [
    CommonModule,
    CardModule,
    DividerModule,
    ButtonModule,
    AiChatWidget,
    ImageAnalysisDialogComponent
  ],
  templateUrl: "./web-ai-patterns.html",
})
export class WebAiPatterns {
  @ViewChild('aiDialog') aiDialog!: ImageAnalysisDialogComponent;

  openImageAnalysis() {
    this.aiDialog.show();
  }
}
