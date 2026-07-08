import {
  Component, ElementRef, forwardRef, ViewChild, ChangeDetectionStrategy
} from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { IonButton, IonIcon } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { cloudUploadOutline, trashOutline } from "ionicons/icons";
import { BaseIonicInput } from "../base/base-ionic-input";

@Component({
  selector: "ion-input-upload-pdf",
  imports: [BaseIonicInput, ReactiveFormsModule, IonButton, IonIcon],
  template: `
    <base-ionic-input
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [readonly]="readonly()"
      [required]="requiredInput()"
    >
      <div style="width: 100%; display: flex; flex-direction: column; gap: 8px;">
        @if (!fileValue) {
          <ion-button expand="block" mode="md" fill="outline" (click)="triggerFileInput()">
            <ion-icon slot="start" name="cloud-upload-outline"></ion-icon>
            Seleccionar PDF
          </ion-button>
        } @else {
          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--ion-color-step-50); padding: 8px; border-radius: 8px;">
            <span style="font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1;">
              {{ fileValue.name }}
            </span>
            <ion-button fill="clear" color="danger" size="small" (click)="removeFile()">
              <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
            </ion-button>
          </div>
        }
        <input #fileInput [id]="id()" type="file" accept=".pdf,application/pdf" (change)="onFileSelected($event)" hidden />
      </div>
    </base-ionic-input>
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => IonInputUploadPdf), multi: true },
  ],
})
export class IonInputUploadPdf extends BaseIonicInput {
  fileValue: File | null = null;

  @ViewChild("fileInput", { static: false }) fileInput!: ElementRef<HTMLInputElement>;

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
    this.fileValue = file;
    this.onChange(file);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(file);
    ctrl.markAsDirty();
  }

  removeFile(): void {
    this.fileValue = null;
    this.onChange(null);
    this.onTouch();
    const ctrl = this.control() || this.internalControl;
    ctrl.setValue(null);
  }

  override registerOnChange(fn: any): void { this.onChange = fn; }
  override registerOnTouched(fn: any): void { this.onTouch = fn; }
}
