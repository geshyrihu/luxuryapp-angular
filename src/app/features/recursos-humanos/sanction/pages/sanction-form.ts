import { Component, inject, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButton } from "src/app/core/components/buttons/web/custom-button";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { SanctionTypeListDTO } from "../../../configuration/hr-catalog/models/hr-catalog.interfaces";
import {
  ESanctionStatus,
  SanctionAddOrEditDTO,
  SanctionChangeStatusDTO,
} from "../models/sanction.dto";

interface ISanctionForm {
  incidentId: import("@angular/forms").FormControl<string>;
  sanctionTypeId: import("@angular/forms").FormControl<string>;
  effectiveStartDate: import("@angular/forms").FormControl<Date | null>;
  effectiveEndDate: import("@angular/forms").FormControl<Date | null>;
  allowAppeal: import("@angular/forms").FormControl<boolean>;
  appealDeadline: import("@angular/forms").FormControl<Date | null>;
  conditions: import("@angular/forms").FormControl<string>;
  internalNotes: import("@angular/forms").FormControl<string>;
}

interface ISanctionChangeStatusForm {
  sanctionStatus: import("@angular/forms").FormControl<ESanctionStatus>;
  internalNotes: import("@angular/forms").FormControl<string>;
}

@Component({
  selector: "app-sanction-form",
  templateUrl: "./sanction-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputSwitch,
    CustomInputTextAreaSignal,
    CustomButtonSave,
    CustomButton,
  ],
})
export class SanctionFormComponent {
  apiResponseS = inject(ApiResponseService);
  fb = inject(NonNullableFormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  isChangeStatus = signal(false);
  sanctionId = signal<string>("");
  incidentId = signal<string>("");
  sanctionTypes = signal<ISelectItem[]>([]);
  submitting = signal(false);

  form!: FormGroup<ISanctionForm>;
  changeStatusForm!: FormGroup<ISanctionChangeStatusForm>;

  cb_sanctionStatus: ISelectItem[] = [
    { value: "Activa", label: "Activa" },
    { value: "Apelada", label: "Apelada" },
    { value: "Suspendida", label: "Suspendida" },
    { value: "Cumplida", label: "Cumplida" },
    { value: "Revocada", label: "Revocada" },
  ];

  ngOnInit(): void {
    const changeStatus = this.config.data?.changeStatus as boolean;
    this.isChangeStatus.set(changeStatus);

    if (changeStatus) {
      this.sanctionId.set(this.config.data?.id as string);
      this.changeStatusForm = this.fb.group<ISanctionChangeStatusForm>({
        sanctionStatus: this.fb.control<ESanctionStatus>("Activa"),
        internalNotes: this.fb.control(""),
      });
    } else {
      const incidentIdFromData = this.config.data?.incidentId as string;
      this.incidentId.set(incidentIdFromData);

      this.form = this.fb.group<ISanctionForm>({
        incidentId: this.fb.control(incidentIdFromData || ""),
        sanctionTypeId: this.fb.control(""),
        effectiveStartDate: this.fb.control<Date | null>(null),
        effectiveEndDate: this.fb.control<Date | null>(null),
        allowAppeal: this.fb.control(true),
        appealDeadline: this.fb.control<Date | null>(null),
        conditions: this.fb.control(""),
        internalNotes: this.fb.control(""),
      });

      this.apiResponseS
        .onGetList<SanctionTypeListDTO[]>(Endpoints.Settings.sanctionTypes)
        .then((resp) => {
          if (resp) {
            this.sanctionTypes.set(
              resp
                .filter((t) => t.isActive)
                .map((t) => ({ value: t.id, label: t.name })),
            );
          }
        });
    }
  }

  onSubmit(): void {
    if (this.isChangeStatus()) {
      if (!this.apiResponseS.validateForm(this.changeStatusForm)) return;
      this.submitting.set(true);

      const dto: SanctionChangeStatusDTO = {
        sanctionStatus: this.changeStatusForm.value.sanctionStatus ?? "Activa",
        internalNotes: this.changeStatusForm.value.internalNotes || undefined,
      };

      this.apiResponseS
        .onPatch(Endpoints.HR.Sanction.changeStatus(this.sanctionId()), dto)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    } else {
      if (!this.apiResponseS.validateForm(this.form)) return;
      this.submitting.set(true);

      const dto: SanctionAddOrEditDTO = {
        incidentId: this.form.value.incidentId ?? "",
        sanctionTypeId: this.form.value.sanctionTypeId ?? "",
        effectiveStartDate: this.form.value.effectiveStartDate
          ? new Date(this.form.value.effectiveStartDate).toISOString()
          : "",
        effectiveEndDate: this.form.value.effectiveEndDate
          ? new Date(this.form.value.effectiveEndDate).toISOString()
          : undefined,
        allowAppeal: this.form.value.allowAppeal ?? true,
        appealDeadline: this.form.value.appealDeadline
          ? new Date(this.form.value.appealDeadline).toISOString()
          : undefined,
        conditions: this.form.value.conditions || undefined,
        internalNotes: this.form.value.internalNotes || undefined,
      };

      this.apiResponseS
        .onPost<SanctionAddOrEditDTO>(Endpoints.HR.Sanction.create, dto)
        .then((result) => {
          result ? this.ref.close(true) : this.submitting.set(false);
        });
    }
  }

  onCancel(): void {
    this.ref.close();
  }
}
