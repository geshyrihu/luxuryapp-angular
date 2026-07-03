import { Component, inject, signal } from "@angular/core";
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { WebButtonLabel } from "src/app/core/components/buttons/web-label/button";
import { WebButtonLabelSave } from "src/app/core/components/buttons/web-label/button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomInputSwitch } from "src/app/core/components/inputs/web/custom-input-switch-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";
import { SanctionTypeListDTO } from "src/app/features/hr/evaluaciones-de-desempeo/hr-catalog/models/hr-catalog.interfaces";
import { ESanctionStatus } from "../models/sanction.dto";

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
    WebButtonLabelSave,
    WebButtonLabel,
  ],
})
export class SanctionFormComponent {
  apiResponseS = inject(ApiResponseService);
  dateS = inject(DateService);
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
      FormHelper.submitCrud({
        form: this.changeStatusForm,
        api: this.apiResponseS,
        endpoint: Endpoints.HR.Sanction.changeStatus(this.sanctionId()),
        ref: this.ref,
        submitting: this.submitting,
        method: "PATCH",
        transformPayload: (value) => ({
          sanctionStatus: value.sanctionStatus ?? "Activa",
          internalNotes: value.internalNotes || undefined,
        }),
      });
    } else {
      FormHelper.submitCrud({
        form: this.form,
        api: this.apiResponseS,
        endpoint: Endpoints.HR.Sanction.create,
        ref: this.ref,
        submitting: this.submitting,
        transformPayload: (value) => ({
          incidentId: value.incidentId ?? "",
          sanctionTypeId: value.sanctionTypeId ?? "",
          effectiveStartDate:
            this.dateS.getDateFormat(value.effectiveStartDate) ?? "",
          effectiveEndDate:
            this.dateS.getDateFormat(value.effectiveEndDate) ?? undefined,
          allowAppeal: value.allowAppeal ?? true,
          appealDeadline:
            this.dateS.getDateFormat(value.appealDeadline) ?? undefined,
          conditions: value.conditions || undefined,
          internalNotes: value.internalNotes || undefined,
        }),
      });
    }
  }

  onCancel(): void {
    this.ref.close();
  }
}
