import {
  Component, ElementRef, forwardRef, ViewChild, ChangeDetectionStrategy, effect, input, output
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon, IonImg } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cameraOutline, trashOutline } from "ionicons/icons";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-img",
  imports: [BaseIonicInput, ReactiveFormsModule, IonButton, IonIcon, IonImg],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <div class="w-full flex flex-column gap-2 align-items-center">
        @if (!imageUrl) {
          <ion-button expand="block" mode="md" fill="outline" (click)="triggerFileInput()" class="w-full">
            <ion-icon slot="start" name="camera-outline"></ion-icon>
            Seleccionar imagen
          </ion-button>
        } @else {
          <div class="flex flex-column gap-1 w-15rem align-items-center">
            <ion-img [src]="imageUrl" class="w-full h-10rem rounded shadow-sm object-cover" />
            <ion-button fill="clear" color="danger" size="small" (click)="removeFile()">
              <ion-icon slot="start" name="trash-outline"></ion-icon>
              Eliminar
            </ion-button>
          </div>
        }
        <input #fileInput [id]="id()" type="file" accept="image/*" (change)="onFileSelected($event)" hidden />
      </div>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputImg), multi: true },
  ],
})
export class IonInputImg extends BaseIonicInput {
  urlImgCurrent = input<string>("");
  fileSelected = output<File>();
  imageUrl: string | null = null;

  @ViewChild("fileInput", { static: false }) fileInput!: ElementRef<HTMLInputElement>;

  constructor() {
    super();
    addIcons({ cameraOutline, trashOutline });
    effect(() => {
      const url = this.urlImgCurrent();
      if (url && !this.imageUrl) {
        this.imageUrl = url;
      }
    });
  }

  triggerFileInput(): void {
    this.fileInput?.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    this.imageUrl = URL.createObjectURL(file);
    this.onChange(file);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(file);
    ctrl.markAsDirty();
    this.fileSelected.emit(file);
  }

  removeFile(): void {
    if (this.imageUrl) URL.revokeObjectURL(this.imageUrl);
    this.imageUrl = null;
    this.onChange(null);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(null);
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
