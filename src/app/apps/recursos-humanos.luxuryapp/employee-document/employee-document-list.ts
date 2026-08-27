import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonIcon, WebButtonIconEdit } from "@ui/buttons/web-icon";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { EndpointsRecursosHumanos } from "src/app/core/constants/endpoints/recursos-humanos.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import Swal from "sweetalert2";

export interface CandidateHiringDocumentListItemDto {
  id: string;
  employeeId: string;
  documentCatalogId: string;
  documentTypeName: string;
  isMandatory: boolean;
  fileUrl: string;
  isSubmitted: boolean;
  submittedAt: string | null;
  isValidated: boolean;
  validatedAt: string | null;
  validatedByUserId: string | null;
  validatedByUserName: string | null;
  validationNotes: string | null;
}

@Component({
  selector: "app-employee-document-list",

  imports: [
    CommonModule,
    FormsModule,
    LxDivider,
    LxFieldset,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    WebButtonLabelConfirm,
    WebButtonIconEdit,
    WebButtonIcon,
    LxTag,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./employee-document-list.html",
  styles: [
    ":host { display: block; } .documents-shell { display: flex; flex-direction: column; gap: var(--ds-space-lg); padding: var(--ds-space-md); } .file-input-hidden { display: none; } .document-row__pdf { max-width: 60%; }",
  ],
})
export class EmployeeDocumentList implements OnInit {
  isReadOnly = input<boolean>(false);
  employeeId = input.required<string>();

  readonly documentTypes = signal<SelectItemDto[]>([]);
  readonly documents = signal<CandidateHiringDocumentListItemDto[]>([]);
  readonly isLoading = signal(true);

  readonly uploadingType = signal<string | null>(null);
  readonly validatingId = signal<string | null>(null);
  readonly rejectingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  readonly selectedDocumentTypeId = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly isUploadingNew = signal<boolean>(false);

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly toastS = inject(CustomToastService);

  readonly availableDocumentTypes = computed(() => {
    const docs = this.documents();
    return this.documentTypes().filter(
      (option) => !docs.some((d) => d.documentCatalogId === option.value),
    );
  });

  readonly documentRows = computed(() =>
    this.documents().map((doc) => {
      const option = this.documentTypes().find(
        (item) => item.value === doc.documentCatalogId,
      );
      return {
        option: option ?? {
          label: doc.documentTypeName,
          value: doc.documentCatalogId,
          isMandatory: false,
        },
        document: doc,
      };
    }),
  );

  async ngOnInit() {
    await this.loadDocuments();
  }

  async loadDocuments() {
    this.isLoading.set(true);
    try {
      const [documentTypes, documents] = await Promise.all([
        this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
          Endpoints.SelectItems.documentCatalog,
        ),
        this.apiResponseS.onGetList<CandidateHiringDocumentListItemDto[]>(
          EndpointsRecursosHumanos.EmployeeDocument.byEmployee(
            this.employeeId(),
          ),
        ),
      ]);

      this.documentTypes.set(documentTypes ?? []);
      this.documents.set(documents ?? []);
    } finally {
      this.isLoading.set(false);
    }
  }

  onNewFileSelected(event: any) {
    const file = event.target?.files?.[0];
    if (!file) {
      this.selectedFile.set(null);
      return;
    }
    if (
      !file.name.toLowerCase().endsWith(".pdf") &&
      file.type !== "application/pdf"
    ) {
      this.toastS.showError("Solo se permiten archivos PDF");
      event.target.value = "";
      this.selectedFile.set(null);
      return;
    }
    this.selectedFile.set(file);
  }

  async uploadNewDocument() {
    const catalogId = this.selectedDocumentTypeId();
    const file = this.selectedFile();
    if (!catalogId || !file) return;

    this.isUploadingNew.set(true);
    try {
      const formData = new FormData();
      formData.append("documentCatalogId", catalogId);
      formData.append("file", file);

      const result =
        await this.apiResponseS.onPostFile<CandidateHiringDocumentListItemDto>(
          EndpointsRecursosHumanos.EmployeeDocument.upload(this.employeeId()),
          formData,
        );

      if (result) {
        this.documents.update((docs) => {
          const next = [...docs];
          next.push(result as CandidateHiringDocumentListItemDto);
          return next;
        });
        this.selectedDocumentTypeId.set(null);
        this.selectedFile.set(null);
        this.toastS.showSuccess("Documento cargado correctamente");
      }
    } finally {
      this.isUploadingNew.set(false);
    }
  }

  async onFileSelected(event: any, documentCatalogId: string) {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (
      !file.name.toLowerCase().endsWith(".pdf") &&
      file.type !== "application/pdf"
    ) {
      this.toastS.showError("Solo se permiten archivos PDF");
      if (event.target) event.target.value = "";
      return;
    }

    this.uploadingType.set(documentCatalogId);
    try {
      const formData = new FormData();
      formData.append("documentCatalogId", documentCatalogId);
      formData.append("file", file);

      const result =
        await this.apiResponseS.onPostFile<CandidateHiringDocumentListItemDto>(
          EndpointsRecursosHumanos.EmployeeDocument.upload(this.employeeId()),
          formData,
        );

      if (result) {
        this.documents.update((docs) => {
          const next = docs.filter(
            (item) => item.documentCatalogId !== documentCatalogId,
          );
          next.push(result as CandidateHiringDocumentListItemDto);
          return next;
        });
        this.toastS.showSuccess("Documento actualizado correctamente");
      }
    } finally {
      this.uploadingType.set(null);
      if (event.target) {
        event.target.value = "";
      }
    }
  }

  async onDeleteFile(document: CandidateHiringDocumentListItemDto | null) {
    if (
      !document ||
      this.deletingId() ||
      this.validatingId() ||
      this.rejectingId()
    )
      return;

    const { isConfirmed } = await Swal.fire({
      title: "Eliminar documento",
      text:
        "Estas seguro de eliminar el archivo de " +
        document.documentTypeName +
        "?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "S, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d9534f",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });
    if (!isConfirmed) return;

    this.deletingId.set(document.id);
    try {
      const deleted = await this.apiResponseS.onDelete(
        EndpointsRecursosHumanos.EmployeeDocument.removeFile(
          this.employeeId(),
          document.id,
        ),
      );
      if (deleted) {
        await this.loadDocuments();
      }
    } finally {
      this.deletingId.set(null);
    }
  }

  async onValidate(document: CandidateHiringDocumentListItemDto | null) {
    if (!document || this.validatingId()) return;

    this.validatingId.set(document.id);
    try {
      const updated =
        await this.apiResponseS.onPost<CandidateHiringDocumentListItemDto>(
          EndpointsRecursosHumanos.EmployeeDocument.validate(document.id),
          { validationNotes: null },
        );
      if (updated) {
        this.documents.update((docs) =>
          docs.map((item) => (item.id === document.id ? updated : item)),
        );
      }
    } finally {
      this.validatingId.set(null);
    }
  }

  async onReject(document: CandidateHiringDocumentListItemDto | null) {
    if (!document || this.rejectingId() || this.validatingId()) return;

    const { value: notes } = await Swal.fire({
      title: "Rechazar documento",
      text: document.documentTypeName,
      input: "textarea",
      inputPlaceholder: "Indica el motivo del rechazo",
      inputValue: document.validationNotes ?? "",
      showCancelButton: true,
      confirmButtonText: "Rechazar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d9534f",
      reverseButtons: true,
      customClass: { container: "my-swal-container" },
    });

    if (notes === undefined || notes === null) return;
    if (!notes.trim()) {
      this.toastS.showError("El motivo del rechazo es obligatorio");
      return;
    }

    this.rejectingId.set(document.id);
    try {
      const updated =
        await this.apiResponseS.onPost<CandidateHiringDocumentListItemDto>(
          EndpointsRecursosHumanos.EmployeeDocument.reject(document.id),
          { validationNotes: notes.trim() },
        );
      if (updated) {
        this.documents.update((docs) =>
          docs.map((item) => (item.id === document.id ? updated : item)),
        );
      }
    } finally {
      this.rejectingId.set(null);
    }
  }
}
