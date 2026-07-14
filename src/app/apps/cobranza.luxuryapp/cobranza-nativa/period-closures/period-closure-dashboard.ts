import { DatePipe } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { LxTooltipDirective } from "@ui/adaptive/tooltip";
import { WebButtonIcon } from "@ui/buttons/web-icon/button";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputNumberSignal } from "@ui/inputs/web/custom-input-number-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { DataViewMobile } from "@ui/mobile/data-view-mobile/data-view-mobile";
import { MobileListItem } from "@ui/mobile/list-item/list-item";
import { AppIcon } from "@ui/shared/app-icon/app-icon.component";
import { PrimeNgCustomCaption } from "@ui/web/primeng-custom-caption/primeng-custom-caption";
import { TableModule } from "primeng/table";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PeriodClosureResponseDTO } from "../interfaces/period-closure.dto";

@Component({
  selector: "app-period-closure-dashboard",
  imports: [
    WebButtonIcon,
    LxTooltipDirective,
    TableModule,
    PrimeNgCustomCaption,
    WebButtonLabel,
    DataViewMobile,
    MobileListItem,
    DatePipe,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
    AppIcon,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./period-closure-dashboard.html",
})
export default class PeriodClosureDashboard {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private authS = inject(AuthService);

  tablePrimeNgRows = tablePrimeNgRows();
  rowsPerPageOptions = rowsPerPageOptions();
  scrollHeight = inject(TableScrollHeightService).scrollHeight;

  dataSignal = signal<PeriodClosureResponseDTO[]>([]);
  submitting = signal(false);

  yearCtrl = new FormControl<number>(new Date().getFullYear(), {
    nonNullable: true,
    validators: [Validators.required],
  });
  monthCtrl = new FormControl<number>(new Date().getMonth() + 1, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(12)],
  });
  notesCtrl = new FormControl<string>("", {
    nonNullable: true,
    validators: [Validators.maxLength(500)],
  });

  monthOptions = [
    { label: "Enero", value: 1 },
    { label: "Febrero", value: 2 },
    { label: "Marzo", value: 3 },
    { label: "Abril", value: 4 },
    { label: "Mayo", value: 5 },
    { label: "Junio", value: 6 },
    { label: "Julio", value: 7 },
    { label: "Agosto", value: 8 },
    { label: "Septiembre", value: 9 },
    { label: "Octubre", value: 10 },
    { label: "Noviembre", value: 11 },
    { label: "Diciembre", value: 12 },
  ];

  currentPeriodClosed = computed(() => {
    const y = this.yearCtrl.value;
    const m = this.monthCtrl.value;
    return this.dataSignal().some(
      (p) => p.year === y && p.month === m && p.isClosed,
    );
  });

  get operatorName(): string {
    return this.authS.infoUserAuth?.fullName ?? "operador";
  }

  constructor() {
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData(customerId);
    });
  }

  async onLoadData(customerId: string) {
    const res = await this.apiResponseS.onGetItem<PeriodClosureResponseDTO[]>(
      Endpoints.CobranzaNative.PeriodClosures.byCustomer(
        customerId,
      ),
    );
    this.dataSignal.set(res ?? []);
  }

  async onClosePeriod() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.submitting.set(true);
    try {
      const ok = await this.apiResponseS.onPost(
        Endpoints.CobranzaNative.PeriodClosures.close(
          customerId,
        ),
        {
          year: this.yearCtrl.value,
          month: this.monthCtrl.value,
          closedBy: this.operatorName,
          notes: this.notesCtrl.value || null,
        },
      );
      if (ok) {
        this.notesCtrl.reset("");
        await this.onLoadData(customerId);
      }
    } finally {
      this.submitting.set(false);
    }
  }

  async onReopenPeriod(item: PeriodClosureResponseDTO) {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.submitting.set(true);
    try {
      const ok = await this.apiResponseS.onPost(
        Endpoints.CobranzaNative.PeriodClosures.reopen(
          customerId,
        ),
        {
          year: item.year,
          month: item.month,
          reopenedBy: this.operatorName,
          reason: "Reapertura manual",
        },
      );
      if (ok) await this.onLoadData(customerId);
    } finally {
      this.submitting.set(false);
    }
  }

  monthName(month: number): string {
    return (
      this.monthOptions.find((m) => m.value === month)?.label ?? String(month)
    );
  }
}

