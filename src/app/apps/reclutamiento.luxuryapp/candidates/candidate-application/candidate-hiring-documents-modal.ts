import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { lastValueFrom } from "rxjs";
import { LxDivider } from "@ui/adaptive/divider/divider";
import { EndpointsReclutamiento } from "src/app/core/constants/endpoints/reclutamiento.endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { CandidateCvUpload } from "../recruitment-shared/candidate-cv-upload";
import { CandidateHiringDocumentDto } from "./interfaces/candidate-hiring-document.dto";
import { CandidateHiringDocumentsDialogDataDto } from "./interfaces/candidate-hiring-documents-dialog-data.dto";

@Component({
  selector: "app-candidate-hiring-documents-modal",
  standalone: true,
  templateUrl: "./candidate-hiring-documents-modal.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, CandidateCvUpload, LxDivider],
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

      .documents-header {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-xs);
      }

      .documents-grid {
        display: grid;
        gap: var(--ds-space-md);
      }

      .document-card {
        border: 1px solid var(--ds-border-subtle);
        border-radius: var(--ds-radius-lg);
        background-color: var(--ds-bg-surface);
        padding: var(--ds-space-md);
      }

      .document-card__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--ds-space-md);
      }

      .document-status {
        display: inline-flex;
        align-items: center;
        gap: var(--ds-space-xs);
        border-radius: var(--ds-radius-pill);
        padding: var(--ds-space-2xs) var(--ds-space-sm);
        font-size: var(--ds-font-size-sm);
        font-weight: 600;
      }

      .document-status--pending {
        background-color: var(--ds-bg-warning-soft);
        color: var(--ds-text-warning);
      }

      .document-status--validated {
        background-color: var(--ds-bg-success-soft);
        color: var(--ds-text-success);
      }

      .document-meta {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-2xs);
        color: var(--ds-text-subtle);
        font-size: var(--ds-font-size-sm);
      }

      .document-actions {
        display: flex;
        flex-direction: column;
        gap: var(--ds-space-sm);
      }

      .document-notes {
        width: 100%;
        min-height: calc(var(--ds-space-xl) * 3);
        border: 1px solid var(--ds-border-subtle);
        border-radius: var(--ds-radius-md);
        padding: var(--ds-space-sm);
        font: inherit;
        color: var(--ds-text);
        background-color: var(--ds-bg-surface);
        resize: vertical;
      }

      .document-buttons {
        display: flex;
        justify-content: flex-end;
        gap: var(--ds-space-sm);
        flex-wrap: wrap;
      }

      .document-button {
        border: 1px solid var(--ds-border-strong);
        border-radius: var(--ds-radius-md);
        background-color: var(--ds-bg-surface);
        color: var(--ds-text);
        padding: var(--ds-space-sm) var(--ds-space-md);
        font: inherit;
        font-weight: 600;
        cursor: pointer;
      }

      .document-button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .document-button--primary {
        background-color: var(--ds-bg-brand);
        border-color: var(--ds-bg-brand);
        color: var(--ds-text-on-brand);
      }

      .document-button--success {
        background-color: var(--ds-bg-success-soft);
        border-color: var(--ds-border-success);
        color: var(--ds-text-success);
      }
    `,
  ],
})
export class CandidateHiringDocumentsModal implements OnInit {
  private readonly apiResponseS = inject(ApiResponseService);
  private readonly enumSelectS = inject(EnumSelectService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  readonly dialogData =
    this.config.data as CandidateHiringDocumentsDialogDataDto;
  readonly loading = signal(false);
  readonly uploadingType = signal<number | null>(null);
  readonly validatingDocumentId = signal<string | null>(null);
  readonly documentTypes = signal<SelectItemDto[]>([]);
  readonly documents = signal<CandidateHiringDocumentDto[]>([]);
  readonly selectedFiles = signal<Record<number, File | null>>({});
  readonly validationNotes = signal<Record<string, string>>({});

  readonly documentRows = computed(() =>
    this.documentTypes().map((option) => ({
      option,
      document:
        this.documents().find((item) => item.documentTypeId === option.value) ??
        null,
      pendingFile: this.selectedFiles()[option.value] ?? null,
      validationNote: "",
    })),
  );

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      const [documentTypes, documents] = await Promise.all([
        lastValueFrom(this.enumSelectS.recruitmentDocumentType()),
        this.apiResponseS.onGetList<CandidateHiringDocumentDto[]>(
          EndpointsReclutamiento.CandidateProcesses.hiringDocuments(
            this.dialogData.candidateProcessId,
          ),
        ),
      ]);

      this.documentTypes.set(documentTypes);
      this.documents.set(documents ?? []);
    } finally {
      this.loading.set(false);
    }
  }

  onFileChanged(documentTypeId: number, file: File | null) {
    this.selectedFiles.update((current) => ({
      ...current,
      [documentTypeId]: file,
    }));
  }

  onValidationNotesChange(documentId: string, value: string) {
    this.validationNotes.update((current) => ({
      ...current,
      [documentId]: value,
    }));
  }

  async onUploadDocument(documentTypeId: number) {
    const file = this.selectedFiles()[documentTypeId];
    if (!file) return;

    const formData = new FormData();
    formData.append("DocumentTypeId", String(documentTypeId));
    formData.append("File", file);

    this.uploadingType.set(documentTypeId);
    const result = await this.apiResponseS.onPost<CandidateHiringDocumentDto>(
      EndpointsReclutamiento.CandidateProcesses.hiringDocuments(
        this.dialogData.candidateProcessId,
      ),
      formData,
    );
    this.uploadingType.set(null);

    if (!result) return;

    this.documents.update((current) => {
      const next = current.filter((item) => item.id !== result.id);
      next.push(result);
      return next.sort((a, b) => a.documentTypeId - b.documentTypeId);
    });
    this.selectedFiles.update((current) => ({
      ...current,
      [documentTypeId]: null,
    }));
  }

  async onValidateDocument(documentId: string) {
    this.validatingDocumentId.set(documentId);
    const result = await this.apiResponseS.onPost<CandidateHiringDocumentDto>(
      EndpointsReclutamiento.CandidateProcesses.validateHiringDocument(documentId),
      {
        validationNotes: this.validationNotes()[documentId] ?? "",
      },
    );
    this.validatingDocumentId.set(null);

    if (!result) return;

    this.documents.update((current) =>
      current
        .map((item) => (item.id === result.id ? result : item))
        .sort((a, b) => a.documentTypeId - b.documentTypeId),
    );
    this.validationNotes.update((current) => ({
      ...current,
      [documentId]: result.validationNotes ?? "",
    }));
  }

  close() {
    this.ref.close(true);
  }

  isUploading(documentTypeId: number): boolean {
    return this.uploadingType() === documentTypeId;
  }

  isValidating(documentId: string): boolean {
    return this.validatingDocumentId() === documentId;
  }
}
