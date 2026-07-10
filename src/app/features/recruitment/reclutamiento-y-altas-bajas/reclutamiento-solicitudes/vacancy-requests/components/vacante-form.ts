import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";

import { LxCard } from "@ui/adaptive/card/card";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
@Component({
  selector: "app-vacante-form",
  templateUrl: "./vacante-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    LxCard,
  ],
})
export class VacanteForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);
  private enumSelectS = inject(EnumSelectService);
  submitting = signal(false);

  cb_status = signal<ISelectItem[]>([]);
  cb_fuente = signal<ISelectItem[]>([]);
  id: string = "";

  form = this.formB.nonNullable.group({
    id: [{ value: this.id, disabled: true }],
    folio: ["", Validators.required],
    status: [null as number | null, Validators.required],
    requestDate: [null as string | null, Validators.required],
    selectionDate: [null as string | null],
    entryDate: [null as string | null],
    observations: [""],
    workPositionId: [this.config.data.workPositionId],
    fuente: [this.config.data.workPositionId], // Keeping original logic despite looking odd
  });

  async ngOnInit() {
    this.cb_status.set(await firstValueFrom(this.enumSelectS.status()));
    this.cb_fuente.set(
      await firstValueFrom(this.enumSelectS.fuenteReclutamiento()),
    );
    this.id = this.config.data.id;
    if (this.id) {
      this.onLoadData();
      this.form.controls.id.setValue(this.id);
    }
  }

  onLoadData() {
    const urlApi = `RequestPosition/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: "RequestPosition",
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
