import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { firstValueFrom } from "rxjs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupService } from "src/app/features/tenant/tasks/task.service";
import { TaskFollowup } from "../../task-follow-up/pages/task-followup";

interface ITaskMessageForm {
  id: FormControl<string>;
  ticketGroupId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<number>;
  creatorId: FormControl<string>;
  customerId: FormControl<string>;
  beforeWork: FormControl<File | null>;
  afterWork: FormControl<File | null>;
  applicationUserId: FormControl<string>;
  assignee: FormControl<string>;
  assigneeId: FormControl<string>;
  scheduledDate: FormControl<Date | string | null>;
  closedDate: FormControl<Date | string | null>;
  isInternal: FormControl<boolean>;
  documentCloud: FormControl<boolean>;
  documentEmail: FormControl<boolean>;
  dependsOnTaskId: FormControl<string | null>;
}

import { DateService } from "src/app/core/services/date.service";
import heic2any from "heic2any";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    FileUploadModule,
    ButtonModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CustomButton,
    CustomInputCheckSignal,
   AppIcon],
})
export class TaskForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private customToastS = inject(CustomToastService);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService);
  private ref = inject(DynamicDialogRef);
  private TaskGroupService = inject(TaskGroupService);
  private formB = inject(FormBuilder);
  private dateS = inject(DateService);

  id: string = "";
  submitting = signal(false);

  // Signals para ComboBoxes
  cb_priority = signal<ISelectItem[]>([]);
  cb_ticket_group = signal<ISelectItem[]>([]);
  cb_application_user = signal<ISelectItem[]>([]);
  cb_legal_matter = signal<ISelectItem[]>([]);
  cb_predecessors = signal<ISelectItem[]>([]);

  // Signals para previews de imÃ³genes
  beforeWorkPreview = signal<string | null>(null);
  afterWorkPreview = signal<string | null>(null);

  isLegalWorkGroup = signal(false);
  private workGroupLegalMap = new Map<string, boolean>();

  // DefiniciÃ³n estricta del formulario
  form: FormGroup<ITaskMessageForm> = this.formB.group({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    ticketGroupId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    title: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(300)],
    }),
    priority: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    creatorId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
    }),
    customerId: new FormControl<string>(this.customerIdS.customerId(), {
      nonNullable: true,
    }),
    beforeWork: new FormControl<File | null>(null),
    afterWork: new FormControl<File | null>(null),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
    }),
    assignee: new FormControl<string>("", { nonNullable: true }),
    assigneeId: new FormControl<string>("", { nonNullable: true }),
    scheduledDate: new FormControl<Date | string | null>(null),
    closedDate: new FormControl<Date | string | null>(null),
    isInternal: new FormControl<boolean>(false, { nonNullable: true }),
    documentCloud: new FormControl<boolean>(false, { nonNullable: true }),
    documentEmail: new FormControl<boolean>(false, { nonNullable: true }),
    dependsOnTaskId: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id || "";

    // Sincronizar ID
    this.form.controls.id.setValue(this.id);

    await this.onLoadSelectItems();

    if (this.config.data?.ticketGroupId) {
      setTimeout(async () => {
        let ticketGroupId = String(this.config.data.ticketGroupId);
        // Garantizar que la capitalizaciÃ³n (casing) coincida exactamente con la opciÃ³n cargada
        const exactMatch = this.cb_ticket_group().find(
          (g) => String(g.value).toLowerCase() === ticketGroupId.toLowerCase()
        );
        if (exactMatch) ticketGroupId = String(exactMatch.value);

        // Actualizar el valor en el siguiente ciclo (setTimeout) para dar tiempo a que PrimeNG renderice las opciones
        this.form.patchValue({ ticketGroupId });

        const isLegal = this.workGroupLegalMap.get(ticketGroupId) ?? false;
        this.isLegalWorkGroup.set(isLegal);
        if (isLegal) await this.loadLegalMatters();
        await this.onLoadUsers(ticketGroupId);
      }, 0);
    }

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [priority, workGroups] = await Promise.all([
      firstValueFrom(this.enumSelectS.priorityLevel()),
      this.apiResponseS.onGetList<any[]>(
        Endpoints.TaskGroups.list(
          this.customerIdS.customerId(),
          true,
          this.authS.applicationUserId,
        ),
      ),
    ]);

    this.cb_priority.set(priority);
    this.cb_ticket_group.set(
      (workGroups ?? []).map((g) => ({ label: g.nameGroup, value: g.id })),
    );
    this.workGroupLegalMap = new Map(
      (workGroups ?? []).map((g) => [g.id, g.isLegalGroup ?? false]),
    );
  }

  async onLoadUsers(ticketGroupId: string): Promise<void> {
    const [users, predecessors] = await Promise.all([
      this.apiResponseS.onGetList<ISelectItem[]>(Endpoints.Tasks.participants(ticketGroupId)),
      this.apiResponseS.onGetList<ISelectItem[]>(
        Endpoints.Tasks.availablePredecessors(ticketGroupId, this.id || undefined),
      ),
    ]);
    this.cb_application_user.set(users as ISelectItem[]);
    this.cb_predecessors.set(predecessors as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Tasks.getById(this.id),
    );

    // Extraer assigneeId
    let assigneeId = "";
    if (result.assigneeId !== null && result.assigneeId !== undefined) {
      assigneeId =
        typeof result.assigneeId === "object" && result.assigneeId !== null
          ? (result.assigneeId as any).value
          : String(result.assigneeId);
    }

    // Buscar el usuario asignado completo
    const selectedAssignee = assigneeId
      ? this.cb_application_user().find((item) => String(item.value) === assigneeId)
      : null;

    this.form.patchValue({
      ...result,
      ticketGroupId: String(result.ticketGroupId || this.form.value.ticketGroupId),
      applicationUserId: this.authS.applicationUserId,
      assigneeId,
      assignee: selectedAssignee ? selectedAssignee.label : "",
      scheduledDate: result.scheduledDate
        ? result.scheduledDate.substring(0, 10)
        : null,
      closedDate: result.closedDate ? result.closedDate.substring(0, 10) : null,
      dependsOnTaskId: result.dependsOnTaskId ?? null,
    });

    // Vistas previas de imÃ³genes
    if (result.beforeWorkPreview) {
      this.beforeWorkPreview.set(result.beforeWorkPreview);
    }
    if (result.afterWorkPreview) {
      this.afterWorkPreview.set(result.afterWorkPreview);
    }
  }

  processingBeforeWork = signal(false);
  processingAfterWork = signal(false);

  async onFileChange(file: File | null, fieldName: "beforeWork" | "afterWork"): Promise<void> {
    if (!file) {
      this.form.get(fieldName)?.setValue(null);
      if (fieldName === "beforeWork") this.beforeWorkPreview.set(null);
      else this.afterWorkPreview.set(null);
      return;
    }

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const isHeic = /\.(heic|heif)$/i.test(file.name) ||
                   file.type === "image/heic" || file.type === "image/heif";

    if (!isHeic && !allowed.includes(file.type)) {
      this.customToastS.showError(
        "Formato no compatible",
        `Solo se permiten JPG, PNG, WebP o HEIC. El archivo "${file.name}" no puede cargarse.`,
      );
      return;
    }

    const processingSignal = fieldName === "beforeWork"
      ? this.processingBeforeWork
      : this.processingAfterWork;

    processingSignal.set(true);
    try {
      let fileToProcess = file;

      if (isHeic) {
        try {
          // Convertir explÃ­citamente a Blob puro a travÃ©s de arrayBuffer para evitar problemas de compatibilidad de la clase File con heic2any
          const buffer = await file.arrayBuffer();
          const heicBlob = new Blob([buffer], { type: file.type || "image/heic" });
          
          const convertedBlob = await heic2any({
            blob: heicBlob,
            toType: "image/jpeg",
            quality: 0.9
          });
          const resultBlob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
          fileToProcess = new File([resultBlob], newFileName, { type: "image/jpeg" });
        } catch (heicError) {
          console.warn("heic2any fallÃ³ al analizar el archivo, intentando como fallback nativo...", heicError);
          // Si falla, fileToProcess sigue siendo el archivo original. 
          // En navegadores como Safari puede funcionar nativamente, o si era un JPG renombrado.
        }
      }

      const processed = await this.compressToMaxSize(fileToProcess, 2 * 1024 * 1024);
      this.form.get(fieldName)?.setValue(processed);
      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === "beforeWork") this.beforeWorkPreview.set(reader.result as string);
        else this.afterWorkPreview.set(reader.result as string);
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
          canvas.toBlob((blob) => {
            if (!blob) { reject(new Error("Canvas toBlob failed")); return; }
            if (blob.size <= maxBytes || quality <= 0.1) {
              resolve(new File([blob], outName, { type: "image/jpeg" }));
            } else {
              tryQuality(+(quality - 0.1).toFixed(1));
            }
          }, "image/jpeg", quality);
        };

        tryQuality(0.9);
      };

      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
      img.src = url;
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onFileDrop(event: DragEvent, fieldName: "beforeWork" | "afterWork") {
    event.preventDefault();
    const file = event.dataTransfer?.files[0] ?? null;
    this.onFileChange(file, fieldName);
  }

  onTicketGroupChange(newValue: string) {
    const isLegal = this.workGroupLegalMap.get(newValue) ?? false;
    this.isLegalWorkGroup.set(isLegal);
    if (isLegal) this.loadLegalMatters();
    this.onLoadUsers(newValue);
  }

  onLegalMatterChange(value: any) {
    const selectedMatter = this.cb_legal_matter().find(
      (item) => String(item.value) === String(value)
    );
    this.form.patchValue({
      title: selectedMatter ? selectedMatter.label : "",
      isInternal: !!value,
    });
  }

  onAssigneeChange(value: any) {
    const selectedAssignee = this.cb_application_user().find(
      (item) => String(item.value) === String(value)
    );
    this.form.patchValue({
      assigneeId: value ? String(value) : "",
      assignee: selectedAssignee ? selectedAssignee.label : "",
    });
  }

  private async loadLegalMatters(): Promise<void> {
    if (this.cb_legal_matter().length > 0) return;
    const result = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.TaskLegal.selectForAddTicket,
    );
    this.cb_legal_matter.set(result as ISelectItem[]);
  }

  openFollowUp() {
    this.dialogHandlerS.openDialog(
      TaskFollowup,
      { id: this.id },
      "Seguimiento de Ticket",
      this.dialogHandlerS.sizeLg,
    );
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formData = new FormData();
    const rawValues = this.form.getRawValue() as any;

    Object.keys(rawValues).forEach((key) => {
      const value = rawValues[key];

      if (key === "beforeWork" || key === "afterWork") {
        const file = value as File;
        if (file && file instanceof File) {
          formData.append(key, file, file.name);
        }
      } else if (key === "scheduledDate" || key === "closedDate") {
        if (value) {
          const formattedDate = this.dateS.getDateFormat(value);
          formData.append(key, formattedDate);
        }
      } else if (key === "dependsOnTaskId") {
        if (value) formData.append(key, value);
      } else if (key !== "assignee") {
        formData.append(key, value != null ? value : "");
      }
    });

    const request =
      this.id === ""
        ? this.apiResponseS.onPost(Endpoints.Tasks.create, formData)
        : this.apiResponseS.onPut(Endpoints.Tasks.update(this.id), formData);

    request.then((result: any) => {
      if (result) {
        this.ref.close(result);
      } else {
        this.submitting.set(false);
      }
    });
  }
}

