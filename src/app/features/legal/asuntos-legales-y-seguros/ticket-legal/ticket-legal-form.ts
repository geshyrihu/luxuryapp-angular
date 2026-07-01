import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web/label/button";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web/label/button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TicketLegalSeguimiento } from "./ticket-legal-seguimiento";

// ID del WorkGroup Legal global — constante de dominio
const LEGAL_WORK_GROUP_ID = "019df32f-4945-71c5-8fd0-ab574ea412cd";

interface ILegalTaskForm {
  id: FormControl<string>;
  ticketGroupId: FormControl<string>;
  customerId: FormControl<string>;
  creatorId: FormControl<string>;
  applicationUserId: FormControl<string>;
  assigneeId: FormControl<string | null>;
  assignee: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  // TODO: Eliminar en Fase 6. Se derivará del TypePerson del creador: Employee ? interno, Provider ? externo.
  isInternal: FormControl<boolean | null>;
  documentCloud: FormControl<boolean>;
  documentEmail: FormControl<boolean>;
  priority: FormControl<number>;
}

@Component({
  selector: "app-ticket-legal-form",
  templateUrl: "./ticket-legal-form.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputSelectSignal,
    CustomInputAutoComplete,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    WebButtonLabel,
  ],
})
export class TicketLegalForm implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  private formB = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private authService = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);

  cb_legal_matter = signal<ISelectItem[]>([]);
  cb_customer = signal<ISelectItem[]>([]);
  cb_responsible = signal<ISelectItem[]>([]);

  form: FormGroup<ILegalTaskForm> = this.formB.group({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    ticketGroupId: new FormControl<string>(LEGAL_WORK_GROUP_ID, {
      nonNullable: true,
    }),
    customerId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    creatorId: new FormControl<string>(this.authService.applicationUserId, {
      nonNullable: true,
    }),
    applicationUserId: new FormControl<string>(
      this.authService.applicationUserId,
      { nonNullable: true },
    ),
    assigneeId: new FormControl<string | null>(null),
    assignee: new FormControl<string>("", { nonNullable: true }),
    title: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl<string>("", { nonNullable: true }),
    isInternal: new FormControl<boolean | null>(null),
    documentCloud: new FormControl<boolean>(false, { nonNullable: true }),
    documentEmail: new FormControl<boolean>(false, { nonNullable: true }),
    priority: new FormControl<number>(1, { nonNullable: true }), // EPriorityLevel.Low = 1
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id ?? "";
    this.form.controls.id.setValue(this.id);

    await this.onLoadSelectItems();

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [legalMatters, customers, participants] = await Promise.all([
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.TaskLegal.selectForAddTicket,
      ),
      this.apiResponseS.onGetSelectItem<ISelectItem[]>(
        Endpoints.SelectItems.customersActiveNameShort,
      ),
      this.apiResponseS.onGetList(
        Endpoints.TaskGroupParticipants.listByGroup(LEGAL_WORK_GROUP_ID),
      ),
    ]);
    this.cb_legal_matter.set(legalMatters as ISelectItem[]);
    this.cb_customer.set(customers as ISelectItem[]);
    this.cb_responsible.set(
      ((participants as any[]) ?? []).map((p) => ({
        value: p.applicationUserId,
        label: p.applicationUser,
      })),
    );
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Tasks.getById(this.id),
    );
    this.form.patchValue({
      customerId: result.customerId,
      title: result.title,
      description: result.description,
      assigneeId: result.assigneeId ?? null,
      assignee: result.assignee ?? "",
      isInternal: result.isInternal ?? null,
      documentCloud: result.documentCloud ?? false,
      documentEmail: result.documentEmail ?? false,
    });
  }

  saveLegalMatter = (item: ISelectItem) => {
    this.form.patchValue({ title: item?.label, isInternal: !!item?.value });
  };

  saveAssignee = (item: ISelectItem) => {
    this.form.patchValue({
      assigneeId: String(item?.value),
      assignee: item?.label,
    });
  };

  onOpenSeguimiento() {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimiento,
      { ticketId: this.id },
      "Seguimiento Ticket Legal",
      this.dialogHandlerS.sizeLg,
    );
  }

  async onSubmit(): Promise<void> {
    await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        this.id === ""
          ? Endpoints.Tasks.create
          : Endpoints.Tasks.update(this.id),
      method: this.id === "" ? "POST" : "PUT",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (raw) => {
        const formData = new FormData();
        formData.append("ticketGroupId", raw.ticketGroupId);
        formData.append("customerId", raw.customerId);
        formData.append("creatorId", raw.creatorId);
        formData.append("applicationUserId", raw.applicationUserId);
        if (raw.assigneeId) formData.append("assigneeId", raw.assigneeId);
        formData.append("title", raw.title);
        formData.append("description", raw.description);
        formData.append("priority", String(raw.priority));
        if (raw.isInternal !== null)
          formData.append("isInternal", String(raw.isInternal));
        formData.append("documentCloud", String(raw.documentCloud));
        formData.append("documentEmail", String(raw.documentEmail));
        return formData;
      },
    });
  }
}
