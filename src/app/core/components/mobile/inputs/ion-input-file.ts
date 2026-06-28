import {
  Component,
  computed,
  ElementRef,
  forwardRef,
  input,
  output,
  ViewChild,
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cloudUploadOutline, trashOutline } from "ionicons/icons";
import { BaseIonicInput } from "../../inputs/base/base-ionic-input";

@Component({
  selector: "ion-input-file",
  imports: [BaseIonicInput, ReactiveFormsModule, IonButton, IonIcon],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [readonly]="readonly()"
      [required]="requiredInput()"
      [hidden]="hidden()"
      [description]="description()"
      [horizontal]="horizontal()"
      [noMargin]="noMargin()"
      [onlyInput]="onlyInput()"
      [class]="inputStyleClass()"
    >
      <div
        style="width: 100%; display: flex; flex-direction: column; gap: 8px;"
      >
        @if (!fileSelectedValue) {
          <ion-button
            expand="block"
            fill="outline"
            [disabled]="disabled() || readonly()"
            (click)="triggerFileInput()"
          >
            <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
            {{ chooseLabel() }}
          </ion-button>
        } @else {
          <div
            style="display: flex; justify-content: space-between; align-items: center; background: var(--ion-color-step-50, #f4f5f8); padding: 8px; border-radius: 8px;"
          >
            <span
              style="font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;"
            >
              {{ fileSelectedValue.name }} ({{
                formatFileSize(fileSelectedValue.size)
              }})
            </span>
            <ion-button
              fill="clear"
              color="danger"
              size="small"
              (click)="removeFile()"
              [disabled]="disabled() || readonly()"
            >
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </div>
        }

        <input
          #fileInput
          [id]="id()"
          type="file"
          [accept]="accept()"
          (change)="onFileSelected($event)"
          hidden
        />
      </div>
    </base-ionic-input>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IonInputFile),
      multi: true,
    },
  ],
})
export class IonInputFile extends BaseIonicInput {
  accept = input<string>("");
  maxFileSize = input<number>(10000000);
  chooseLabel = input<string>("Seleccionar archivo");
  customClass = input<string>("");

  fileSelected = output<File | null>();
  uploadError = output<any>();

  fileSelectedValue: File | null = null;

  inputStyleClass = computed(() => this.customClass());

  @ViewChild("fileInput", { static: false })
  fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    super();
    addIcons({ cloudUploadOutline, trashOutline });
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    input.value = "";
    if (!file) return;

    if (file.size > this.maxFileSize()) {
      const error = new Error(
        `El archivo excede el tamaño máximo de ${this.maxFileSize() / 1000000} MB`,
      );
      this.uploadError.emit(error);
      return;
    }

    this.fileSelectedValue = file;
    this.fileSelected.emit(file);
    this.onChange(file);
    this.onTouch();

    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(file);
    ctrl.markAsDirty();
  }

  removeFile(): void {
    this.fileSelectedValue = null;
    this.fileSelected.emit(null);
    this.onChange(null);
    this.onTouch();

    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(null);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  override registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  override registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
