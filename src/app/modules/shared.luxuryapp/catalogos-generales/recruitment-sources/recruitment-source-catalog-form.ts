import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSwitch } from "@ui/inputs/web/custom-input-switch-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { RecruitmentSourceCatalogDTO } from "./interfaces/recruitment-source-catalog.dto";
import { RecruitmentSourceCatalogFormGroup } from "./interfaces/recruitment-source-catalog-form.interface";

@Component({
  selector: "app-recruitment-source-catalog-form",
  templateUrl: "./recruitment-source-catalog-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSwitch,
    WebButtonLabelSave,
  ],
})
export class RecruitmentSourceCatalogForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);

  id: string = "";

  form: FormGroup<RecruitmentSourceCatalogFormGroup> = this.formB.group({
    id: new FormControl<string | null>({ value: "", disabled: true }),
    name: new FormControl("", {
      validators: [Validators.required, Validators.maxLength(100)],
      nonNullable: true,
    }),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit(): void {
    this.id = this.config.data?.id ?? "";
    if (this.id) this.onLoadData();
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem<RecruitmentSourceCatalogDTO>(
        Endpoints.Catalogs.RecruitmentSources.getById(this.id),
      )
      .then((result) => {
        if (result) this.form.patchValue(result);
      });
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.Catalogs.RecruitmentSources.create,
      id: this.id || null,
      ref: this.ref,
      submitting: this.submitting,
    });
  }
}