import { Component, inject, OnInit, signal } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CardModule } from "primeng/card";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "primeng/dynamicdialog";
import { FileUploadModule } from "primeng/fileupload";
import { firstValueFrom } from "rxjs";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputCheckSignal } from "src/app/core/components/inputs/web/custom-input-check-signal";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
import { TaskGroupService } from "src/app/features/tasks/task.service";
import { TaskFollowup } from "../../task-follow-up/pages/task-followup";

interface ITaskMessageForm {
  id: FormControl<string>;
  ticketGroupId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  priority: FormControl<number>;
  creatorId: FormControl<string>;
  customerId: FormControl<string>;
  beforeWork: FormControl<File | null>;
  afterWork: FormControl<File | null>;
  applicationUserId: FormControl<string>;
  assignee: FormControl<string>;
  assigneeId: FormControl<string>;
  scheduledDate: FormControl<Date | string | null>;
  closedDate: FormControl<Date | string | null>;
  isInternal: FormControl<boolean>;
  documentCloud: FormControl<boolean>;
  documentEmail: FormControl<boolean>;
}

import { DateService } from "src/app/core/services/date.service";

@Component({
  selector: "app-task-form",
  templateUrl: "./task-form.html",
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    FileUploadModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextAreaSignal,
    CustomInputAutoComplete,
    CustomButtonSave,
    CustomButton,
    CustomInputCheckSignal,
  ],
})
export class TaskForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private dialogHandlerS = inject(DialogHandlerService);
  private enumSelectS = inject(EnumSelectService);
  private ref = inject(DynamicDialogRef);
  private TaskGroupService = inject(TaskGroupService);
  private formB = inject(FormBuilder);
  private dateS = inject(DateService);

  id: string = "";
  submitting = signal(false);

  // Signals para ComboBoxes
  cb_priority = signal<ISelectItem[]>([]);
  cb_ticket_group = signal<ISelectItem[]>([]);
  cb_application_user = signal<ISelectItem[]>([]);
  cb_legal_matter = signal<ISelectItem[]>([]);

  // Signals para previews de imógenes
  beforeWorkPreview = signal<string | null>(null);
  afterWorkPreview = signal<string | null>(null);

  isLegalWorkGroup = signal(false);
  private workGroupLegalMap = new Map<string, boolean>();

  // Definición estricta del formulario
  form: FormGroup<ITaskMessageForm> = this.formB.group({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    ticketGroupId: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    title: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(100)],
    }),
    description: new FormControl<string>("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(150)],
    }),
    priority: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    creatorId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
    }),
    customerId: new FormControl<string>(this.customerIdS.customerId(), {
      nonNullable: true,
    }),
    beforeWork: new FormControl<File | null>(null),
    afterWork: new FormControl<File | null>(null),
    applicationUserId: new FormControl<string>(this.authS.applicationUserId, {
      nonNullable: true,
    }),
    assignee: new FormControl<string>("", { nonNullable: true }),
    assigneeId: new FormControl<string>("", { nonNullable: true }),
    scheduledDate: new FormControl<Date | string | null>(null),
    closedDate: new FormControl<Date | string | null>(null),
    isInternal: new FormControl<boolean>(false, { nonNullable: true }),
    documentCloud: new FormControl<boolean>(false, { nonNullable: true }),
    documentEmail: new FormControl<boolean>(false, { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id || "";

    // Sincronizar ID
    this.form.controls.id.setValue(this.id);
    if (this.config.data?.ticketGroupId) {
      this.form.controls.ticketGroupId.setValue(this.config.data.ticketGroupId);
    }

    await this.onLoadSelectItems();

    if (this.config.data?.ticketGroupId) {
      const isLegal =
        this.workGroupLegalMap.get(this.config.data.ticketGroupId) ?? false;
      this.isLegalWorkGroup.set(isLegal);
      if (isLegal) await this.loadLegalMatters();
      await this.onLoadUsers(this.config.data.ticketGroupId);
    }

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [priority, workGroups] = await Promise.all([
      firstValueFrom(this.enumSelectS.priorityLevel()),
      this.apiResponseS.onGetList<any[]>(
        Endpoints.TaskGroups.list(
          this.customerIdS.customerId(),
          true,
          this.authS.applicationUserId,
        ),
      ),
    ]);

    this.cb_priority.set(priority);
    this.cb_ticket_group.set(
      (workGroups ?? []).map((g) => ({ label: g.nameGroup, value: g.id })),
    );
    this.workGroupLegalMap = new Map(
      (workGroups ?? []).map((g) => [g.id, g.isLegalGroup ?? false]),
    );
  }

  async onLoadUsers(ticketGroupId: string): Promise<void> {
    const result = await this.apiResponseS.onGetList<ISelectItem[]>(
      Endpoints.Tasks.participants(ticketGroupId),
    );
    this.cb_application_user.set(result as ISelectItem[]);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.Tasks.getById(this.id),
    );

    // Extraer assigneeId
    let assigneeId = "";
    if (result.assigneeId !== null && result.assigneeId !== undefined) {
      assigneeId =
        typeof result.assigneeId === "object" && result.assigneeId !== null
          ? (result.assigneeId as any).value
          : result.assigneeId;
    }

    // Buscar el usuario asignado completo
    const selectedAssignee = assigneeId
      ? this.cb_application_user().find((item) => item.value === assigneeId)
      : null;

    this.form.patchValue({
      ...result,
      applicationUserId: this.authS.applicationUserId,
      assigneeId,
      assignee: selectedAssignee ? selectedAssignee.label : "",
      scheduledDate: result.scheduledDate
        ? result.scheduledDate.substring(0, 10)
        : null,
      closedDate: result.closedDate ? result.closedDate.substring(0, 10) : null,
    });

    // Vistas previas de imógenes
    if (result.beforeWorkPreview) {
      this.beforeWorkPreview.set(result.beforeWorkPreview);
    }
    if (result.afterWorkPreview) {
      this.afterWorkPreview.set(result.afterWorkPreview);
    }
  }

  onFileChange(file: File | null, fieldName: "beforeWork" | "afterWork") {
    if (file) {
      this.form.get(fieldName)?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        if (fieldName === "beforeWork") {
          this.beforeWorkPreview.set(reader.result as string);
        } else if (fieldName === "afterWork") {
          this.afterWorkPreview.set(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    } else {
      this.form.get(fieldName)?.setValue(null);
      if (fieldName === "beforeWork") {
        this.beforeWorkPreview.set(null);
      } else if (fieldName === "afterWork") {
        this.afterWorkPreview.set(null);
      }
    }
  }

  onTicketGroupChange(newValue: string) {
    const isLegal = this.workGroupLegalMap.get(newValue) ?? false;
    this.isLegalWorkGroup.set(isLegal);
    if (isLegal) this.loadLegalMatters();
    this.onLoadUsers(newValue);
  }

  saveLegalMatter = (item: ISelectItem) => {
    this.form.patchValue({
      title: item.label,
      isInternal: !!item.value,
    });
  };

  private async loadLegalMatters(): Promise<void> {
    if (this.cb_legal_matter().length > 0) return;
    const result = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.TaskLegal.selectForAddTicket,
    );
    this.cb_legal_matter.set(result as ISelectItem[]);
  }

  saveUserId = (item: ISelectItem) => {
    this.form.patchValue({
      assigneeId: String(item?.value),
      assignee: item?.label,
    });
  };

  openFollowUp() {
    this.dialogHandlerS.openDialog(
      TaskFollowup,
      { id: this.id },
      "Seguimiento de Ticket",
      this.dialogHandlerS.sizeLg,
    );
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    const formData = new FormData();
    const rawValues = this.form.getRawValue() as any;

    Object.keys(rawValues).forEach((key) => {
      const value = rawValues[key];

      if (key === "beforeWork" || key === "afterWork") {
        const file = value as File;
        if (file && file instanceof File) {
          formData.append(key, file, file.name);
        }
      } else if (key === "scheduledDate" || key === "closedDate") {
        if (value) {
          const dateVal = new Date(value);
          const formattedDate = dateVal.toISOString().split("T")[0];
          formData.append(key, formattedDate);
        }
      } else if (key !== "assignee") {
        formData.append(key, value != null ? value : "");
      }
    });

    const request =
      this.id === ""
        ? this.apiResponseS.onPost(Endpoints.Tasks.create, formData)
        : this.apiResponseS.onPut(Endpoints.Tasks.update(this.id), formData);

    request.then((result: any) => {
      if (result) {
        this.ref.close(result);
      } else {
        this.submitting.set(false);
      }
    });
  }
}
