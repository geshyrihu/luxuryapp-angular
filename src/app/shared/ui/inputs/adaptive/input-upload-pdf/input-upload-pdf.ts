import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  inject,
  input,
  output,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { PlatformService } from "src/app/core/services/platform.service";
import { IonInputUploadPdf } from "../../mobile/ion-input-upload-pdf";
import { WebInputUploadPdf } from "../../web/input-upload-pdf/input-upload-pdf";

@Component({
  selector: "app-custom-input-upload-pdf-signal",

  imports: [WebInputUploadPdf, IonInputUploadPdf],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputUploadPdf),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    @if (platform.isMobile()) {
      <ion-input-upload-pdf
        [id]="id()"
        [label]="label()"
        [readonly]="readonly()"
        [required]="requiredInput()"
      />
    } @else {
      <web-input-upload-pdf
        [label]="label()"
        [maxFileSize]="maxFileSize()"
        [accept]="accept()"
        [chooseLabel]="chooseLabel()"
        [fileSelected]="fileSelected.emit($event)"
        [uploadError]="uploadError.emit($event)"
      />
    }
  `,
})
export class InputUploadPdf implements ControlValueAccessor {
  protected platform = inject(PlatformService);

  id = input<string>("");
  label = input<string>("");
  readonly = input<boolean>(false);
  requiredInput = input<boolean>(false);
  maxFileSize = input<number>(10000000);
  accept = input<string>(".pdf,application/pdf");
  chooseLabel = input<string>("Seleccionar PDF");

  fileSelected = output<File | null>();
  uploadError = output<any>();

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(obj: any): void {}
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
  setDisabledState?(isDisabled: boolean): void {}
}
