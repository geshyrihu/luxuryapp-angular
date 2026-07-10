import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { InputTextModule } from "primeng/inputtext";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { UpdateSatFundingDetailDTO } from "src/app/core/interfaces/sat-funding-detail.interface";
import { ISelectItem } from "src/app/core/interfaces/select-Item.interface";
interface ISatFundingInvoiceEditForm {
  id: FormControl<string>;
  bankId: FormControl<number | null>;
  interbankCode: FormControl<string>;
  convenio: FormControl<string>;
  referencia: FormControl<string>;
  tipoGasto: FormControl<number | null>;
}

@Component({
  selector: "app-sat-funding-invoice-edit-form",
  templateUrl: "./sat-funding-invoice-edit-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    CustomInputSelectSignal,
    WebButtonLabelSave,
    CustomInputTextSignal,
  ],
})
export class SatFundingInvoiceEditFormComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private apiResponseService = inject(ApiResponseService);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);
  id: string = "";
  submitting = signal(false);
  form: FormGroup<ISatFundingInvoiceEditForm>;
  banks: ISelectItem[] = [];
  tiposGasto = [
    { value: 1, label: "Fijo" },
    { value: 2, label: "Variable" },
    { value: 3, label: "Caja Chica" },
    { value: 4, label: "Extraordinario" },
    { value: 5, label: "Devoluciones" },
    { value: 6, label: "Tarjeta Debito" },
    { value: 7, label: "Proyectos" },
    { value: 8, label: "Nomina" },
    { value: 9, label: "Impuestos y contribuciones" },
  ];

  ngOnInit(): void {
    this.id = this.config.data.satFundingDetailId;
    this.loadBanks();
    const data = this.config.data;
    this.form = this.formBuilder.group({
      id: new FormControl(data.satFundingDetailId, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      bankId: new FormControl(data.bankId),
      interbankCode: new FormControl(data.interbankCode || "", {
        nonNullable: true,
      }),
      convenio: new FormControl(data.convenio || "", { nonNullable: true }),
      referencia: new FormControl(data.referencia || "", { nonNullable: true }),
      tipoGasto: new FormControl(data.tipoGasto, {
        validators: [Validators.required],
      }),
    });
  }

  loadBanks() {
    this.apiResponseService
      .onGetSelectItem<ISelectItem[]>("Bank")
      .then((result) => {
        if (result) this.banks = result;
      });
  }

  onSubmit() {
    if (!this.apiResponseService.validateForm(this.form)) return;

    this.submitting.set(true);
    const request: UpdateSatFundingDetailDTO =
      this.form.getRawValue() as UpdateSatFundingDetailDTO;

    this.apiResponseService
      .onPut(`SatFunding/UpdateDetail`, request)
      .then((result) => {
        result ? this.ref.close(true) : this.submitting.set(false);
      });
  }
}
