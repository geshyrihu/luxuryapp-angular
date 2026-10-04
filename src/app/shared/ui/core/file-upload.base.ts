import { Directive, input, output } from "@angular/core";

export interface FileUploadEvent {
  files: File[];
  originalEvent: Event;
}

export interface UploadFile {
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  objectURL?: string;
}

@Directive()
export abstract class FileUploadBase {
  styleClass = input<string>("");
  chooseLabel = input("Seleccionar archivos");
  accept = input<string>("");
  maxFileSize = input<number>(10000000);
  multiple = input<boolean>(true);
  autoUpload = input<boolean>(true);
  mobileSource = input<"camera" | "gallery" | "both" | "none">("both");
  filesChange = output<UploadFile[]>();
  upload = output<FileUploadEvent>();
  onSelect = output<any>();
}
