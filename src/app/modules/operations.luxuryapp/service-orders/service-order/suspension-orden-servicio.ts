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
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { CustomerIdService } from "@core/auth/services/customer-id.service";
import { Endpoints } from "@core/constants/endpoints/endpoints";
import { ApiResponseService } from "@core/http/services/api-response.service";
import {
  DynamicDialogConfig,
  DynamicDialogRef,
} from "@core/services/dialog-handler.service";
import { SelectItemDto } from "@core/interfaces/select-item.dto";

interface ISuspensionForm {
  suspensionReasonId: FormControl<string | null>;
  suspensionNotes: FormControl<string | null>;
}

@Component({
  selector: "app-suspension-orden-servicio",
  templateUrl: "./suspension-orden-servicio.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    WebButtonLabelSave,
    CustomInputSelectSignal,
    CustomInputTextAreaSignal,
  ],
})
export class SuspensionOrdenServicio implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private config = inject(DynamicDialogConfig);
  private ref = inject(DynamicDialogRef);

  submitting = signal(false);
  reasons = signal<SelectItemDto[]>([]);
  serviceOrderId: string = this.config.data.id;
  currentReasonId: string | null = this.config.data.suspensionReasonId ?? null;

  form: FormGroup<ISuspensionForm> = new FormGroup<ISuspensionForm>({
    suspensionReasonId: new FormControl<string | null>(
      this.currentReasonId,
      [Validators.required],
    ),
    suspensionNotes: new FormControl<string | null>(
      this.config.data.suspensionNotes ?? null,
      [Validators.maxLength(300)],
    ),
  });

  async ngOnInit(): Promise<void> {
    await this.loadReasons();
  }

  private async loadReasons(): Promise<void> {
    const data = await this.apiResponseS.onGetList<any[]>(
      Endpoints.ServiceOrderSuspensionReasons.list(
        this.customerIdS.customerId(),
      ),
    );
    const items = data ?? [];
    this.reasons.set(
      items.map((x: any) => ({ value: x.id, label: x.name })) as SelectItemDto[],
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);
    const payload = {
      suspensionReasonId: this.form.value.suspensionReasonId,
      suspensionNotes: this.form.value.suspensionNotes,
    };

    const result = await this.apiResponseS.onPost<boolean>(
      Endpoints.ServiceOrders.suspend(this.serviceOrderId),
      payload,
    );

    this.submitting.set(false);
    if (result !== false) {
      this.ref.close(true);
    }
  }
}
