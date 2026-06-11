import { CommonModule } from "@angular/common";
import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { FileUploadModule } from "@iplab/ngx-file-upload";
import { NgSelectModule } from "@ng-select/ng-select";
import { DividerModule } from "primeng/divider";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { EditorModule } from "primeng/editor";
import { ListboxModule } from "primeng/listbox";
import { ToggleSwitchModule } from "primeng/toggleswitch";
import { AppIcon } from "src/app/core/components/app-icon/app-icon.component";
import { Endpoints } from "src/app/core/constants/endpoints";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { EApplicationRole } from "src/app/core/enums/asp-net-roles.enum";
import { AiService } from "src/app/core/services/ai.service";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { DateService } from "src/app/core/services/date.service";
import { SwalService } from "src/app/core/services/swal.service";
import {
  IAnnouncement,
  IAttachment,
  ICustomer,
  IRole,
} from "./announcement.model";
import { ImageGenerationDialog } from "./components/image-generation-dialog/image-generation-dialog";

@Component({
  selector: "app-announcement-admin-form",
  templateUrl: "./announcement-admin-form.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgSelectModule,
    FileUploadModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomButtonDelete,
    CustomButtonSave,
    ToggleSwitchModule,
    EditorModule,
    DividerModule,
    ListboxModule,
    CustomButton,
    AppIcon,
  ],
})
export class AnnouncementAdminForm implements OnInit {
  private fb = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private authService = inject(AuthService);
  private customerIdService = inject(CustomerIdService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  private aiService = inject(AiService);
  private swalService = inject(SwalService);
  private dialogHandlerS = inject(DialogHandlerService);
  private dateS = inject(DateService);

  // Signals
  allRoles = signal<IRole[]>([]);
  allCustomers = signal<ICustomer[]>([]);
  data = signal<IAnnouncement | null>(null);
  id = signal<string | null>(null);
  mainImageToDelete = signal(false);
  attachmentsToDelete = signal<string[]>([]);
  loadingData = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    title: ["", [Validators.required, Validators.maxLength(150)]],
    content: ["", [Validators.required]],
    publishedAt: [null as Date | null],
    expirationDate: [null as Date | null],
    announcementType: [0, [Validators.required]],
    status: [0, [Validators.required]],
    externalLink: [""],
    sendByEmail: [false],
    targetedCustomerIds: [
      [] as number[],
      [Validators.required, Validators.minLength(1)],
    ],
    recipientRoleIds: [
      [] as string[],
      [Validators.required, Validators.minLength(1)],
    ],
    mainImageControl: [[] as File[]],
    attachmentsControl: [[] as File[]],
  });

  ngOnInit() {
    this.id.set(this.config.data?.id);

    // Cargar católogos siempre, luego datos si es edición
    this.loadInitialData().then(() => {
      if (this.id()) {
        this.loadDataForEdit();
      }
    });
  }

  async loadInitialData() {
    const userRole = this.authService.userToken?.roles?.[0] ?? "";
    const userCustomerId = this.customerIdService.customerId;

    try {
      const [filteredRoles, allAvailableCustomers] = await Promise.all([
        this.apiResponseS.onGetSelectItem<IRole[]>(
          Endpoints.SelectItems.rolesForAnnouncements,
        ),
        this.apiResponseS.onGetSelectItem<ICustomer[]>(
          Endpoints.SelectItems.customersActiveNameShort,
        ),
      ]);

      this.allRoles.set(filteredRoles || []);
      const filteredCustomers = this.filterCustomersForCreation(
        allAvailableCustomers || [],
        userRole,
        userCustomerId(),
      );
      this.allCustomers.set(filteredCustomers);
    } catch (error) {
      console.error("Error loading catalogs", error);
    }
  }

  async loadDataForEdit() {
    if (!this.id()) return;
    this.loadingData.set(true);

    const announcementData = await this.apiResponseS.onGetItem<IAnnouncement>(
      Endpoints.Announcements.getById(this.id()!),
    );

    if (announcementData) {
      this.data.set(announcementData);

      // Preparar objeto para patchValue (excluyendo archivos y lógica especial)
      const { status, announcementType, ...dataToPatch } = announcementData;

      this.form.patchValue({
        ...dataToPatch,
        publishedAt: this.dateS.parseDate(announcementData.publishedAt),
        expirationDate: this.dateS.parseDate(announcementData.expirationDate),
      });

      // Mapear Status y Type de string a numérico (si vienen como texto)
      const statusMap: Record<string, number> = {
        Borrador: 0,
        Publicado: 1,
        Archivado: 2,
      };
      const typeMap: Record<string, number> = {
        General: 0,
        Urgente: 1,
        Informativo: 2,
      };

      // Si el backend devuelve strings, los convertimos. Si devuelve nómeros, usamos directo.
      const statusVal =
        typeof status === "string" ? (statusMap[status] ?? 0) : status;
      const typeVal =
        typeof announcementType === "string"
          ? (typeMap[announcementType] ?? 0)
          : announcementType;

      this.form.controls.status.setValue(statusVal);
      this.form.controls.announcementType.setValue(typeVal);

      // Mapear listas de selección
      if (announcementData.selectableRoles) {
        this.form.controls.recipientRoleIds.setValue(
          announcementData.selectableRoles
            .filter((r) => r.isSelected)
            .map((r) => r.value),
        );
      }

      if (announcementData.selectableCustomers) {
        this.form.controls.targetedCustomerIds.setValue(
          announcementData.selectableCustomers
            .filter((c) => c.isSelected)
            .map((c) => c.value),
        );
      }
    }

    this.loadingData.set(false);
  }

  // --- Gestión de Archivos Existentes ---

  requestDeleteMainImage(): void {
    const currentData = this.data();
    if (!currentData) return;
    this.mainImageToDelete.set(true);
    // Actualizar el signal para reflejar el cambio en la vista (optimista)
    this.data.set({ ...currentData, imagePath: null });
  }

  requestDeleteAttachment(attachmentToRemove: IAttachment): void {
    const currentData = this.data();
    if (!currentData?.attachments) return;

    // Añadir a lista de borrado
    this.attachmentsToDelete.update((ids) => [...ids, attachmentToRemove.id]);

    // Remover de la vista local (signal)
    const updatedAttachments = currentData.attachments.filter(
      (att) => att.id !== attachmentToRemove.id,
    );
    this.data.set({ ...currentData, attachments: updatedAttachments });
  }

  // --- Generación IA ---

  async generateDraft() {
    const { value: prompt } = await this.swalService.fire({
      title: "? Asistente de Redacción IA",
      input: "textarea",
      inputLabel: "óQuó quieres comunicar?",
      inputPlaceholder: "Ej: Mantenimiento de elevadores el lunes...",
      showCancelButton: true,
      confirmButtonText: "Generar",
      showLoaderOnConfirm: true,
      preConfirm: (input) => {
        if (!input) return this.swalService.error("Escribe una instrucción.");
        return this.aiService
          .generateAnnouncementDraft(input, "Formal")
          .catch((err) => {
            console.error(err);
            this.swalService.error("Error al generar.");
          });
      },
      allowOutsideClick: () => !this.swalService.isLoading(),
      didOpen: () => this.swalService.fixModalZIndex(),
    });

    if (prompt) {
      this.form.controls.content.setValue(prompt);
      this.swalService.success("Borrador generado.");
    }
  }

  openImageGenerator() {
    this.dialogHandlerS
      .openDialog(
        ImageGenerationDialog,
        null,
        "Generador de Imógenes IA",
        this.dialogHandlerS.sizeMd,
      )
      .then((blob: any) => {
        if (blob) {
          // Convert Blob to File
          const file = new File([blob], `generated-image-${Date.now()}.png`, {
            type: "image/png",
          });

          // Update control
          this.form.controls.mainImageControl.setValue([file]);

          // Create preview URL locally
          const url = URL.createObjectURL(blob);
          this.data.update((d) => (d ? { ...d, imagePath: url } : null));
          this.mainImageToDelete.set(false); // Reset delete flag

          this.swalService.success("Imagen generada y asignada.");
        }
      });
  }

  // --- Utils ---

  private filterCustomersForCreation(
    customers: ICustomer[],
    userRole: string,
    userCustomerId: string | null,
  ): ICustomer[] {
    const adminRoles = [
      EApplicationRole.Administrador,
      EApplicationRole.Asistente,
    ];
    const universalRoles = [
      EApplicationRole.Reclutamiento,
      EApplicationRole.Legal,
      EApplicationRole.SupervisionOperativa,
      EApplicationRole.Contador,
      EApplicationRole.SuperUsuario,
      EApplicationRole.RecursosHumanos,
    ];

    if (adminRoles.includes(userRole as EApplicationRole)) {
      return customers.filter((c) => c.value === userCustomerId);
    }
    if (universalRoles.includes(userRole as EApplicationRole)) {
      return customers;
    }
    return [];
  }

  // --- Submit ---

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.apiResponseS.validateForm(this.form);
      return;
    }

    this.submitting.set(true);
    const formData = new FormData();
    const rawValue = this.form.getRawValue();

    // Helpers para append
    const append = (key: string, val: any) => {
      if (val !== null && val !== undefined && val !== "")
        formData.append(key, val);
    };

    const toISO = (date: any) => {
      if (!date) return null;
      try {
        return this.dateS.getDateFormat(date);
      } catch {
        return null;
      }
    };

    // Campos bósicos
    append("title", rawValue.title);
    append("content", rawValue.content);
    append("announcementType", rawValue.announcementType);
    append("status", rawValue.status);
    append("externalLink", rawValue.externalLink);
    append("sendByEmail", rawValue.sendByEmail);
    append("publishedAt", toISO(rawValue.publishedAt));
    append("expirationDate", toISO(rawValue.expirationDate));

    // Arrays de IDs
    (rawValue.recipientRoleIds || []).forEach((id: string) =>
      formData.append("recipientRoleIds", id),
    );
    (rawValue.targetedCustomerIds || []).forEach((id: any) =>
      formData.append("targetedCustomerIds", String(id)),
    );

    // Imagen Principal (Nueva vs Borrar Existente)
    const mainFiles: File[] = rawValue.mainImageControl || [];
    if (mainFiles.length > 0) {
      formData.append("image", mainFiles[0]); // Solo la primera si hubiera varias
    }
    formData.append("deleteImage", String(this.mainImageToDelete()));

    // Adjuntos (Nuevos)
    const attachmentFiles: File[] = rawValue.attachmentsControl || [];
    attachmentFiles.forEach((file) => formData.append("attachments", file));

    // Adjuntos (Borrar Existentes)
    this.attachmentsToDelete().forEach((id) =>
      formData.append("attachmentsToDeleteIds", id),
    );

    // Enviar
    try {
      const success = this.id()
        ? await this.apiResponseS.onPut(
            Endpoints.Announcements.update(this.id()!),
            formData,
          )
        : await this.apiResponseS.onPost(Endpoints.Announcements.create, formData);

      if (success) {
        this.ref.close(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.submitting.set(false);
    }
  }
}
