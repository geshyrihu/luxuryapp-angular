import { Component, input, output } from "@angular/core";
import { CustomButton } from "src/app/core/components/web/buttons/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/web/buttons/custom-button-view-pdf";
@Component({
  selector: "app-file-section",
  templateUrl: "./file-section.html",
  imports: [CustomButtonViewPdf, CustomButton],
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










