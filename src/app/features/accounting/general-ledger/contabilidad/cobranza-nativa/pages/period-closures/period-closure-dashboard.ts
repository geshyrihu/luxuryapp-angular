import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DatePipe } from "@angular/common";
import { Component, computed, effect, inject, signal } from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { IonIcon, IonItem, IonLabel } from "@ionic/angular/standalone";
import { addIcons } from "ionicons";
import { lockClosedOutline, lockOpenOutline } from "ionicons/icons";
import { TableModule } from "primeng/table";
import { CustomButton } from "src/app/core/components/web/buttons";
import { DataViewMobile } from "src/app/core/components/mobile/data-view-mobile/data-view-mobile";
import { CustomInputNumberSignal } from "src/app/core/components/web/inputs/custom-input-number-signal";
import { CustomInputSelectSignal } from "src/app/core/components/web/inputs/custom-input-select-signal";
import { CustomInputTextSignal } from "src/app/core/components/web/inputs/custom-input-text-signal";
import { PrimeNgCustomCaption } from "src/app/core/components/web/primeng-custom-caption/primeng-custom-caption";
import { Endpoints } from "src/app/core/constants/endpoints";
import {
  rowsPerPageOptions,
  tablePrimeNgRows,
} from "src/app/core/helpers/table-primeng-option";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { TableScrollHeightService } from "src/app/core/services/table-scroll-height.service";
import { PeriodClosureResponseDTO } from "../../models/period-closure.dto";

@Component({
  selector: "app-period-closure-dashboard",
  imports: [
    TableModule,
    PrimeNgCustomCaption,
    CustomButton,
    DataViewMobile,
    IonItem,
    IonLabel,
    IonIcon,
    DatePipe,
    ReactiveFormsModule,
    CustomInputTextSignal,
    CustomInputSelectSignal,
    CustomInputNumberSignal,
   AppIcon],
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
    addIcons({ lockClosedOutline, lockOpenOutline });
    effect(() => {
      const customerId = this.customerIdS.customerId();
      if (customerId) this.onLoadData(customerId);
    });
  }

  async onLoadData(customerId: string) {
    const res = await this.apiResponseS.onGetItem<PeriodClosureResponseDTO[]>(
      Endpoints.AccountingCoi.NativeCollection.PeriodClosures.byCustomer(
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
        Endpoints.AccountingCoi.NativeCollection.PeriodClosures.close(
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
        Endpoints.AccountingCoi.NativeCollection.PeriodClosures.reopen(
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

