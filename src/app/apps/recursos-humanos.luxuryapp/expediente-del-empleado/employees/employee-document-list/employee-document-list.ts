import { Component, input, signal, computed, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { ApiResponseService } from 'src/app/core/http/services/api-response.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { CustomToastService } from 'src/app/core/services/custom-toast.service';
import { EndpointsRecursosHumanos } from 'src/app/core/constants/endpoints/recursos-humanos.endpoints';
import { SelectItemDto } from 'src/app/core/interfaces/select-item.dto';
import { LxDivider } from '@ui/adaptive/divider/divider';
import { LxFieldset } from '@ui/adaptive/fieldset/fieldset';
import { WebButtonLabelViewPdf } from "@ui/buttons/web-label";
import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelConfirm } from "@ui/buttons/web-label/button-confirm";
import { WebButtonIconEdit } from "@ui/buttons/web-icon";
import { LxTag } from '@ui/adaptive/tag/tag';

export interface CandidateHiringDocumentListItemDto {
  id: string;
  employeeId: string;
  documentTypeId: number;
  documentTypeName: string;
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
  selector: 'app-employee-document-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LxDivider,
    LxFieldset,
    WebButtonLabel,
    WebButtonLabelViewPdf,
    WebButtonLabelConfirm,
    WebButtonIconEdit,
    LxTag
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-document-list.html',
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

      .file-input-hidden {
        display: none;
      }

      .document-row__pdf {
        max-width: 60%;
      }
    `
  ]
})
export class EmployeeDocumentList implements OnInit {
  employeeId = input.required<string>();

  readonly documentTypes = signal<SelectItemDto[]>([]);
  readonly documents = signal<CandidateHiringDocumentListItemDto[]>([]);
  readonly isLoading = signal(true);
  readonly uploadingType = signal<number | null>(null);

  private readonly apiResponseS = inject(ApiResponseService);
  private readonly enumSelectS = inject(EnumSelectService);
  private readonly toastS = inject(CustomToastService);

  readonly documentRows = computed(() =>
    this.documentTypes()
      .filter((option) => option.value && option.label && option.value !== '')
      .map((option) => {
        const doc = this.documents().find((item) => item.documentTypeId === option.value);
        return {
          option,
          document: doc ?? null,
        };
      })
  );

  async ngOnInit() {
    await this.loadDocuments();
  }

  async loadDocuments() {
    this.isLoading.set(true);
    try {
      const [documentTypes, documents] = await Promise.all([
        lastValueFrom(this.enumSelectS.recruitmentDocumentType()),
        this.apiResponseS.onGetList<CandidateHiringDocumentListItemDto[]>(
          EndpointsRecursosHumanos.EmployeeDocument.byEmployee(this.employeeId()),
        ),
      ]);
      
      this.documentTypes.set(documentTypes);
      this.documents.set(documents ?? []);
    } finally {
      this.isLoading.set(false);
    }
  }

  async onFileSelected(event: any, documentTypeId: number) {
    const file = event.target?.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      this.toastS.showError("Solo se permiten archivos PDF");
      if (event.target) event.target.value = '';
      return;
    }

    this.uploadingType.set(documentTypeId);
    try {
      const formData = new FormData();
      formData.append('documentTypeId', documentTypeId.toString());
      formData.append('file', file);

      const result = await this.apiResponseS.onPostFile<CandidateHiringDocumentListItemDto>(
        EndpointsRecursosHumanos.EmployeeDocument.upload(this.employeeId()),
        formData
      );

      if (result) {
        this.documents.update((docs) => {
          const next = docs.filter((item) => item.documentTypeId !== documentTypeId);
          next.push(result as CandidateHiringDocumentListItemDto);
          return next;
        });
      }
    } finally {
      this.uploadingType.set(null);
      if (event.target) {
          event.target.value = '';
      }
    }
  }

  async onNotifyRecruitment() {
    await this.apiResponseS.onPost<boolean>(
      EndpointsRecursosHumanos.EmployeeDocument.notifyRecruitment(this.employeeId())
    );
  }
}