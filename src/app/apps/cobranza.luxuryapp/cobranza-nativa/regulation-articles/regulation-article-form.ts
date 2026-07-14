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
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  CreateRegulationArticleDTO,
  UpdateRegulationArticleDTO,
} from "../interfaces/property-fine.dto";

interface IRegulationArticleForm {
  articleNumber: FormControl<string>;
  title: FormControl<string>;
  content: FormControl<string>;
  defaultFineAmount: FormControl<number | null>;
  isActive: FormControl<boolean>;
}

@Component({
  selector: "app-regulation-article-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputDecimal,
    CustomInputCheckSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./regulation-article-form.html",
})
export class RegulationArticleForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  submitting = signal(false);

  form = new FormGroup<IRegulationArticleForm>({
    articleNumber: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    title: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(200)],
    }),
    content: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    defaultFineAmount: new FormControl<number | null>(null),
    isActive: new FormControl(true, { nonNullable: true }),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;
    if (this.id) this.loadData();
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.CobranzaNative.RegulationArticles.getById(
        this.id,
      ),
    );
    if (res) this.form.patchValue(res);
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint:
        Endpoints.CobranzaNative.RegulationArticles.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const raw = this.form.getRawValue();
        return this.id
          ? ({
              id: this.id,
              customerId: this.customerId,
              ...raw,
            } as UpdateRegulationArticleDTO)
          : ({
              customerId: this.customerId,
              ...raw,
            } as CreateRegulationArticleDTO);
      },
    });
  }
}

