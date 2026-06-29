import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  UpperCasePipe,
} from "@angular/common";
import {
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import {
  IonCard,
  IonCardContent,
  IonListHeader,
} from "@ionic/angular/standalone";
import { TableModule } from "primeng/table";
import { Endpoints } from "src/app/core/constants/endpoints";

import { CustomInputSelectSignal } from "src/app/core/components/inputs/web/custom-input-select-signal";
import { CustomButton } from "src/app/core/components/web/buttons";
import { ApiResponseService } from "src/app/core/services/api-response.service";
import { AuthService } from "src/app/core/services/auth.service";
import { CustomerIdService } from "src/app/core/services/customer-id.service";
import { NativeStatementResponseDTO } from "../../models/native-statement.dto";

@Component({
  selector: "app-native-statement",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    CustomInputSelectSignal,
    UpperCasePipe,
    IonCard,
    IonCardContent,
    IonListHeader,
    CustomButton,
  ],
  providers: [DatePipe, CurrencyPipe],
  templateUrl: "./native-statement.html",
})
export class NativeStatement implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private authS = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private customerIdS = inject(CustomerIdService);

  // State
  customerId = signal<string>("");
  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string>("", { nonNullable: true });

  loading = signal<boolean>(false);
  statement = signal<NativeStatementResponseDTO | null>(null);

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
    this.propertyIdCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.statement.set(null);
      });
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      `properties/${this.customerId()}`,
    );
    if (res) {
      this.properties.set(res.map((p) => ({ label: p.label, value: p.value })));
    }
  }

  async searchStatement() {
    const propertyId = this.propertyIdCtrl.value;
    if (!propertyId) return;

    this.loading.set(true);
    try {
      const res = await this.apiResponseS.onGetItem<NativeStatementResponseDTO>(
        Endpoints.AccountingCoi.NativeCollection.Statements.get(propertyId),
      );
      if (res) {
        this.statement.set(res);
      }
    } finally {
      this.loading.set(false);
    }
  }

  exportPdf() {
    // Stub for PDF export functionality (future enhancement)
    window.print();
  }
}
