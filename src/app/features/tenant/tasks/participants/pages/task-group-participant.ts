import { CommonModule } from "@angular/common";
import { Component, inject, OnDestroy, OnInit, signal } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { MessageModule } from "primeng/message";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { TableModule } from "primeng/table";
import { CustomButtonDelete } from "src/app/core/components/buttons/web/custom-button-delete";
import { CustomButtonEdit } from "src/app/core/components/buttons/web/custom-button-edit";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputAutoComplete } from "src/app/core/components/inputs/web/custom-input-autocomplete-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { FormHelper } from "src/app/core/helpers/form-helper";

@Component({
  selector: "app-task-group-participant",
  templateUrl: "./task-group-participant.html",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ProgressSpinnerModule,
    MessageModule,
    CustomInputSelectSignal,
    CustomButtonEdit,
    CustomInputAutoComplete,
    CustomButtonSave,
    CustomButtonDelete,
  ],
})
export class TaskGroupParticipant implements OnInit, OnDestroy {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private formB = inject(FormBuilder);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  id: string = "";
  submitting = signal(false);
  loading_existing_participant = signal(false);

  cb_existing_Participant = signal<any[]>([]);
  cb_application_user = signal<ISelectItem[]>([]);

  cb_eLuxury_group_rol: ISelectItem[] = [
    { label: "Participante", value: false },
    { label: "Administrador", value: true },
  ];

  form = this.formB.group({
    id: this.formB.control({ value: "", disabled: true }),
    ticketGroupId: this.formB.control(this.config.data?.id ?? "", {
      nonNullable: true,
      validators: Validators.required,
    }),
    applicationUserId: this.formB.control("", {
      nonNullable: true,
      validators: Validators.required,
    }),
    applicationUser: this.formB.control("", { nonNullable: true }),
    isAdmin: this.formB.control(false, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.onLoadAppUsers(),
      this.onLoadExistingParticipants(),
    ]);
  }

  async onLoadAppUsers(): Promise<void> {
    const result: any = await this.apiResponseS.onGetList(
      Endpoints.TaskGroupParticipants.availableByCustomerAndGroup(
        this.customerIdS.customerId(),
        this.config.data.id,
      ),
    );
    this.cb_application_user.set(result as ISelectItem[]);
  }

  async onLoadExistingParticipants(): Promise<void> {
    this.loading_existing_participant.set(true);

    const result: any[] =
      (await this.apiResponseS.onGetList(
        Endpoints.TaskGroupParticipants.listByGroup(this.config.data.id),
      )) ?? [];

    const sorted = result.sort((a, b) => {
      if (a.isAdmin === "Administrador" && b.isAdmin !== "Administrador") {
        return -1;
      }
      if (a.isAdmin !== "Administrador" && b.isAdmin === "Administrador") {
        return 1;
      }
      return 0;
    });

    this.cb_existing_Participant.set(sorted);
    this.loading_existing_participant.set(false);
  }

  onSelectUser = (item: ISelectItem) => {
    this.form.patchValue({
      applicationUserId: String(item?.value),
      applicationUser: item?.label,
    });
  };

  async onSubmit(): Promise<void> {
    const result = await FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id === "" ? Endpoints.TaskGroupParticipants.base : Endpoints.TaskGroupParticipants.update(this.id),
      method: this.id === "" ? "POST" : "PUT",
      submitting: this.submitting,
      closeOnSuccess: false,
      transformPayload: (formValue) => ({
        TaskGroupId: formValue.ticketGroupId ?? this.config.data?.id,
        ApplicationUserId: formValue.applicationUserId,
        IsAdmin: formValue.isAdmin,
      }),
    });

    if (result) {
      this.onCleanForm();
    }
  }

  onEditParticipant(item: any) {
    this.id = item.id;

    const userId = item.applicationUserId;
    const userName = item.applicationUser;
    const isAdmin = item.isAdmin === "Administrador";

    const selectedUser = userId
      ? this.cb_application_user().find((user) => user.value === userId)
      : null;

    const userLabel = selectedUser ? selectedUser.label : userName || "";

    this.form.patchValue({
      ticketGroupId: this.config.data?.id,
      applicationUserId: userId,
      applicationUser: userLabel,
      isAdmin: isAdmin,
    });
    this.form.controls.id.setValue(item.id);
  }

  async onDelete(id: any): Promise<void> {
    const result = await this.apiResponseS.onDelete(
      Endpoints.TaskGroupParticipants.delete(id),
    );
    if (result) {
      this.cb_existing_Participant.set(
        this.cb_existing_Participant().filter((item: any) => item.id !== id),
      );
    }
  }

  async onCleanForm(): Promise<void> {
    this.id = "";
    this.form.reset({
      ticketGroupId: this.config.data.id,
      isAdmin: false,
      applicationUserId: "",
      applicationUser: "",
      id: "",
    });
    this.submitting.set(false);
    await this.onLoadExistingParticipants();
    await this.onLoadAppUsers();
  }

  ngOnDestroy(): void {
    this.ref.close(true);
  }
}
