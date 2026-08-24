import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  signal,
} from "@angular/core";
import Swal from "sweetalert2";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EndpointsRecursosHumanos } from "src/app/core/constants/endpoints/recursos-humanos.endpoints";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { LxFieldset } from "@ui/adaptive/fieldset/fieldset";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label/button-view-pdf";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label/button";

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
  selector: "app-hiring-document-validation",
  standalone: true,
  imports: [
    LxDivider,
    LxFieldset,
    LxTag,
    WebButtonLabelViewPdf,
    WebButtonLabelConfirm,
    WebButtonIcon,
    WebButtonLabel,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./hiring-document-validation.html",
  styles: [
    `
      :host {
        display: block;
      }

      .documents-shell {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-lg);
        padding: var(--ds-space-md);
      }

      .document-card {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-md);
      }

      .document-card__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--ds-space-sm);
      }

      .document-card__pdf {
        max-width: 60%;
      }
    `,
  ],
})
export class HiringDocumentValidation implements OnInit {
  employeeId = input.required<string>();

  readonly documentTypes = signal<SelectItemDto[]>([]);
  readonly documents = signal<CandidateHiringDocumentListItemDto[]>([]);
  readonly isLoading = signal(true);
  readonly validatingId = signal<string | null>(null);
  readonly rejectingId = signal<string | null>(null);
  readonly uploadingId = signal<string | null>(null);
  readonly deletingId = signal<string | null>(null);

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly toastS = inject(CustomToastService);

  readonly documentRows = computed(() =>
    this.documentTypes()
      .filter((option) => option.value && option.label && option.value !== "")
      .map((option) => {
        const doc = this.documents().find(
          (item) => item.documentCatalogId === option.value,
        );
        return {
          option,
          document: doc ?? null,
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
        this.apiResponseS.onGetSelectItem<SelectItemDto[]>(Endpoints.SelectItems.documentCatalog),
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

  async onUpload(
    row: { option: SelectItemDto; document: CandidateHiringDocumentListItemDto | null },
    event: Event,
  ) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];
    if (!file || this.uploadingId()) {
      inputElement.value = "";
      return;
    }

    const catalogId = String(row.option.value);
    this.uploadingId.set(catalogId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentCatalogId", catalogId);

      const updated =
        await this.apiResponseS.onPostFile<CandidateHiringDocumentListItemDto>(
          EndpointsRecursosHumanos.EmployeeDocument.upload(this.employeeId()),
          formData,
        );
      if (updated) {
        this.documents.update((docs) => {
          const exists = docs.some((item) => item.id === updated.id);
          return exists
            ? docs.map((item) => (item.id === updated.id ? updated : item))
            : [...docs, updated];
        });
      }
    } finally {
      this.uploadingId.set(null);
      inputElement.value = "";
    }
  }

  async onDeleteFile(document: CandidateHiringDocumentListItemDto | null) {
    if (!document || this.deletingId() || document.isValidated) return;

    const { isConfirmed } = await Swal.fire({
      title: "Eliminar archivo",
      text: `¿Seguro que deseas eliminar el archivo de "${document.documentTypeName}"? El documento quedará pendiente de carga.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
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