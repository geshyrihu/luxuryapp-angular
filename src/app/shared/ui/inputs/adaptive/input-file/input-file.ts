import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { BaseInputSignal } from "../../base/base-input-signal";
import { IonInputFile } from "../../mobile/ion-input-file";
import { WebInputFile } from "../../web/input-file/input-file";

@Component({
  selector: "custom-input-file-signal",

  imports: [WebInputFile, IonInputFile],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFile),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-file
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [chooseLabel]="chooseLabel()"
        (fileSelected)="onFileSelected($event)"
        (uploadError)="onUploadError($event)"
      />
    } @else {
      <web-input-file
        [control]="control() || internalControl"
        [id]="id()"
        [label]="label()"
        [placeholder]="placeholder()"
        [horizontal]="horizontal()"
        [readonly]="readonly()"
        [disabled]="disabled()"
        [required]="requiredInput()"
        [noMargin]="noMargin()"
        [description]="description()"
        [hidden]="hidden()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [chooseLabel]="chooseLabel()"
        (fileSelected)="onFileSelected($event)"
      />
    }
  `,
})
export class InputFile extends BaseInputSignal {
  protected platform = inject(PlatformService);

  accept = input<string>("");
  maxFileSize = input<number>(10000000);
  chooseLabel = input<string>("Seleccionar archivo");
  fileSelected = output<File | null>();
  uploadError = output<any>();

  onFileSelected(event: File | null): void {
    this.fileSelected.emit(event);
  }

  onUploadError(event: any): void {
    this.uploadError.emit(event);
  }
}
