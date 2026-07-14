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
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputDecimal } from "@ui/inputs/web/custom-input-decimal-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  CreatePropertyFineDTO,
  RegulationArticleResponseDTO,
  UpdatePropertyFineDTO,
} from "../interfaces/property-fine.dto";

interface IPropertyFineForm {
  propertyId: FormControl<string>;
  regulationArticleId: FormControl<string | null>;
  description: FormControl<string>;
  infractionDate: FormControl<string>;
  amount: FormControl<number>;
  adminNotes: FormControl<string | null>;
}

@Component({
  selector: "app-property-fine-form",
  imports: [
    ReactiveFormsModule,
    CustomInputTextAreaSignal,
    CustomInputDecimal,
    CustomInputDateSignal,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./property-fine-form.html",
})
export class PropertyFineForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  id: string = "";
  customerId: string = "";
  submitting = signal(false);

  properties = signal<{ label: string; value: string }[]>([]);
  articles = signal<{ label: string; value: string }[]>([]);

  form = new FormGroup<IPropertyFineForm>({
    propertyId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    regulationArticleId: new FormControl<string | null>(null),
    description: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(500)],
    }),
    infractionDate: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    adminNotes: new FormControl<string | null>(null),
  });

  ngOnInit() {
    this.id = this.config.data.id;
    this.customerId = this.config.data.customerId;
    this.loadSelectData();
    if (this.id) this.loadData();
  }

  private async loadSelectData() {
    const props = await this.apiResponseS.onGetItem<
      { label: string; value: string }[]
    >(Endpoints.SelectItems.properties(this.customerId));
    if (props) {
      this.properties.set(props);
    }

    const arts = await this.apiResponseS.onGetItem<
      RegulationArticleResponseDTO[]
    >(
      Endpoints.CobranzaNative.RegulationArticles.byCustomer(
        this.customerId,
      ),
    );
    if (arts) {
      this.articles.set(
        arts
          .filter((a) => a.isActive)
          .map((a) => ({
            label: `${a.articleNumber} é ${a.title}`,
            value: a.id,
          })),
      );
    }
  }

  async loadData() {
    const res = await this.apiResponseS.onGetItem<any>(
      Endpoints.CobranzaNative.PropertyFines.getById(this.id),
    );
    if (res) this.form.patchValue(res);
  }

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CobranzaNative.PropertyFines.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const { propertyId, ...common } = this.form.getRawValue();
        return this.id
          ? ({ id: this.id, ...common } as UpdatePropertyFineDTO)
          : ({
              customerId: this.customerId,
              propertyId,
              ...common,
            } as CreatePropertyFineDTO);
      },
    });
  }
}

