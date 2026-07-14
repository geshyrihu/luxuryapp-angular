import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CatalogoRevisionesInspeccionFormGroup } from "./interfaces/catalogo-revisiones-inspeccion-form.interface";

@Component({
  selector: "app-catalogo-revisiones-inspeccion-form",
  imports: [ReactiveFormsModule, CustomInputTextSignal, WebButtonLabelSave],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./catalogo-revisiones-inspeccion-form.html",
})
export class CatalogoRevisionesInspeccionForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);
  id: string = "";
  submitting = signal(false);

  form: FormGroup<CatalogoRevisionesInspeccionFormGroup> = new FormGroup({
    id: new FormControl<string>(
      { value: "", disabled: true },
      { nonNullable: true },
    ),
    description: new FormControl<string>("", {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this.id = this.config.data.id;
    if (this.id !== "") this.onLoadData();
    this.form.controls.id.setValue(this.id);
  }
  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.InspectionReviewCatalog.getById(this.id))
      .then((result: any) => {
        this.form.patchValue(result);
      });
  }
  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.InspectionReviewCatalog.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => this.form.getRawValue(),
    });
  }
}
