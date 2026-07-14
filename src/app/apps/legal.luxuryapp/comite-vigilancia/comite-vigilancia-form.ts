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
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IComiteVigilanciaForm {
  id: FormControl<string | null>;
  propertyMemberId: FormControl<string | null>;
  nameProperty: FormControl<SelectItemDto | null>;
  ePosicionComite: FormControl<SelectItemDto | null>;
  customerId: FormControl<string | null>;
}

@Component({
  selector: "app-comite-vigilancia-form",
  templateUrl: "./comite-vigilancia-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    InputAutocomplete,
    WebButtonLabelSave,
  ],
})
export class ComiteVigilanciaForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id: string = "";

  // Signals para ComboBoxes
  cb_position = signal<SelectItemDto[]>([]);
  cb_condomino = signal<SelectItemDto[]>([]);

  form: FormGroup<IComiteVigilanciaForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    propertyMemberId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    nameProperty: new FormControl<SelectItemDto | null>(null),
    ePosicionComite: new FormControl<SelectItemDto | null>(null, {
      validators: [Validators.required],
    }),
    customerId: new FormControl<string | null>(this.customerIdS.customerId()),
  });

  async ngOnInit(): Promise<void> {
    this.id = this.config.data.id;

    await this.onLoadSelectItems();

    if (this.id) {
      await this.onLoadData();
    }
  }

  async onLoadSelectItems(): Promise<void> {
    const [condominos, positions] = await Promise.all([
      this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
        Endpoints.SelectItems.propertyMembersByCustomer(
          this.customerIdS.customerId(),
        ),
      ),
      firstValueFrom(this.enumSelectS.typePosicionComite()),
    ]);

    this.cb_condomino.set(condominos as SelectItemDto[]);
    this.cb_position.set(positions);
  }

  async onLoadData(): Promise<void> {
    const result: any = await this.apiResponseS.onGetItem(
      Endpoints.CommitteeVigilance.getById(this.id),
    );

    const propertyMemberId =
      typeof result.propertyMemberId === "object"
        ? result.propertyMemberId.value
        : result.propertyMemberId;

    // Buscar el condomino completo
    const selectedCondomino = this.cb_condomino().find(
      (item) => item.value === propertyMemberId,
    );

    this.form.patchValue({
      ...result,
      propertyMemberId,
      nameProperty: selectedCondomino || null,
    });
  }

  saveCondominoId = (item: SelectItemDto) => {
    this.form.patchValue({
      propertyMemberId: item?.value,
      nameProperty: item ?? null,
    });
  };

  onSubmit() {
    FormHelper.submitCrud({
      form: this.form,
      api: this.apiResponseS,
      endpoint: Endpoints.CommitteeVigilance.create,
      id: this.id,
      ref: this.ref,
      submitting: this.submitting,
      transformPayload: () => ({
        customerId: this.form.get("customerId")?.value,
        propertyMemberId: this.form.get("propertyMemberId")?.value,
        ePosicionComite: this.form.get("ePosicionComite")?.value,
      }),
    });
  }
}
