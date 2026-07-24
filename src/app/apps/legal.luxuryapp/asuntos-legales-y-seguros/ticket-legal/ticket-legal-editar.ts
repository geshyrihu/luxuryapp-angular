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
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { SelectModule } from "@ui/web/primeng-select/primeng-select";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";

interface ILegalEditarForm {
  id: FormControl<string>;
  ticketGroupId: FormControl<string>;
  customerId: FormControl<string>;
  applicationUserId: FormControl<string>;
  creatorId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  documentCloud: FormControl<boolean>;
  documentEmail: FormControl<boolean>;
  assigneeId: FormControl<string | null>;
  assignee: FormControl<string>;
  priority: FormControl<number>;
}

@Component({
  selector: "app-ticket-legal-editar",
  templateUrl: "./ticket-legal-editar.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputAutocomplete,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
  ],
})
export class TicketLegalEditar implements OnInit {
  private formB = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private authService = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  cb_legal_matter = signal<SelectItemDto[]>([]);
  cb_application_user_responsible = signal<SelectItemDto[]>([]);

  form: FormGroup<ILegalEditarForm> = this.formB.group({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    ticketGroupId: new FormControl<string>("", { nonNullable: true }),
    customerId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    applicationUserId: new FormControl<string>(
      this.authService.applicationUserId,
      { nonNullable: true },
    ),
    creatorId: new FormControl<string>("", { nonNullable: true }),
    title: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", { nonNullable: true }),
    documentCloud: new FormControl<boolean>(false, { nonNullable: true }),
    documentEmail: new FormControl<boolean>(false, { nonNullable: true }),
    assigneeId: new FormControl<string | null>(null),
    assignee: new FormControl<string>("", { nonNullable: true }),
    priority: new FormControl<number>(1, { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    const LEGAL_WORK_GROUP_ID = "019df32f-4945-71c5-8fd0-ab574ea412cd";
    const [legalMatters, participants] = await Promise.all([
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.TaskLegal.selectForAddTicket,
      ),
      this.apiResponseS.onGetList(
        Endpoints.TaskGroupParticipants.listByGroup(LEGAL_WORK_GROUP_ID),
      ),
    ]);
    this.cb_legal_matter.set(legalMatters as SelectItemDto[]);
    this.cb_application_user_responsible.set(
      ((participants as any[]) ?? []).map((p) => ({
        value: p.applicationUserId,
        label: p.applicationUser,
      })),
    );

    if (this.id) {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Tasks.getById(this.id),
    );
    this.form.patchValue({
      ticketGroupId: result.ticketGroupId,
      customerId: result.customerId,
      creatorId: result.creatorId,
      title: result.title,
      description: result.description ?? "",
      documentCloud: result.documentCloud ?? false,
      documentEmail: result.documentEmail ?? false,
      assigneeId: result.assigneeId ?? null,
      assignee: result.assignee ?? "",
      priority: result.priority ?? 1,
    });
  }

  saveLegalMatter = (item: SelectItemDto) => {
    this.form.patchValue({ title: item?.label });
  };

  saveAssignee = (item: SelectItemDto) => {
    this.form.patchValue({
      assigneeId: String(item?.value),
      assignee: item?.label,
    });
  };

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Tasks.update(this.id),
      method: "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (raw) => {
        const formData = new FormData();
        formData.append("ticketGroupId", raw.ticketGroupId);
        formData.append("customerId", raw.customerId);
        formData.append("creatorId", raw.creatorId);
        formData.append("applicationUserId", raw.applicationUserId);
        formData.append("title", raw.title);
        formData.append("description", raw.description);
        formData.append("priority", String(raw.priority));
        formData.append("documentCloud", String(raw.documentCloud));
        formData.append("documentEmail", String(raw.documentEmail));
        if (raw.assigneeId) formData.append("assigneeId", raw.assigneeId);
        return formData;
      },
    });
  }
}
