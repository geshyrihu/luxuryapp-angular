import { CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CollectionCaseResponseDTO } from "../interfaces/collection-case.dto";

@Component({
  selector: "app-collection-case-detail-modal",
  imports: [
    AppIcon,
    ReactiveFormsModule,
    WebButtonLabel,
    CustomInputTextAreaSignal,
    DatePipe,
    CurrencyPipe,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./collection-case-detail-modal.html",
})
export default class CollectionCaseDetailModal implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  item = signal<CollectionCaseResponseDTO | null>(null);
  submitting = signal(false);

  notesCtrl = new FormControl("", {
    nonNullable: true,
    validators: [Validators.required, Validators.maxLength(500)],
  });

  ngOnInit() {
    this.item.set(this.config.data.item);
  }

  get actorName(): string {
    return this.authS.infoUserAuth?.fullName ?? "operador";
  }

  async onLogActivity() {
    if (!this.notesCtrl.value?.trim()) {
      this.notesCtrl.markAsTouched();
      return;
    }
    const item = this.item();
    if (!item) return;
    this.submitting.set(true);
    try {
      const ok = await this.apiResponseS.onPost(
        Endpoints.AccountingCoi.NativeCollection.CollectionCases.logActivity(
          item.id,
        ),
        { caseId: item.id, notes: this.notesCtrl.value, promisedDate: null },
      );
      if (ok) {
        this.notesCtrl.reset("");
        this.ref.close(true);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  onClose() {
    this.ref.close(false);
  }
}
