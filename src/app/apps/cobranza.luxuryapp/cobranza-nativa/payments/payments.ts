import { CommonModule, CurrencyPipe, DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { TableModule } from "@ui/web/primeng-table/primeng-table";

import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
import { DateService } from "src/app/core/services/date.service";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import {
  ApplyPaymentToChargesDTO,
  PendingChargeDTO,
} from "../interfaces/charge-allocation.dto";
import {
  CobranzaPaymentResponseDTO,
  CreateCobranzaPaymentDTO,
} from "../interfaces/cobranza-payment.dto";
import { EPaymentMethod, EPaymentStatus } from "../interfaces/enums";

import { WebButtonLabel } from "@ui/buttons/web-label/button";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";

interface IPaymentForm {
  propertyId: FormControl<string>;
  amount: FormControl<number>;
  paymentDate: FormControl<Date | string | null>;
  method: FormControl<EPaymentMethod>;
  reference: FormControl<string>;
  notes: FormControl<string>;
}

@Component({
  selector: "app-cobranza-payments",
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputCheckSignal,
    CustomInputCurrencySignal,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    WebButtonLabelSave,
    WebButtonLabel,
    AppIcon,
  ],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./payments.html",
})
export class Payments implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private dialogHandler = inject(DialogHandlerService);
  private toastService = inject(CustomToastService);
  private customerIdS = inject(CustomerIdService);
  private dateS = inject(DateService);

  EPaymentMethod = EPaymentMethod;

  customerId = signal<string>("");
  properties = signal<{ label: string; value: string }[]>([]);
  pendingCharges = signal<PendingChargeDTO[]>([]);

  selectedPropertyName = signal<string>("");
  totalDebt = computed(() =>
    this.pendingCharges().reduce((sum, c) => sum + c.balance, 0),
  );

  totalSelectedToApply = computed(() =>
    this.pendingCharges()
      .filter((c) => c._selected)
      .reduce((sum, c) => sum + (c._applyAmount || 0), 0),
  );

  form = new FormGroup<IPaymentForm>({
    propertyId: new FormControl("", {
      nonNullable: true,
      validators: [Validators.required],
    }),
    amount: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01)],
    }),
    paymentDate: new FormControl(new Date(), {
      nonNullable: true,
      validators: [Validators.required],
    }),
    method: new FormControl(EPaymentMethod.ElectronicTransfer, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    reference: new FormControl(""),
    notes: new FormControl(""),
  });

  paymentMethods = [
    {
      label: "Transferencia Electrónica",
      value: EPaymentMethod.ElectronicTransfer,
    },
    { label: "Depósito / Efectivo", value: EPaymentMethod.Cash },
    { label: "Tarjeta de Crédito", value: EPaymentMethod.CreditCard },
    { label: "Tarjeta de Débito", value: EPaymentMethod.DebitCard },
    { label: "Cheque Nominativo", value: EPaymentMethod.NominativeCheck },
  ];

  submitting = signal<boolean>(false);
  loadingCharges = signal<boolean>(false);

  getChargeTypeLabel(charge: PendingChargeDTO): string {
    return charge.chargeTypeName || "Sin tipo";
  }

  getChargeTypeMeta(charge: PendingChargeDTO): string {
    const parts = [
      charge.chargeTypeAccountNumber,
      charge.chargeTypeCode,
    ].filter((value): value is string => !!value);
    return parts.join(" · ");
  }

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) {
        this.customerId.set(customerId);
        this.loadProperties();
      }
    });
  }

  ngOnInit() {
    this.form.controls.propertyId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.pendingCharges.set([]);
        this.selectedPropertyName.set("");
        this.form.controls.amount.setValue(0);
      });
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      Endpoints.SelectItems.properties(this.customerId()),
    );
    if (res) {
      this.properties.set(res.map((p) => ({ label: p.label, value: p.value })));
    }
  }

  async searchPendingCharges() {
    const propertyId = this.form.controls.propertyId.value;
    if (!propertyId) return;

    const prop = this.properties().find((p) => p.value === propertyId);
    if (prop) this.selectedPropertyName.set(prop.label);

    this.loadingCharges.set(true);
    try {
      const res = await this.apiResponseS.onGetItem<PendingChargeDTO[]>(
        Endpoints.CobranzaCore.Payments.pendingCharges(
          propertyId,
          this.customerId(),
        ),
      );
      if (res) {
        res.forEach((c) => {
          c._selected = false;
          c._applyAmount = c.balance;
        });
        this.pendingCharges.set(res);

        const total = res.reduce((sum, c) => sum + c.balance, 0);
        this.form.controls.amount.setValue(total);
        if (total > 0) {
          this.autoAllocate();
        }
      }
    } finally {
      this.loadingCharges.set(false);
    }
  }

  autoAllocate() {
    let remainingAmount = this.form.controls.amount.value || 0;
    const currentCharges = [...this.pendingCharges()];

    for (const c of currentCharges) {
      if (remainingAmount >= c.balance) {
        c._selected = true;
        c._applyAmount = c.balance;
        remainingAmount -= c.balance;
      } else if (remainingAmount > 0) {
        c._selected = true;
        c._applyAmount = Number(remainingAmount.toFixed(2));
        remainingAmount = 0;
      } else {
        c._selected = false;
        c._applyAmount = c.balance;
      }
    }
    this.pendingCharges.set(currentCharges);
  }

  onChargeSelectionChange(charge: PendingChargeDTO) {
    if (charge._selected) {
      charge._applyAmount = charge.balance;
    }
    this.pendingCharges.update((charges) => [...charges]);
  }

  onApplyAmountChange(charge: PendingChargeDTO, event: Event) {
    const input = event.target as HTMLInputElement;
    let val = parseFloat(input.value);

    if (isNaN(val) || val < 0) val = 0;
    if (val > charge.balance) val = charge.balance;

    charge._applyAmount = val;
    input.value = val.toString();
    charge._selected = val > 0;

    this.pendingCharges.update((charges) => [...charges]);
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const availableToApply = this.form.controls.amount.value;
    const totalSelected = this.totalSelectedToApply();

    if (totalSelected > availableToApply + 0.01) {
      this.toastService.showWarn(
        "Revisa los montos",
        "El total asignado a los cargos no puede ser mayor al monto del pago recibido.",
      );
      return;
    }

    const selectedCharges = this.pendingCharges().filter(
      (c) => c._selected && (c._applyAmount || 0) > 0,
    );
    if (selectedCharges.length === 0) {
      if (
        !confirm(
          "No has seleccionado ningún cargo para aplicar el pago. El pago quedará registrado como saldo a favor sin aplicar. ¿Continuar?",
        )
      ) {
        return;
      }
    }

    this.submitting.set(true);

    try {
      const paymentPayload: CreateCobranzaPaymentDTO = {
        customerId: this.customerId(),
        propertyId: this.form.controls.propertyId.value,
        amount: this.form.controls.amount.value,
        paymentDate:
          this.dateS.getDateFormat(this.form.controls.paymentDate.value) ?? "",
        method: this.form.controls.method.value,
        reference: this.form.controls.reference.value,
        status: EPaymentStatus.Registrado,
      };

      const paymentRes =
        await this.apiResponseS.onPost<CobranzaPaymentResponseDTO>(
          Endpoints.CobranzaCore.Payments.create,
          paymentPayload,
        );

      if (paymentRes && selectedCharges.length > 0) {
        const allocationPayload: ApplyPaymentToChargesDTO = {
          paymentId: paymentRes.id,
          appliedBy: this.authS.infoUserAuth?.fullName || "Sistema",
          notes: this.form.controls.notes.value,
          allocations: selectedCharges.map((c) => ({
            chargeId: c.id,
            amountToApply: c._applyAmount!,
          })),
        };

        const applyRes = await this.apiResponseS.onPost(
          Endpoints.CobranzaCore.Payments.applyToCharges,
          allocationPayload,
        );

        if (applyRes) {
          this.toastService.showSuccess(
            "Pago Registrado",
            "El pago fue aplicado a los cargos exitosamente.",
          );
          this.form.reset({
            propertyId: this.form.controls.propertyId.value,
            paymentDate: new Date(),
            method: EPaymentMethod.ElectronicTransfer,
            amount: 0,
          });
          this.form.controls.propertyId.setValue("");
          this.pendingCharges.set([]);
        }
      } else if (paymentRes && selectedCharges.length === 0) {
        this.toastService.showSuccess(
          "Pago Registrado",
          "El pago fue registrado como saldo a favor, sin aplicarse a cargos específicos.",
        );
        this.form.controls.propertyId.setValue("");
      }
    } finally {
      this.submitting.set(false);
    }
  }
}

