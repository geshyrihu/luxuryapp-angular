import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
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

import heic2any from "heic2any";
import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LxFileUpload,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    WebButtonLabel,
    CustomInputCheckSignal,
    AppIcon,
  ],
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
  cb_priority = signal<SelectItemDto[]>([]);
  cb_ticket_group = signal<SelectItemDto[]>([]);
  cb_application_user = signal<SelectItemDto[]>([]);
  cb_legal_matter = signal<SelectItemDto[]>([]);
  cb_predecessors = signal<SelectItemDto[]>([]);

  // Signals para previews de imígenes
  beforeWorkPreview = signal<string | null>(null);
  afterWorkPreview = signal<string | null>(null);

  isLegalWorkGroup = signal(false);
  private workGroupLegalMap = new Map<string, boolean>();

  // Definición estricta del formulario
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
        // Garantizar que la capitalización (casing) coincida exactamente con la opción cargada
        const exactMatch = this.cb_ticket_group().find(
          (g) => String(g.value).toLowerCase() === ticketGroupId.toLowerCase(),
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
      this.apiResponseS.onGetList<SelectItemDto[]>(
        Endpoints.Tasks.participants(ticketGroupId),
      ),
      this.apiResponseS.onGetList<SelectItemDto[]>(
        Endpoints.Tasks.availablePredecessors(
          ticketGroupId,
          this.id || undefined,
        ),
      ),
    ]);
    this.cb_application_user.set(users as SelectItemDto[]);
    this.cb_predecessors.set(predecessors as SelectItemDto[]);
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
      ? this.cb_application_user().find(
          (item) => String(item.value) === assigneeId,
        )
      : null;

    this.form.patchValue({
      ...result,
      ticketGroupId: String(
        result.ticketGroupId || this.form.value.ticketGroupId,
      ),
      applicationUserId: this.authS.applicationUserId,
      assigneeId,
      assignee: selectedAssignee ? selectedAssignee.label : "",
      scheduledDate: result.scheduledDate
        ? result.scheduledDate.substring(0, 10)
        : null,
      closedDate: result.closedDate ? result.closedDate.substring(0, 10) : null,
      dependsOnTaskId: result.dependsOnTaskId ?? null,
    });

    if (result.beforeWorkPreview) {
      this.beforeWorkPreview.set(result.beforeWorkPreview);
      this.form.controls.beforeWork.setValue(null);
    }
    if (result.afterWorkPreview) {
      this.afterWorkPreview.set(result.afterWorkPreview);
      this.form.controls.afterWork.setValue(null);
    }
  }

  processingBeforeWork = signal(false);
  processingAfterWork = signal(false);

  async onFileSelect(
    event: any,
    fieldName: "beforeWork" | "afterWork",
  ): Promise<void> {
    const file = event.files?.[0];
    if (file) await this.onFileChange(file, fieldName);
  }

  onFilesChange(files: any[], fieldName: "beforeWork" | "afterWork"): void {
    if (!files.length) {
      this.form.get(fieldName)?.setValue(null);
      if (fieldName === "beforeWork") this.beforeWorkPreview.set(null);
      else this.afterWorkPreview.set(null);
    }
  }

  async onFileChange(
    file: File,
    fieldName: "beforeWork" | "afterWork",
  ): Promise<void> {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    const isHeic =
      /\.(heic|heif)$/i.test(file.name) ||
      file.type === "image/heic" ||
      file.type === "image/heif";

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
          // Convertir explócitamente a Blob puro a travós de arrayBuffer para evitar problemas de compatibilidad de la clase File con heic2any
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
            "heic2any fallé al analizar el archivo, intentando como fallback nativo...",
            heicError,
          );
          // Si falla, fileToProcess sigue siendo el archivo original.
          // En navegadores como Safari puede funcionar nativamente, o si era un JPG renombrado.
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
          this.beforeWorkPreview.set(reader.result as string);
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

  onTicketGroupChange(newValue: string) {
    const isLegal = this.workGroupLegalMap.get(newValue) ?? false;
    this.isLegalWorkGroup.set(isLegal);
    if (isLegal) this.loadLegalMatters();
    this.onLoadUsers(newValue);
  }

  onLegalMatterChange(value: any) {
    const selectedMatter = this.cb_legal_matter().find(
      (item) => String(item.value) === String(value),
    );
    this.form.patchValue({
      title: selectedMatter ? selectedMatter.label : "",
      isInternal: !!value,
    });
  }

  onAssigneeChange(value: any) {
    const selectedAssignee = this.cb_application_user().find(
      (item) => String(item.value) === String(value),
    );
    this.form.patchValue({
      assigneeId: value ? String(value) : "",
      assignee: selectedAssignee ? selectedAssignee.label : "",
    });
  }

  private async loadLegalMatters(): Promise<void> {
    if (this.cb_legal_matter().length > 0) return;
    const result = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      Endpoints.TaskLegal.selectForAddTicket,
    );
    this.cb_legal_matter.set(result as SelectItemDto[]);
  }

  openFollowUp() {
    this.dialogHandlerS.openDialog(
      TaskFollowup,
      { id: this.id },
      "Seguimiento de Ticket",
      this.dialogHandlerS.sizeLg,
    );
  }

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        this.id === ""
          ? Endpoints.Tasks.create
          : Endpoints.Tasks.update(this.id),
      method: this.id === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (rawValues) => {
        const formData = new FormData();

        Object.keys(rawValues).forEach((key) => {
          const value = (rawValues as any)[key];

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

        return formData;
      },
    });
  }
}
