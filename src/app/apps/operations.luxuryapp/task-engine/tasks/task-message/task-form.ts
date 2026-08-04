import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { LxProcessingOverlay } from "@ui/adaptive/processing-overlay/processing-overlay";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { firstValueFrom } from "rxjs";
import { TaskGroupService } from "src/app/apps/operations.luxuryapp/task-engine/tasks/task.service";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskFollowup } from "../task-follow-up/task-followup";

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

type ImageFieldName = "beforeWork" | "afterWork";

import { DateService } from "src/app/core/services/date.service";
import { ClientErrorLoggerService } from "src/app/core/services/client-error-logger.service";
import { ImageProcessingService } from "src/app/core/services/image-processing.service";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LxFileUpload,
    LxProcessingOverlay,
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
export class TaskForm implements OnInit, OnDestroy {
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
  private clientErrorLogger = inject(ClientErrorLoggerService);
  private imageProcessing = inject(ImageProcessingService);

  id: string = "";
  submitting = signal(false);
  processingProgress = signal(0);
  processingMessage = signal("Guardando ticket...");
  imageProcessingDiagnostic = signal<string | null>(null);

  // Signals para ComboBoxes
  cb_priority = signal<SelectItemDto[]>([]);
  cb_ticket_group = signal<SelectItemDto[]>([]);
  cb_application_user = signal<SelectItemDto[]>([]);
  cb_legal_matter = signal<SelectItemDto[]>([]);
  cb_predecessors = signal<SelectItemDto[]>([]);

