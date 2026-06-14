import { Component, inject, OnInit, signal } from "@angular/core";
import { Endpoints } from "src/app/core/constants/endpoints";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomButtonSave } from "src/app/core/components/buttons/web/custom-button-save";
import { CustomInputDateSignal } from "src/app/core/components/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "src/app/core/components/inputs/web/custom-input-text-signal";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { DateService } from "src/app/core/services/date.service";

interface IPeriodoCedulaForm {
  id: FormControl<number | null>;
  desde: FormControl<Date | null>;
  hasta: FormControl<Date | null>;
}

@Component({
  selector: "app-periodo-cedula-form",
  templateUrl: "./periodo-cedula-form.html",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomButtonSave,
    CardModule,
  ],
})
export class PeriodoCedulaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  dateS = inject(DateService);
  ref = inject(DynamicDialogRef);
  formB = inject(FormBuilder);

  id = 0;
  submitting = signal(false);

  form: FormGroup<IPeriodoCedulaForm> = this.formB.group({
    id: new FormControl<number | null>({ value: null, disabled: true }),
    desde: new FormControl<Date | null>(null, { validators: [Validators.required] }),
    hasta: new FormControl<Date | null>(null, { validators: [Validators.required] }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;

    if (this.id !== 0) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.PeriodoPresupuestals.getById(this.id))
      .then((result: any) => {
        this.form.patchValue({
          id: result.id,
          desde: this.dateS.parseDate(result.desde),
          hasta: this.dateS.parseDate(result.hasta),
        });
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.PeriodoPresupuestals.base,
      id: this.id === 0 ? null : String(this.id),
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: (value) => {
        return {
          id: this.id, // usually id is not needed for POST but sending doesn't hurt unless API complains.
          desde: this.dateS.getDateFormat(value.desde),
          hasta: this.dateS.getDateFormat(value.hasta),
        };
      }
    });
  }
}









