import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { firstValueFrom } from "rxjs";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { FormHelper } from "src/app/core/helpers/form-helper";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  ComiteVigilanciaEditData,
} from "src/app/core/interfaces/comite-vigilancia.interface";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";

interface IComiteVigilanciaForm {
  id: FormControl<string | null>;
  propertyMemberId: FormControl<string | null>;
  nameProperty: FormControl<SelectItemDto | null>;
  ePosicionComite: FormControl<string | number | null>;
  customerId: FormControl<string | null>;
}

@Component({
  selector: "app-comite-vigilancia-form",
  templateUrl: "./comite-vigilancia-form.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  cdr = inject(ChangeDetectorRef);
  config = inject(DynamicDialogConfig);
  customerIdS = inject(CustomerIdService);
  enumSelectS = inject(EnumSelectService);
  formB = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  submitting = signal(false);
  id = "";

  cb_position = signal<SelectItemDto[]>([]);
  cb_condomino = signal<SelectItemDto[]>([]);

  form: FormGroup<IComiteVigilanciaForm> = this.formB.group({
    id: new FormControl({ value: "", disabled: true }),
    propertyMemberId: new FormControl<string | null>(null, {
      validators: [Validators.required],
    }),
    nameProperty: new FormControl<SelectItemDto | null>(null),
    ePosicionComite: new FormControl<string | number | null>(null, {
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
    const result = await this.apiResponseS.onGetItem<ComiteVigilanciaEditData>(
      Endpoints.CommitteeVigilance.getById(this.id),
    );

    if (!result) {
      return;
    }

    const propertyMemberId = result.propertyMemberId;

    const selectedCondomino = this.cb_condomino().find((item) =>
      this.areSameValue(item.value, propertyMemberId),
    );
    const resolvedCondomino =
      selectedCondomino ||
      this.buildFallbackPropertyMember(
        propertyMemberId,
        result.propertyMemberName || this.config.data?.nameProperty,
      );

    const selectedPosition = this.cb_position().find((item) =>
      this.areSameValue(item.value, result.posicionComite),
    );

    if (
      resolvedCondomino &&
      !this.cb_condomino().some((item) =>
        this.areSameValue(item.value, resolvedCondomino.value),
      )
    ) {
      this.cb_condomino.update((items) => [...items, resolvedCondomino]);
    }

    this.form.patchValue({
      propertyMemberId,
      nameProperty: resolvedCondomino,
      ePosicionComite: selectedPosition?.value ?? result.posicionComite,
      customerId: result.customerId,
    });
    this.cdr.detectChanges();
  }

  saveCondominoId = (item: SelectItemDto) => {
    this.form.patchValue({
      propertyMemberId: item?.value,
      nameProperty: item ?? null,
    });
    this.cdr.detectChanges();
  };

  private areSameValue(left: unknown, right: unknown): boolean {
    if (left == null || right == null) {
      return false;
    }

    return (
      left.toString().trim().toLowerCase() ===
      right.toString().trim().toLowerCase()
    );
  }

  private buildFallbackPropertyMember(
    propertyMemberId: string,
    propertyMemberName?: string | null,
  ): SelectItemDto | null {
    if (!propertyMemberId || !propertyMemberName?.trim()) {
      return null;
    }

    return {
      value: propertyMemberId,
      label: propertyMemberName.trim(),
    };
  }

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
        posicionComite: this.form.get("ePosicionComite")?.value,
      }),
    });
  }
}
