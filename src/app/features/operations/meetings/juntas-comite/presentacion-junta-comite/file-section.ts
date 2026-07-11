import { Component, input, output } from "@angular/core";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";

@Component({
  selector: "app-file-section",
  templateUrl: "./file-section.html",
  imports: [
    WebButtonLabelConfirm,
    WebButtonIcon,WebButtonLabelViewPdf, WebButtonLabel],
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
