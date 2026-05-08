import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonViewPdf } from "src/app/core/components/buttons/web/custom-button-view-pdf";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { IUpdateDescription } from "src/app/core/interfaces/update-description.interface";
import { IUploadEvent } from "src/app/core/interfaces/upload-event.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-presupuesto-edition-file",
  templateUrl: "./presupuesto-edition-file.html",
  imports: [
    CommonModule,
    TableModule,
    CustomButtonViewPdf,
    CustomButton,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    CustomInputTextAreaSignal,
    FileUploadModule,
    CardModule,
  ],
})
export class PresupuestoEditionFile implements OnInit {
  customToastService = inject(CustomToastService);
  config = inject(DynamicDialogConfig);
  apiResponseS = inject(ApiResponseService);
  id = this.config.data.id;
  url: string = `${environment.API_BASE_URL}Cuentas/SetDocuments/${this.id}`;
  uploadedFiles: any[] = [];
  data: any[] = [];

  description: string = "";

  presupuestoDetalleSoporteId: string = "";
  files: any[] = [];

  ngOnInit(): void {
    this.onGetDescription();
    this.onGetFiles();
  }
  onUpload(event: IUploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.onGetFiles();
  }

  onGetDescription() {
    this.apiResponseS
      .onGetItem(`Cuentas/Description/${this.id}`)
      .then((result: any) => {
        this.description = result.description;
        this.presupuestoDetalleSoporteId = result.id;
      });
  }
  onGetFiles() {
    this.apiResponseS
      .onGetList(`Cuentas/SoporteFileList/${this.id}`)
      .then((result: any) => {
        this.files = result;
      });
  }
  onSetDescription() {
    const data: IUpdateDescription = {
      description: this.description,
      id: this.presupuestoDetalleSoporteId,
    };

    this.apiResponseS.onPut(`Cuentas/UpdateDescription`, data);
  }

  // Función para eliminar un archivo
  onDeleteFile(id: any) {
    this.apiResponseS.onDelete(`Cuentas/File/${id}`).then((result: boolean) => {
      // if (result) this.data = this.data.filter((item) => item.id !== id);
      if (result) {
        // Eliminar solo el registro afectado en lugar de toda la lista
        // Supongamos que has recibido la respuesta HTTP y tienes el `id` del archivo a eliminar
        const deleteRecordId = id; // Reemplaza 123 con el ID real del archivo que deseas eliminar
        // Encuentra el óndice del registro a eliminar en la lista
        const recordIndex = this.files.findIndex(
          (record) => record.id === deleteRecordId,
        );
        if (recordIndex !== -1) {
          // Si se encuentra el registro, elimónalo de la lista
          this.files.splice(recordIndex, 1);
        }
      }
    });
    // Mostrar un mensaje de carga
  }
}









