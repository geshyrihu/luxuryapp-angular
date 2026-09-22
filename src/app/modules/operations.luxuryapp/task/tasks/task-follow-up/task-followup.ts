import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelDelete } from "@ui/buttons/web-label";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { LxFileUpload } from "@ui/adaptive/file-upload/file-upload";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { AppSpinner } from "@ui/web/spinner/spinner";
import { AspRoleService } from "@core/auth/services/asp-role.service";
import { AuthService } from "@core/auth/services/auth.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApplicationRole } from "@core/enums/asp-net-roles.enum";
import { FormHelper } from "@core/helpers/form-helper";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { AppIcon } from "@ui/shared/app-icon/app-icon";
import {
  TaskFollowUpEvidenceImage,
  TaskFollowUpItem,
  TaskImageReorderPayload,
} from "../shared/interfaces/task-refactor.interface";
interface ITicketMessageFollowupForm {
  id: FormControl<string>;
  ticketMessageId: FormControl<string>;
  applicationUserId: FormControl<string>;
  description: FormControl<string>;
}

@Component({
  selector: "app-task-followup",
  templateUrl: "./task-followup.html",
  styleUrl: "./task-followup.scss",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    AppIcon,
    ReactiveFormsModule,
    FormsModule,
    WebButtonLabelSave,
    WebButtonLabelDelete,
    AppSpinner,
    CustomInputTextAreaSignal,
    LxFileUpload,
    WebButtonIcon,
  ],
})
export class TaskFollowup implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private aspRoleS = inject(AspRoleService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);

  readonly isSuperUser = this.aspRoleS.roleSignal(ApplicationRole.SuperUsuario);
  description = signal<TaskFollowUpItem[]>([]);
  evidenceImages = signal<Record<string, TaskFollowUpEvidenceImage[]>>({});
  pendingEvidence = signal<File[]>([]);
  submitting = signal(false);

  ticketMessageId: string = this.config.data.id;
  id: string = "";
  loading = signal(false);

  form: FormGroup<ITicketMessageFollowupForm> = this.formB.group({
    id: new FormControl<string>(
      { value: this.id, disabled: true },
      { nonNullable: true },
    ),
    ticketMessageId: new FormControl<string>(this.ticketMessageId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ],
    }),
  });

  // Character count signal
  descriptionValue = toSignal(this.form.controls.description.valueChanges, {
    initialValue: "",
  });
  remainingChars = computed(
    () => 200 - ((this.descriptionValue() as string)?.length || 0),
  );

  ngOnInit() {
    this.onCargaListaseguimientos();
  }

  async onCargaListaseguimientos(): Promise<void> {
    const result = await this.apiResponseS.onGetList<TaskFollowUpItem[]>(
      Endpoints.TaskFollowUps.listByTicketMessage(this.ticketMessageId),
    );
    const followUps = result ?? [];
    this.description.set(followUps);
    await Promise.all(followUps.map((followUp) => this.loadEvidence(followUp.id)));
  }

  evidenceFor(followUpId: string): TaskFollowUpEvidenceImage[] {
    return this.evidenceImages()[followUpId] ?? [];
  }

  async loadEvidence(followUpId: string): Promise<void> {
    const result = await this.apiResponseS.onGetList<TaskFollowUpEvidenceImage[]>(
      Endpoints.TaskFollowUpEvidenceImages.list(followUpId),
    );
    this.evidenceImages.update((current) => ({
      ...current,
      [followUpId]: result ?? [],
    }));
  }

  async onEvidenceSelect(event: { files?: File[] }, followUpId: string): Promise<void> {
    const files = event.files ?? [];
    if (!files.length) return;

    for (const file of files) {
      const formData = new FormData();
      formData.append("File", file, file.name);
      const result = await this.apiResponseS.onPostFile<TaskFollowUpEvidenceImage>(
        Endpoints.TaskFollowUpEvidenceImages.upload(followUpId),
        formData,
      );
      if (result === false) break;
    }
    await this.loadEvidence(followUpId);
  }

  onPendingEvidenceSelect(event: { files?: File[] }): void {
    this.pendingEvidence.set(event.files ?? []);
  }

  async deleteEvidence(followUpId: string, imageId: string): Promise<void> {
    const deleted = await this.apiResponseS.onDelete(
      Endpoints.TaskFollowUpEvidenceImages.delete(followUpId, imageId),
    );
    if (deleted) await this.loadEvidence(followUpId);
  }

  async moveEvidence(followUpId: string, index: number, direction: -1 | 1): Promise<void> {
    const images = [...this.evidenceFor(followUpId)];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    [images[index], images[targetIndex]] = [images[targetIndex], images[index]];
    const payload: TaskImageReorderPayload = {
      imageIds: images.map((image) => image.id),
    };
    const result = await this.apiResponseS.onPatch<boolean>(
      Endpoints.TaskFollowUpEvidenceImages.reorder(followUpId),
      payload,
    );
    if (result !== false) {
      this.evidenceImages.update((current) => ({
        ...current,
        [followUpId]: images,
      }));
    }
  }

  async onSubmit() {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.TaskFollowUps.create,
      method: "POST",
      submitting: this.submitting,
      closeOnSuccess: false,
    });

    if (result) {
      await this.onCargaListaseguimientos();
      const createdFollowUp = this.description()[0];
      const files = this.pendingEvidence();
      if (createdFollowUp && files.length > 0) {
        for (const file of files) {
          const formData = new FormData();
          formData.append("File", file, file.name);
          const uploadResult = await this.apiResponseS.onPostFile<TaskFollowUpEvidenceImage>(
            Endpoints.TaskFollowUpEvidenceImages.upload(createdFollowUp.id),
            formData,
          );
          if (uploadResult === false) break;
        }
        await this.loadEvidence(createdFollowUp.id);
      }
      this.pendingEvidence.set([]);
      this.form.patchValue({ description: "" });
    }
  }
  onDelete(id: string): void {
    this.apiResponseS
      .onDelete(Endpoints.TaskFollowUps.delete(id))
      .then((ok) => {
        if (ok) this.onCargaListaseguimientos();
      });
  }

  ngOnDestroy(): void {
    const items = this.description();
    const latest = items.length > 0 ? items[0] : null; // backend devuelve desc por fecha
    this.ref.close({
      count: items.length,
      lastFollowUp: latest?.description ?? null,
      lastFollowUpDate: latest
        ? (latest.createdAt as string).split(" ")[0]
        : null,
    });
  }
}