  // Signals para previews de imígenes
  beforeWorkPreview = signal<string | null>(null);
  afterWorkPreview = signal<string | null>(null);
  private previewObjectUrls: Partial<Record<ImageFieldName, string>> = {};

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
    event: { files?: File[]; originalEvent?: Event },
    fieldName: ImageFieldName,
  ): Promise<void> {
    const file = event.files?.[0];
    try {
      if (file) await this.onFileChange(file, fieldName);
    } finally {
      const input = event.originalEvent?.target;
      if (input instanceof HTMLInputElement) input.value = "";
    }
  }

  onFilesChange(files: unknown[], fieldName: ImageFieldName): void {
    if (!files.length) {
      this.form.get(fieldName)?.setValue(null);
      this.clearPreview(fieldName);
    }
  }

  async onFileChange(file: File, fieldName: ImageFieldName): Promise<void> {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    this.imageProcessingDiagnostic.set(null);

    const processingSignal =
      fieldName === "beforeWork"
        ? this.processingBeforeWork
        : this.processingAfterWork;

    processingSignal.set(true);
    try {
      const processed = await this.imageProcessing.processImage(file, {
        maxBytes: MAX_SIZE_BYTES,
        maxDimension: 2560,
      });

      this.form.get(fieldName)?.setValue(processed);
      this.setPreview(fieldName, processed);
    } catch (error) {
      const errorMessage = this.describeError(error);
      console.error("[IMAGE_PROCESS] Error fatal:", errorMessage, error);
      this.reportImageFailure(
        "procesamiento centralizado",
        fieldName,
        file,
        error,
      );

      let userMessage = "No se pudo procesar la imagen.";

      if (errorMessage.includes("canvas")) {
        userMessage = "Error al procesar la imagen. Prueba con otra imagen.";
      } else if (errorMessage.includes("load")) {
        userMessage = "Error al cargar la imagen. Verifica que sea válida.";
      } else if (errorMessage.includes("memory")) {
        userMessage =
          "La imagen requiere demasiada memoria. Usa una de menor resolución.";
      }

      this.customToastS.showError(
        "Error al procesar imagen",
        userMessage + ` (${errorMessage})`,
      );
    } finally {
      processingSignal.set(false);
    }
  }

  private setPreview(fieldName: ImageFieldName, file: File): void {
    this.clearPreview(fieldName);
    const objectUrl = URL.createObjectURL(file);
    this.previewObjectUrls[fieldName] = objectUrl;

    if (fieldName === "beforeWork") this.beforeWorkPreview.set(objectUrl);
    else this.afterWorkPreview.set(objectUrl);
  }

  private clearPreview(fieldName: ImageFieldName): void {
    const objectUrl = this.previewObjectUrls[fieldName];
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      delete this.previewObjectUrls[fieldName];
    }

    if (fieldName === "beforeWork") this.beforeWorkPreview.set(null);
    else this.afterWorkPreview.set(null);
  }

  private reportImageFailure(
    stage: string,
    fieldName: ImageFieldName,
    file: File,
    error: unknown,
  ): void {
    const diagnosticId = this.createDiagnosticId();
    const errorMessage = this.describeError(error);
    const details = [
      `ID: ${diagnosticId}`,
      `Etapa: ${stage}`,
      `Campo: ${fieldName}`,
      `Archivo: ${file.name}`,
      `Tipo: ${file.type || "sin MIME"}`,
      `Tamaño: ${this.formatFileSize(file.size)}`,
      `PWA: ${this.isStandaloneMode() ? "sí" : "no"}`,
      `Error: ${errorMessage}`,
    ];

    this.imageProcessingDiagnostic.set(details.join("\n"));
    this.clientErrorLogger.logError(
      `[IMAGE_PROCESS_ERROR] ${stage} (${diagnosticId})`,
      details.join(" | "),
    );
  }

  private reportRequestFailure(error: unknown): void {
    const diagnosticId = this.createDiagnosticId();
    const httpError = error as {
      status?: number;
      statusText?: string;
      url?: string | null;
    };
    const details = [
      `ID: ${diagnosticId}`,
      "Etapa: envío HTTP",
      `Estado: ${httpError.status ?? "desconocido"}`,
      `StatusText: ${httpError.statusText || "sin detalle"}`,
      `Error: ${this.describeError(error)}`,
      `PWA: ${this.isStandaloneMode() ? "sí" : "no"}`,
      `Online: ${navigator.onLine ? "sí" : "no"}`,
      `Service Worker: ${this.getServiceWorkerState()}`,
      `Antes: ${this.describeSelectedFile(this.form.controls.beforeWork.value)}`,
      `Después: ${this.describeSelectedFile(this.form.controls.afterWork.value)}`,
      `URL: ${httpError.url || "sin URL"}`,
    ];

    this.imageProcessingDiagnostic.set(details.join("\n"));
    this.clientErrorLogger.logError(
      `[IMAGE_UPLOAD_HTTP_ERROR] Fallo al enviar tarea (${diagnosticId})`,
      details.join(" | "),
    );
  }

  private describeSelectedFile(file: File | null): string {
    if (!file) return "sin archivo nuevo";

    const conversionMethod =
      this.imageProcessing.getMetadata(file)?.conversionMethod;
    const conversion = conversionMethod
      ? `, conversión ${conversionMethod}`
      : "";
    return `${file.name}, ${file.type || "sin MIME"}, ${this.formatFileSize(file.size)}${conversion}`;
  }

  private describeError(error: unknown): string {
    if (error instanceof Error) {
      const cause = error.cause
        ? ` | causa: ${this.describeError(error.cause)}`
        : "";
      return `${error.name}: ${error.message}${cause}`;
    }

    if (typeof error === "string") return error;
    if (error && typeof error === "object" && "message" in error) {
      return String((error as { message: unknown }).message);
    }

    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }

  private createDiagnosticId(): string {
    return globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36);
  }

  private formatFileSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  private isStandaloneMode(): boolean {
    const iosNavigator = navigator as Navigator & { standalone?: boolean };
    return (
      (typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches) ||
      iosNavigator.standalone === true
    );
  }

  private getServiceWorkerState(): string {
    if (!("serviceWorker" in navigator)) return "no disponible";
    return navigator.serviceWorker.controller
      ? "controlando"
      : "sin controlador";
  }

  ngOnDestroy(): void {
    this.clearPreview("beforeWork");
    this.clearPreview("afterWork");
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
    this.processingProgress.set(0);
    this.processingMessage.set("Preparando datos...");

    setTimeout(() => this.processingProgress.set(15), 200);
    setTimeout(() => {
      this.processingMessage.set("Validando y comprimiendo imágenes...");
      this.processingProgress.set(35);
    }, 800);
    setTimeout(() => {
      this.processingMessage.set("Enviando al servidor...");
      this.processingProgress.set(65);
    }, 1600);

    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        this.id === ""
          ? Endpoints.Tasks.create
          : Endpoints.Tasks.update(this.id),
      method: this.id === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      onRequestError: (error) => this.reportRequestFailure(error),
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

    if (result !== false) {
      this.processingProgress.set(100);
      this.processingMessage.set("¡Completado!");
    }
  }
}
