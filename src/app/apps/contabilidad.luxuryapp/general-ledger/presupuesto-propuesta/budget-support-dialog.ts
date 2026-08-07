import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
/**
 * ============================================================================
 * ⚠️ ADVERTENCIA CRÍTICA / CRITICAL WARNING ⚠️
 * ============================================================================
 * Este módulo (Presupuesto Propuesta y sus modales) se encuentra 100%
 * FUNCIONAL y ESTABLE.
 *
 * Queda ESTRICTAMENTE PROHIBIDO modificar su lígica, estructura o flujos de IA
 * sin antes consultar y obtener autorización explócita del Ing. Ricardo Marques.
 *
 * Por favor, NO rompan el código.
 * ============================================================================
 */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { LxListbox } from "@ui/adaptive/listbox/listbox";
import { InputTextModule } from "@ui/web/primeng-inputtext/primeng-inputtext";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";

import { LxCard } from "@ui/adaptive/card/card";
import { LxMessage } from "@ui/adaptive/message/message";
import { LxTag } from "@ui/adaptive/tag/tag";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputFile } from "@ui/inputs/web/custom-input-file-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { PdfViewerModal } from "@ui/web/pdf-viewer-modal/pdf-viewer-modal";
import { BudgetProposalItemDTO } from "src/app/apps/contabilidad.luxuryapp/general-ledger/presupuesto-propuesta/interfaces/budget-proposal.model";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
@Component({
  selector: "app-budget-support-dialog",
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputFile,
    WebButtonLabel,
    LxListbox,
    LxTag,
    LxCard,
    LxMessage,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./budget-support-dialog.html",
})
export class BudgetSupportDialog implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  private dialogHandlerS = inject(DialogHandlerService); // New injection

  loading = signal(true);
  budgetProposalItem = signal<BudgetProposalItemDTO | null>(null); // Changed to BudgetProposalItemDTO
  errorMensaje: string | null = null;
  // editingSupportId removed

  budgetProposalItemId: string = this.config.data.budgetProposalItemId;
  accountName: string = this.config.data.accountName;
  supportForm = this.fb.group({
    providerName: ["", Validators.maxLength(250)],
    comment: ["", Validators.maxLength(1000)],
    files: [[] as File[]], // Changed to array for multiple files
  });

  ngOnInit(): void {
    this.loadSupports();
  }

  loadSupports(): void {
    this.loading.set(true);
    // Fetch the BudgetProposalItem itself
    this.apiResponseS
      .onGetItem<BudgetProposalItemDTO>( // Fetch BudgetProposalItemDTO
        Endpoints.BudgetingProposalSupport.byItem(this.budgetProposalItemId),
      )
      .then((response) => {
        if (response) {
          this.budgetProposalItem.set(response);
          this.supportForm.patchValue({
            providerName: response.providerName,
            comment: response.comment,
          });
        } else {
          this.budgetProposalItem.set(null);
          // If no item found, form remains blank for creation
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje =
          error.message || "Error al cargar la partida de presupuesto.";
        console.error("Error loading budget proposal item:", error);
        this.loading.set(false);
      });
  }

  onFileSelected(file: File): void {
    if (file) {
      const selectedFiles: File[] = [file]; // CustomInputFile emits single file by default, but we can adapt if we want multiple
      const pdfFiles = selectedFiles.filter(
        (f) => f.type === "application/pdf",
      );

      if (pdfFiles.length !== selectedFiles.length) {
        console.warn("Solo se permiten archivos PDF.");
      }
      // If we want to append:
      // const currentFiles = this.supportForm.get("files")?.value || [];
      // this.supportForm.get("files")?.setValue([...currentFiles, ...pdfFiles]);

      // For now, let's assume single file replacement or append if multiple is supported by the custom component (it's not by default usually, unless configured)
      // The instructions say "multiple" was on the input. CustomInputFile usually emits one file.
      // If we want multiple, we might need a different approach or modify the custom input.
      // Assuming CustomInputFile emits one file, we push it to the array.

      const currentFiles = this.supportForm.get("files")?.value || [];
      this.supportForm.get("files")?.setValue([...currentFiles, ...pdfFiles]);
    }
  }

  removeFile(): void {
    this.supportForm.get("files")?.setValue([]); // Set to empty array
  }

  onSubmit(): void {
    if (this.supportForm.invalid) {
      this.supportForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.supportForm.value;
    const currentItem = this.budgetProposalItem();

    // Check if there's an existing BudgetProposalItem with support info
    if (currentItem && currentItem.id) {
      // --- UPDATE MODE ---
      const updateInfoPromise = new Promise<void>((resolve, reject) => {
        // Only update info if there are changes
        if (
          currentItem.providerName !== formValue.providerName ||
          currentItem.comment !== formValue.comment
        ) {
          const updateInfoDTO = {
            providerName: formValue.providerName,
            comment: formValue.comment,
          };
          this.apiResponseS
            .onPut<BudgetProposalItemDTO>(
              Endpoints.BudgetingProposalSupport.updateSupportInfo(
                this.budgetProposalItemId,
              ),
              updateInfoDTO,
            )
            .then(() => resolve())
            .catch(reject);
        } else {
          resolve(); // No info changes
        }
      });

      const addFilesPromise = new Promise<void>((resolve, reject) => {
        const files: File[] = this.supportForm.get("files")?.value || [];
        if (files.length > 0) {
          const formData = new FormData();
          formData.append("budgetProposalItemId", this.budgetProposalItemId);
          files.forEach((file) => {
            formData.append(`Files`, file, file.name);
          });
          this.apiResponseS
            .onPost<BudgetProposalItemDTO>(
              Endpoints.BudgetingProposalSupport.uploadFiles,
              formData,
            )
            .then(() => resolve())
            .catch(reject);
        } else {
          resolve(); // No files to upload
        }
      });

      Promise.all([updateInfoPromise, addFilesPromise])
        .then(() => {
          this.loadSupports(); // Reload all data after all operations
          this.supportForm.get("files")?.setValue([]); // Clear file input
          this.errorMensaje = null;
        })
        .catch((error) => {
          this.errorMensaje = error.message || "Error al guardar el soporte.";
          console.error("Error saving budget item support:", error);
        })
        .finally(() => {
          this.loading.set(false);
        });
    } else {
      // --- CREATE MODE ---
      // In this mode, we only add files, which implicitly creates the support info
      // if it didn't exist. The backend will handle creating the BudgetProposalItem
      // with providerName and comment if it's the first file upload.
      const files: File[] = this.supportForm.get("files")?.value || [];
      if (files.length === 0) {
        this.errorMensaje =
          "Debe adjuntar al menos un archivo PDF para crear un soporte.";
        this.loading.set(false);
        return;
      }

      const formData = new FormData();
      formData.append("budgetProposalItemId", this.budgetProposalItemId);
      if (formValue.providerName)
        formData.append("providerName", formValue.providerName);
      if (formValue.comment) formData.append("comment", formValue.comment);
      files.forEach((file) => {
        formData.append(`Files`, file, file.name);
      });

      this.apiResponseS
        .onPost<BudgetProposalItemDTO>(
          Endpoints.BudgetingProposalSupport.uploadFiles,
          formData,
        )
        .then(() => {
          this.loadSupports(); // Reload all data after all operations
          this.supportForm.get("files")?.setValue([]); // Clear file input
          this.errorMensaje = null;
        })
        .catch((error) => {
          this.errorMensaje = error.message || "Error al agregar el soporte.";
          console.error("Error adding budget item support:", error);
        })
        .finally(() => {
          this.loading.set(false);
        });
    }
  }

  onDeleteFile(fileId: string): void {
    this.loading.set(true);
    this.apiResponseS
      .onDelete(Endpoints.BudgetingProposalSupport.deleteSupportFile(fileId))
      .then((response) => {
        if (response) {
          this.loadSupports(); // Reload supports
          this.errorMensaje = null;
        } else {
          this.errorMensaje = "Error al eliminar el archivo.";
        }
        this.loading.set(false);
      })
      .catch((error) => {
        this.errorMensaje = error.message || "Error al eliminar el archivo.";
        this.loading.set(false);
      });
  }

  closeDialog(): void {
    this.ref.close();
  }

  viewPdf(url: string, fileName: string): void {
    this.dialogHandlerS.openDialog(
      PdfViewerModal,
      { pdfSrc: url, fileName: fileName },
      fileName, // Title for the dialog
      this.dialogHandlerS.sizeFull, // Or a custom size
      true,
    );
  }
}
