import { Component, inject, OnInit } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomInputNumberSignal } from "src/app/core/components/inputs/web/custom-input-number-signal";
import { CustomInputTextAreaSignal } from "src/app/core/components/inputs/web/custom-input-textarea-signal";
import { CustomButtonSave } from "src/app/core/components/web/buttons/custom-button-save";
import { Endpoints } from "src/app/core/constants/endpoints";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { ManualBalanceUpdateDto } from "../interfaces/manual-balance-update.dto";

interface AdminVacationEditDialogData {
  employeeId: string;
  fullName: string;
  currentSystemBalance: number;
}

@Component({
  selector: "app-admin-vacaciones-edit-modal",
  imports: [
    ReactiveFormsModule,
    CustomInputNumberSignal,
    CustomInputTextAreaSignal,
    CustomButtonSave,
  ],
  templateUrl: "./admin-vacaciones-edit-modal.html",
})
export class AdminVacacionesEditModalComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private apiResponseService = inject(ApiResponseService);

  employeeData = this.config.data as AdminVacationEditDialogData;

  form = this.formBuilder.nonNullable.group({
    newAvailableBalance: [
      this.employeeData.currentSystemBalance,
      [Validators.required, Validators.min(0)],
    ],
    justification: [
      "",
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500),
      ],
    ],
  });

  submitting = false;

  ngOnInit(): void {
    // Initialized in property declaration
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.submitting = true;
    const formValue = this.form.getRawValue();

    const dto: ManualBalanceUpdateDto = {
      employeeId: this.employeeData.employeeId,
      newAvailableBalance: formValue.newAvailableBalance,
      justification: formValue.justification,
    };

    this.apiResponseService
      .onPost<boolean>(Endpoints.HR.VacationBalanceAdmin.manualUpdate, dto)
      .then(() => {
        this.submitting = false;
        this.ref.close(true);
      })
      .catch(() => {
        this.submitting = false;
      });
  }
}
