import {
  ChangeDetectionStrategy,
  Component,
  inject,
  type OnInit,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { DynamicDialogConfig, DynamicDialogRef } from "src/app/core/services/dialog-handler.service";
// import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { CustomerProviderFormGroup } from "./interfaces/customer-provider-form.interface";

@Component({
  selector: "app-customer-provider-form",
  imports: [
    AppIcon,
    ReactiveFormsModule,
    InputAutocomplete,
    WebButtonLabelSave,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./customer-provider-form.html",
})
export class CustomerProviderForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  customerIdS = inject(CustomerIdService);
  formB = inject(FormBuilder);
  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_providers = signal<SelectItemDto[]>([]);
  cb_categories = signal<SelectItemDto[]>([]);

  form: FormGroup<CustomerProviderFormGroup> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId(), {
      validators: [Validators.required],
    }),
    providerId: new FormControl("", { validators: [Validators.required] }),
    providerName: new FormControl<string | null>(null),
    categoryId: new FormControl<number | null>(null, {
      validators: [Validators.required],
    }),
    categoryName: new FormControl<string | null>(null),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onLoadSelectItem();

    if (this.id !== "") {
      await this.onLoadData();
    }
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.CustomerProvider.getById(this.id),
    );

    // Extraer IDs
    const providerId =
      typeof result.providerId === "object"
        ? result.providerId.value
        : result.providerId;
    const categoryId =
      typeof result.categoryId === "object"
        ? result.categoryId.value
        : result.categoryId;

    // Buscar objetos completos
    const selectedProvider = this.cb_providers().find(
      (item) => item.value === providerId,
    );
    const selectedCategory = this.cb_categories().find(
      (item) => item.value === categoryId,
    );

    this.form.patchValue({
      ...result,
      providerId,
      providerName: selectedProvider || null,
      categoryId,
      categoryName: selectedCategory || null,
    });
  }

  async onLoadSelectItem(): Promise<void> {
    const [providers, categories] = await Promise.all([
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.providers(this.customerIdS.customerId()),
      ),
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.categories,
      ),
    ]);

    this.cb_providers.set(providers as SelectItemDto[]);
    this.cb_categories.set(categories as SelectItemDto[]);
  }

  saveProviderId = (item: SelectItemDto) =>
    this.form.patchValue({
      providerId: item?.value,
      providerName: item?.label,
    });
  saveCategoryId = (item: SelectItemDto) =>
    this.form.patchValue({
      categoryId: item?.value,
      categoryName: item?.label,
    });

  submit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: this.id
        ? Endpoints.CustomerProvider.update(this.id)
        : Endpoints.CustomerProvider.create,
      id: this.id,
      method: this.id ? "PUT" : "POST",
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => {
        const { providerName, categoryName, ...rest } = this.form.value;
        return rest;
      },
    });
  }
}
