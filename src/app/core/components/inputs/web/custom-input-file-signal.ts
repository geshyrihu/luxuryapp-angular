import { Component, forwardRef, input, output } from "@angular/core";
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { FileUploadModule } from "primeng/fileupload";
// import { CustomButtonDelete } from "../../buttons/web/custom-button-delete";
import { CustomButtonDelete } from "../../web/buttons";
import { BaseInputSignal } from "../base/base-input-signal";
// 📁 COMPONENTE DE INPUT DE ARCHIVO
// Un componente para seleccionar archivos usando PrimeNG FileUpload.
@Component({
  selector: "custom-input-file-signal",
  imports: [
    BaseInputSignal,
    ReactiveFormsModule,
    FileUploadModule,
    ButtonModule,
    CustomButtonDelete,
  ],
  template: `
    <!-- 🏗️ ESTRUCTURA BASE -->
    <base-input-signal
      [control]="control()"
      [id]="id()"
      [label]="label()"
      [placeholder]="placeholder()"
      [horizontal]="horizontal()"
      [disabled]="disabled()"
    >
      <!-- 🚀 CONTENIDO PROYECTADO -->
      <p-fileUpload
        styleClass="w-full"
        chooseStyleClass="w-full"
        [id]="id()"
        mode="basic"
        [chooseLabel]="chooseLabel()"
        [accept]="accept()"
        [maxFileSize]="maxFileSize()"
        [disabled]="disabled()"
        [auto]="true"
        (onSelect)="onFileSelected($event)"
        (onClear)="removeFile()"
        [showUploadButton]="false"
        [showCancelButton]="false"
      />

      @if (fileSelectedValue) {
        <div class="file-info">
          <span class="file-details">
            {{ fileSelectedValue.name }} ({{
              formatFileSize(fileSelectedValue.size)
            }})
          </span>

          <custom-button-delete
            [disabled]="disabled()"
            (confirmed)="removeFile()"
          />
        </div>
      }
    </base-input-signal>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      /* Ensures the PrimeNG FileUpload component and its button take full width */
      :host ::ng-deep .p-fileupload-basic {
        width: 100%;
        display: block; /* Ensure it behaves like a block element */
      }

      :host ::ng-deep .p-fileupload-basic .p-button {
        width: 100%;
        display: flex; /* Makes the button content (icon/label) align properly */
        justify-content: center; /* Center the content inside the button */
      }

      .file-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        margin-top: 0.75rem;
        padding: 0.75rem;
        background-color: var(--ds-bg-sunken);
        border-radius: var(--ds-radius-card);
        width: 100%;
      }

      .file-details {
        font-size: 0.875rem;
        color: var(--ds-text-primary);
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputFile),
      multi: true,
    },
  ],
})
export class CustomInputFile extends BaseInputSignal {
  // 🎨 PROPIEDADES ADICIONALES
  accept = input<string>("");
  maxFileSize = input<number>(10000000); // 10MB por defecto
  chooseLabel = input<string>("Seleccionar archivo");
  // 📤 EVENTO DE SALIDA
  fileSelected = output<File | null>();

  // 📂 LÓGICA DE ARCHIVO
  fileSelectedValue: File | null = null;

  // Se ejecuta cuando se selecciona un archivo.
  onFileSelected(event: any): void {
    if (!event.files || event.files.length === 0) return;

    this.fileSelectedValue = event.files[0];
    const ctrl = this.control() || this.internalControl;
    if (ctrl) {
      ctrl.setValue(this.fileSelectedValue);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
    this.fileSelected.emit(this.fileSelectedValue);
    this.onChange(this.fileSelectedValue);
    this.onTouch();
  }

  // Elimina el archivo seleccionado.
  removeFile(): void {
    this.fileSelectedValue = null;
    const ctrl = this.control() || this.internalControl;
    if (ctrl) {
      ctrl.setValue(null);
      ctrl.markAsDirty();
      ctrl.markAsTouched();
    }
    this.fileSelected.emit(null);
    this.onChange(null);
    this.onTouch();
  }

  // Formatea el tamaño del archivo para mostrarlo en la interfaz.
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
