import { Component, input, output } from "@angular/core";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "src/app/core/components/buttons/web-label/button-view-pdf";
@Component({
  selector: "app-file-section",
  templateUrl: "./file-section.html",
  imports: [WebButtonLabelViewPdf, WebButtonLabel],
})
export class FileSection {
  title = input<string>();
  fileUrl = input<string>();
  user = input<string>();
  uploadDate = input<string>();
  roles = input<string[]>();
  canEdit = input<boolean>(false);
  canDelete = input<boolean>(false);
  isFinal = input<boolean>(false);
  onEdit = output<void>();
  onDelete = output<void>();
  onUpload = output<void>();
}
