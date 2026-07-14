import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  viewChild,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import heic2any from "heic2any";
import { AvatarModule } from "primeng/avatar";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { ImageAnalysisDialogComponent } from "src/app/shared/ui/image-analysis-dialog/image-analysis-dialog.component";
import { TaskGroupService } from "../task.service";

@Component({
  selector: "app-my-task-form",
  templateUrl: "./my-task-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabel,
    WebButtonLabelSave,
    AvatarModule,
    ImageAnalysisDialogComponent,
    LxFileUpload,
    AppIcon,
  ],
})
export class MyTaskForm implements OnInit {
  visionDialog = viewChild.required(ImageAnalysisDialogComponent);

  private customerIdS = inject(CustomerIdService);
  private authS = inject(AuthService);
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private TaskGroupService = inject(TaskGroupService);
  private customToastS = inject(CustomToastService);
  // notificationPushService = inject(SignalRService);
  private enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);

  processingBeforeWork = signal(false);
  processingAfterWork = signal(false);
  cb_priority = signal<SelectItemDto[]>([]);
  cb_ticket_group = signal<SelectItemDto[]>([]);

  form = this.formB.nonNullable.group({
    id: [{ value: "", disabled: true }],
    ticketGroupId: [this.config.data.ticketGroupId, Validators.required], // ticketGroupId
    title: ["", [Validators.required, Validators.maxLength(100)]], // Tútulo
    description: ["", [Validators.required, Validators.maxLength(150)]], // Descripción
    priority: [1, Validators.required], // Prioridad (enum)
    creatorId: [this.authS.applicationUserId], // Id del creador
    customerId: [this.customerIdS.customerId()], // Id del cliente
    beforeWork: [null], // Imagen del trabajo previo
    afterWork: [null], // Imagen del trabajo posterior
    beforeWorkPreview: [""], // Vista previa de BeforeWork, string
    afterWorkPreview: [""], // Vista previa de AfterWork, string
    applicationUserId: [this.authS.applicationUserId],
    assignee: [""],
    assigneeId: [null],
    scheduledDate: [null],
    closedDate: [null],
  });

  async ngOnInit() {
    await this.onLoadSelectItems();
    this.id = this.config.data.id;
    this.form.controls.id.setValue(this.id);
    if (this.id !== "") this.onLoadData();
  }

  async onLoadSelectItems(): Promise<void> {
    const [priority, ticketGroups] = await Promise.all([
      firstValueFrom(this.enumSelectS.priorityLevel()),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.Tasks.groupListByCustomer(this.customerIdS.customerId()),
      ),
    ]);

    this.cb_priority.set(priority);
    this.cb_ticket_group.set(ticketGroups ?? []);
  }

  onFilesChange(files: File[], fieldName: "beforeWork" | "afterWork") {
    if (files.length === 0) {
      this.form.get(fieldName)?.setValue(null);
      if (fieldName === "beforeWork")
        this.form.controls.beforeWorkPreview.setValue("");
      else this.form.controls.afterWorkPreview.setValue("");
    }
  }

  async onFileSelect(event: any, fieldName: "beforeWork" | "afterWork") {
    const file: File = event.files[0];
    if (!file) return;

    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/heic",
      "image/heif",
    ];
    const isHeic =
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    if (!isHeic && !allowed.includes(file.type)) {
      this.customToastS.showError(
        "Formato no compatible",
        `Solo se permiten JPG, PNG, WebP o HEIC. El archivo "${file.name}" no puede cargarse.`,
      );
      return;
    }

    const processingSignal =
      fieldName === "beforeWork"
        ? this.processingBeforeWork
        : this.processingAfterWork;
    processingSignal.set(true);

    try {
      let fileToProcess = file;

      if (isHeic) {
        try {
          const buffer = await file.arrayBuffer();
          const heicBlob = new Blob([buffer], {
            type: file.type || "image/heic",
          });

          const convertedBlob = await heic2any({
            blob: heicBlob,
            toType: "image/jpeg",
            quality: 0.9,
          });
          const resultBlob = Array.isArray(convertedBlob)
            ? convertedBlob[0]
            : convertedBlob;
          const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
          fileToProcess = new File([resultBlob], newFileName, {
            type: "image/jpeg",
          });
        } catch (heicError) {
          console.warn(
            "heic2any falló al analizar el archivo, intentando como fallback nativo...",
            heicError,
          );
        }
      }

      const processed = await this.compressToMaxSize(
        fileToProcess,
        2 * 1024 * 1024,
      );
      this.form.get(fieldName)?.setValue(processed);

      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === "beforeWork")
          this.form.controls.beforeWorkPreview.setValue(
            reader.result as string,
          );
        else
          this.form.controls.afterWorkPreview.setValue(reader.result as string);
      };
      reader.readAsDataURL(processed);
    } catch {
      this.customToastS.showError(
        "Error al procesar imagen",
        "No se pudo procesar o comprimir la imagen. Intenta con otro archivo.",
      );
    } finally {
      processingSignal.set(false);
    }
  }

  private compressToMaxSize(file: File, maxBytes: number): Promise<File> {
    if (file.size <= maxBytes) return Promise.resolve(file);

    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        let w = img.naturalWidth;
        let h = img.naturalHeight;

        const MAX_DIM = 4000;
        if (w > MAX_DIM || h > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / w, MAX_DIM / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }

        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);

        const baseName = file.name.replace(/\.[^.]+$/, "");
        const outName = `${baseName}.jpg`;

        const tryQuality = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Canvas toBlob failed"));
                return;
              }
              if (blob.size <= maxBytes || quality <= 0.1) {
                resolve(new File([blob], outName, { type: "image/jpeg" }));
              } else {
                tryQuality(+(quality - 0.1).toFixed(1));
              }
            },
            "image/jpeg",
            quality,
          );
        };

        tryQuality(0.9);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Image load failed"));
      };
      img.src = url;
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.Tasks.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
        // Si las imígenes existen, carga las vistas previas
        if (result.beforeWorkPreview) {
          this.form.controls.beforeWorkPreview.setValue(
            result.beforeWorkPreview,
          );
          // Limpiar el form control real para que lx-file-upload no trate de leer la URL como File
          this.form.controls.beforeWork.setValue(null);
        }

        if (result.afterWorkPreview) {
          this.form.controls.afterWorkPreview.setValue(result.afterWorkPreview);
          this.form.controls.afterWork.setValue(null);
        }

        this.form.patchValue({
          applicationUserId: this.authS.applicationUserId,
        });
      });
  }

  openVision() {
    this.visionDialog().show();
  }

  onVisionResult(analysis: string) {
    const currentDesc = this.form.controls.description.value || "";
    const newDesc = currentDesc
      ? `${currentDesc}\n\n--- Análisis IA ---\n${analysis}`
      : `--- Análisis IA ---\n${analysis}`;

    this.form.controls.description.setValue(newDesc);
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submitting.set(true);

      const formData = new FormData();

      const rawValues = this.form.getRawValue() as any;

      // Agrega todos los controles del formulario a FormData
      Object.keys(rawValues).forEach((key) => {
        const value = rawValues[key];

        if (key === "images") {
          // Should be FormArray check if used? Re-add if missing from logic but it wasn't in form definition before? Wait, line 140 checks key === "images" but it wasn't in form group. I will keep it logic wise if added dynamically or keep strict based on form.
          // Original form didn't have 'images' in group definition, so keys(controls) wouldn't iterate it unless added dynamically. Assuming static structure first.
        } else if (key === "beforeWork" || key === "afterWork") {
          // Manejar las imígenes de beforeWork y afterWork
          const file = value as File;
          if (file) {
            formData.append(key, file, file.name);
          }
        } else if (key === "scheduledDate" || key === "closedDate") {
          // Manejar la fecha programada (ScheduledDate) y la fecha de cierre (ClosedDate)
          if (value) {
            const formattedDate = new Date(value).toISOString().split("T")[0]; // Formato 'YYYY-MM-DD'
            formData.append(key, formattedDate);
          } else {
            formData.append(key, ""); // Si no hay valor, se envía como vacóo
          }
        } else {
          // Verifica si el valor es null antes de agregarlo a FormData
          const val = value === null ? "" : value;
          formData.append(key, val);
        }
      });

      // Verifica si es creación o actualización
      if (this.id === "") {
        this.apiResponseS
          .onPost(Endpoints.Tasks.create, formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : this.submitting.set(false);
          });
      } else {
        this.apiResponseS
          .onPut(Endpoints.Tasks.update(this.id), formData)
          .then((result: boolean) => {
            result ? this.ref.close(true) : this.submitting.set(false);
          });
      }
    }
  }
}
