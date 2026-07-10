import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CardModule } from "primeng/card";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
import { SignalRService } from "src/app/core/services/signalr.service";

@Component({
  selector: "app-funding-form",
  templateUrl: "./funding-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CardModule,
    CustomInputSelectSignal,
    WebButtonLabelSave,
  ],
})
export class FundingForm implements OnInit {
  apiResponseS = inject(ApiResponseService);
  private signalRS = inject(SignalRService);
  private config = inject(DynamicDialogConfig);
  private customerIdS = inject(CustomerIdService);
  private ref = inject(DynamicDialogRef);
  private destroyRef = inject(DestroyRef);

  // --- ESTADO DEL COMPONENTE ---
  public id: string = "";
  public submitting = signal(false);
  public cb_fondeos = signal<ISelectItem[]>([]);

  // Definición Estricta del Formulario
  public form = new FormGroup({
    id: new FormControl<string>({ value: "", disabled: true }),
    period: new FormControl<string | null>(null),
    customerId: new FormControl<string>(this.customerIdS.customerId()),
  });

  constructor() {
    this.signalRS.messageReceived$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.onLoadData();
      });
  }

  ngOnInit(): void {
    this.id = this.config.data?.id || "";
    this.form.patchValue({ id: this.id });

    if (this.id) {
      this.onLoadData();
    }

    const urlApi = `funding-period/${this.customerIdS.customerId()}`;
    this.apiResponseS
      .onGetSelectItem<ISelectItem[]>(urlApi)
      .then((result: ISelectItem[]) => {
        this.cb_fondeos.set(result);
      });
  }

  onLoadData(): void {
    if (!this.id) return;

    console.log(`Cargando datos para el ID: ${this.id}`);
    const urlApi = `funding/${this.id}`;
    this.apiResponseS.onGetItem(urlApi).then((result: any) => {
      this.form.patchValue(result);
    });
  }

  onSubmit(): void {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    this.form.patchValue({
      customerId: this.customerIdS.customerId(),
    });

    this.apiResponseS
      .onPost(`funding`, this.form.value)
      .then((result: boolean) => {
        if (result) {
          this.ref.close(true);
        } else {
          this.submitting.set(false);
        }
      });
  }
}
