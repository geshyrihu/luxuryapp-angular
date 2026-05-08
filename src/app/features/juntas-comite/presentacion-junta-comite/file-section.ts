import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
@Component({
  selector: "app-file-section",
  templateUrl: "./file-section.html",
  imports: [CustomButtonViewPdf, CustomButton],
})
export class FileSection {
  @Input() title: string;
  @Input() fileUrl: string;
  @Input() user: string;
  @Input() uploadDate: string;
  @Input() roles: string[];
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  @Input() isFinal: boolean = false;
  @Output() onEdit = new EventEmitter<void>();
  @Output() onDelete = new EventEmitter<void>();
  @Output() onUpload = new EventEmitter<void>();
}









