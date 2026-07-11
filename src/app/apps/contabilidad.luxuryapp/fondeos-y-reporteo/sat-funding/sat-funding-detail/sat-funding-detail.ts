import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { CustomToastService } from "src/app/core/services/custom-toast.service";
// PrimeNG Modules
import { WebButtonIconConfirm } from "@ui/buttons/web-icon/button-confirm";
import { WebButtonIconEdit } from "@ui/buttons/web-icon/button-edit";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";

import { LxCard } from "@ui/adaptive/card/card";
import { InputSelect } from "@ui/inputs/adaptive/input-select/input-select";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import {
  BulkUpdateTipoGastoDto,
  SatCfdiDto,
  SatDownloadRequestDto,
  SatFundingDetailDto,
} from "src/app/core/interfaces/sat-funding-detail.interface";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { SatFundingInvoiceEditFormComponent } from "./sat-funding-invoice-edit-form";

@Component({
  selector: "app-sat-funding-detail",
  templateUrl: "./sat-funding-detail.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    WebButtonIconConfirm,
    WebButtonIconEdit,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputTextSignal,
    DialogModule,
    InputSelect,
    CustomInputDateSignal,
    LxTooltipDirective,
    WebButtonLabelSave,
    LxCard,
    AppIcon,
  ],
})
export class SatFundingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public apiResponseService = inject(ApiResponseService);
  private customToastService = inject(CustomToastService);
  private formBuilder = inject(FormBuilder);
  private dialogHandlerService = inject(DialogHandlerService);
  private tableScrollHeightS = inject(TableScrollHeightService);
  fundingId: string = "";

  data = signal<SatFundingDetailDto | null>(null);
  invoices = signal<SatCfdiDto[]>([]);
  selection: SatCfdiDto[] = [];
  bulkTipoGasto = signal<number | null>(null);
  submitting = signal(false);
  scrollHeight = this.tableScrollHeightS.scrollHeight;

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

  form = this.formBuilder.nonNullable.group({
    startDate: [null as string | null, [Validators.required]],
    endDate: [null as string | null, [Validators.required]],
  });

  ngOnInit(): void {
    this.fundingId = this.route.snapshot.paramMap.get("id")!;
    if (this.fundingId) {
      this.onLoadData();
    }
  }

  onLoadData() {
    this.apiResponseService
      .onGetItem<SatFundingDetailDto>(`SatFunding/${this.fundingId}`)
      .then((result) => {
        if (result) {
          this.data.set(result);
          this.invoices.set(result.invoices);
        }
      });
  }

  getTipoGastoLabel(value: number): string {
    const tipo = this.tiposGasto.find((t) => t.value === value);
    return tipo ? tipo.label : "Desconocido";
  }

  onSubmitDownload() {
    if (!this.form.valid) return;

    this.submitting.set(true);

    const request: SatDownloadRequestDto = {
      satFundingId: this.fundingId,
      startDate: this.form.value.startDate,
      endDate: this.form.value.endDate,
    };

    this.apiResponseService
      .onPost("SatFunding/RequestDownload", request)
      .then(() => {
        this.onLoadData(); // Refresh data after processing
      })
      .finally(() => this.submitting.set(false));
  }

  onRowEditInit(invoice: SatCfdiDto) {
    this.dialogHandlerService
      .openDialog(
        SatFundingInvoiceEditFormComponent,
        invoice,
        "Editar Factura",
        this.dialogHandlerService.sizeSm,
      )
      .then((result: boolean) => {
        if (result) {
          this.onLoadData();
        }
      });
  }

  onRowReorder(event: any) {
    const orderedIds = this.invoices().map((i) => i.satFundingDetailId);
    this.apiResponseService.onPut("SatFunding/UpdateOrder", orderedIds);
  }

  onBulkUpdate(newTipoGasto: any) {
    if (!this.selection || this.selection.length === 0 || !newTipoGasto) {
      this.customToastService.showWarn(
        "Advertencia",
        "Seleccione al menos una factura y un nuevo tipo de gasto.",
      );
      return;
    }

    const request: BulkUpdateTipoGastoDto = {
      satFundingDetailIds: this.selection.map((s) => s.satFundingDetailId),
      newTipoGasto: newTipoGasto,
    };

    this.apiResponseService
      .onPut("SatFunding/BulkUpdateTipoGasto", request)
      .then(() => {
        this.onLoadData();
        this.selection = [];
      });
  }
}
