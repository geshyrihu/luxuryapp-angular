import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { BaseInputSignal } from "../../base/base-input-signal";
import { CustomInputImg } from "../custom-input-img-signal";

@Component({
  selector: "web-input-img",

  imports: [BaseInputSignal, ReactiveFormsModule, CustomInputImg],
  template: `
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [horizontal]="horizontal()"
      [required]="requiredInput()"
      [hidden]="hidden()"
    >
      <custom-input-img-signal
        [control]="control()"
        [id]="id()"
        [label]="label()"
        [horizontal]="horizontal()"
        [required]="requiredInput()"
        [urlImgCurrent]="urlImgCurrent()"
        [title]="title()"
        [chooseLabel]="chooseLabel()"
        [maxFileSize]="maxFileSize()"
        [compressThreshold]="compressThreshold()"
        [compressionQuality]="compressionQuality()"
        [contentHeight]="contentHeight()"
        [contentWidth]="contentWidth()"
        (fileSelected)="fileSelected.emit($event)"
        (imageLoaded)="imageLoaded.emit($event)"
        (uploadError)="uploadError.emit($event)"
      />
    </base-input-signal>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WebInputImg),
      multi: true,
    },
  ],
})
export class WebInputImg extends BaseInputSignal {
  urlImgCurrent = input<string>("");
  title = input<string>("");
  chooseLabel = input<string>("Seleccionar imagen");
  maxFileSize = input<number>(15000000);
  compressThreshold = input<number>(2000000);
  compressionQuality = input<number>(0.75);
  contentHeight = input<number | string>(100);
  contentWidth = input<number | string>(150);

  fileSelected = output<File>();
  imageLoaded = output<string>();
  uploadError = output<any>();
}
