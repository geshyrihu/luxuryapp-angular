import { Component, inject, OnInit, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TicketLegalSeguimiento } from "./ticket-legal-seguimiento";

const LEGAL_WORK_GROUP_ID = "019df32f-4945-71c5-8fd0-ab574ea412cd";

interface ILegalTaskClienteForm {
  id: FormControl<string>;
  ticketGroupId: FormControl<string>;
  customerId: FormControl<string>;
  creatorId: FormControl<string>;
  applicationUserId: FormControl<string>;
  title: FormControl<string>;
  description: FormControl<string>;
  // TODO: Eliminar en Fase 6. Se derivará del TypePerson del creador: Employee → interno, Provider → externo.
  isInternal: FormControl<boolean | null>;
  documentCloud: FormControl<boolean>;
  documentEmail: FormControl<boolean>;
  priority: FormControl<number>;
}

@Component({
  selector: "app-ticket-legal-form-cliente",
  templateUrl: "./ticket-legal-form-cliente.html",
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputAutoComplete,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CustomButton,
  ],
})
export class TicketLegalFormCliente implements OnInit {
  private dialogHandlerS = inject(DialogHandlerService);
  private customerIdS = inject(CustomerIdService);
  private formB = inject(FormBuilder);
  private apiResponseS = inject(ApiResponseService);
  private authService = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);
  cb_legal_matter = signal<ISelectItem[]>([]);

  form: FormGroup<ILegalTaskClienteForm> = this.formB.group({
    id: new FormControl<string>({ value: "", disabled: true }, { nonNullable: true }),
    ticketGroupId: new FormControl<string>(LEGAL_WORK_GROUP_ID, { nonNullable: true }),
    customerId: new FormControl<string>(this.customerIdS.customerId(), { nonNullable: true, validators: [Validators.required] }),
    creatorId: new FormControl<string>(this.authService.applicationUserId, { nonNullable: true }),
    applicationUserId: new FormControl<string>(this.authService.applicationUserId, { nonNullable: true }),
    title: new FormControl<string>("", { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl<string>("", { nonNullable: true }),
    isInternal: new FormControl<boolean | null>(null),
    documentCloud: new FormControl<boolean>(false, { nonNullable: true }),
    documentEmail: new FormControl<boolean>(false, { nonNullable: true }),
    priority: new FormControl<number>(1, { nonNullable: true }),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id ?? "";
    this.form.controls.id.setValue(this.id);

    const legalMatters = await this.apiResponseS.onGetSelectItem<ISelectItem[]>(
      Endpoints.TaskLegal.selectForAddTicket,
    );
    this.cb_legal_matter.set(legalMatters as ISelectItem[]);

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(Endpoints.Tasks.getById(this.id));
    this.form.patchValue({
      title: result.title,
      description: result.description,
      isInternal: result.isInternal ?? null,
      documentCloud: result.documentCloud ?? false,
      documentEmail: result.documentEmail ?? false,
    });
  }

  saveLegalMatter = (item: ISelectItem) => {
    this.form.patchValue({ title: item?.label, isInternal: !!item?.value });
  };

  onOpenSeguimiento() {
    this.dialogHandlerS.openDialog(
      TicketLegalSeguimiento,
      { ticketId: this.id },
      "Seguimiento",
      this.dialogHandlerS.sizeLg,
    );
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;
    this.submitting.set(true);

    const raw = this.form.getRawValue();
    const formData = new FormData();
    formData.append("ticketGroupId", raw.ticketGroupId);
    formData.append("customerId", raw.customerId);
    formData.append("creatorId", raw.creatorId);
    formData.append("applicationUserId", raw.applicationUserId);
    formData.append("title", raw.title);
    formData.append("description", raw.description);
    formData.append("priority", String(raw.priority));
    if (raw.isInternal !== null) formData.append("isInternal", String(raw.isInternal));
    formData.append("documentCloud", String(raw.documentCloud));
    formData.append("documentEmail", String(raw.documentEmail));

    const request = this.id === ""
      ? this.apiResponseS.onPost(Endpoints.Tasks.create, formData)
      : this.apiResponseS.onPut(Endpoints.Tasks.update(this.id), formData);

    request.then((result: any) => {
      result ? this.ref.close(true) : this.submitting.set(false);
    });
  }
}
