import {
  CommonModule,
  CurrencyPipe,
  UpperCasePipe,
} from "@angular/common";
import { ApiDatePipe } from "../../../../../shared/pipes/api-date.pipe";
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { LxCard } from "@ui/adaptive/card/card";
import { LxTag } from "@ui/adaptive/tag/tag";
import { ConfirmService } from "@ui/buttons/shared/confirm.service";
import { WebButtonLabel } from "@ui/buttons/web-label";
import { CustomInputDateSignal } from "@ui/inputs/web/custom-input-date-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { TableModule } from "@ui/web/primeng-table/primeng-table";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Endpoints } from "src/app/core/constants/endpoints/endpoints";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import {
  NativeCollectionRealTimeUpdateDto,
  SignalRService,
} from "src/app/core/services/signalr.service";
import { AppIcon } from "src/app/shared/ui/shared/app-icon/app-icon";
import {
  NativeStatementResponseDTO,
  SendNativeStatementBatchResponseDTO,
} from "../../interfaces/native-statement.dto";

@Component({
  selector: "app-native-statement",
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    LxCard,
    LxTag,
    CustomInputSelectSignal,
    CustomInputDateSignal,
    UpperCasePipe,
    WebButtonLabel,
    AppIcon,
    ApiDatePipe,
  ],
  providers: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: "./native-statement.html",
})
export class NativeStatement implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private destroyRef = inject(DestroyRef);
  private customerIdS = inject(CustomerIdService);
  private signalRService = inject(SignalRService);
  private confirmS = inject(ConfirmService);

  private realtimePropertyId: string | null = null;

  customerId = signal<string>("");
  properties = signal<{ label: string; value: string }[]>([]);
  propertyIdCtrl = new FormControl<string>("", { nonNullable: true });
  asOfCtrl = new FormControl<Date | string | null>(null);

  loading = signal<boolean>(false);
  exportingPdf = signal<boolean>(false);
  sendingStatement = signal<boolean>(false);
  sendingBatchStatements = signal<boolean>(false);
  processingNotifications = signal<boolean>(false);
  statement = signal<NativeStatementResponseDTO | null>(null);

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.realtimePropertyId) {
        void this.signalRService.leaveNativeCollectionPropertyGroup(
          this.realtimePropertyId,
        );
      }
    });

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
      .subscribe((propertyId) => {
        this.syncRealtimePropertyGroup(propertyId);
        this.statement.set(null);
      });

    this.asOfCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.statement.set(null);
      });

    this.signalRService.nativeCollectionUpdate$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((payload) => {
        void this.onRealtimeUpdate(payload);
      });
  }

  private async onRealtimeUpdate(
    payload: NativeCollectionRealTimeUpdateDto,
  ): Promise<void> {
    const currentStatement = this.statement();
    const selectedPropertyId = this.propertyIdCtrl.value;

    if (!currentStatement || !selectedPropertyId) return;
    if (payload.propertyId && payload.propertyId !== selectedPropertyId) return;

    await this.searchStatement();
  }

  private syncRealtimePropertyGroup(propertyId: string | null): void {
    if (this.realtimePropertyId === propertyId) return;

    if (this.realtimePropertyId) {
      void this.signalRService.leaveNativeCollectionPropertyGroup(
        this.realtimePropertyId,
      );
    }

    this.realtimePropertyId = propertyId;

    if (!propertyId) {
      return;
    }

    this.signalRService.start();
    void this.signalRService.joinNativeCollectionPropertyGroup(propertyId);
  }

  async loadProperties() {
    const res = await this.apiResponseS.onGetSelectItem<any[]>(
      Endpoints.SelectItems.properties(this.customerId()),
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
        Endpoints.CobranzaCore.Statements.get(
          propertyId,
          this.asOfCtrl.value
            ? this.asOfCtrl.value instanceof Date
              ? this.asOfCtrl.value.toISOString()
              : this.asOfCtrl.value
            : null,
        ),
      );
      if (res) {
        this.statement.set(res);
      }
    } finally {
      this.loading.set(false);
    }
  }

  private getAsOfValue(): string | null {
    return this.asOfCtrl.value
      ? this.asOfCtrl.value instanceof Date
        ? this.asOfCtrl.value.toISOString()
        : this.asOfCtrl.value
      : null;
  }

  private getStatementPdfUrl(propertyId: string): string {
    return Endpoints.CobranzaCore.Statements.pdf(
      propertyId,
      this.getAsOfValue(),
    );
  }

  private getStatementPdfFileName(): string {
    const propertyName =
      this.statement()
        ?.propertyInfo.propertyName?.trim()
        .replace(/\s+/g, "-")
        .toLowerCase() || "propiedad";
    const cutoffDate = this.getAsOfValue()?.slice(0, 10) || "actual";
    return `estado-cuenta-${propertyName}-${cutoffDate}.pdf`;
  }

  async previewPdf() {
    const propertyId = this.propertyIdCtrl.value;
    if (!propertyId) return;

    this.exportingPdf.set(true);
    try {
      await this.apiResponseS.onPreviewPdf(this.getStatementPdfUrl(propertyId));
    } finally {
      this.exportingPdf.set(false);
    }
  }

  async downloadPdf() {
    const propertyId = this.propertyIdCtrl.value;
    if (!propertyId) return;

    this.exportingPdf.set(true);
    try {
      await this.apiResponseS.onDownloadFile(
        this.getStatementPdfUrl(propertyId),
        this.getStatementPdfFileName(),
      );
    } finally {
      this.exportingPdf.set(false);
    }
  }

  async sendStatementEmail() {
    const propertyId = this.propertyIdCtrl.value;
    if (!propertyId) return;

    this.sendingStatement.set(true);
    try {
      await this.apiResponseS.onPost<boolean>(
        Endpoints.CobranzaCore.Notifications.sendStatement,
        {
          customerId: this.customerId(),
          propertyId,
          asOf: this.asOfCtrl.value
            ? this.asOfCtrl.value instanceof Date
              ? this.asOfCtrl.value.toISOString()
              : this.asOfCtrl.value
            : null,
        },
      );
    } finally {
      this.sendingStatement.set(false);
    }
  }

  async sendBatchStatementEmails() {
    if (!this.customerId()) return;

    const confirmed = await this.confirmS.confirm(
      "Se enviarán estados de cuenta a todas las propiedades del condominio con correo notificable. ¿Deseas continuar?",
      "Enviar estados de cuenta",
    );
    if (!confirmed) return;

    this.sendingBatchStatements.set(true);
    try {
      await this.apiResponseS.onPost<SendNativeStatementBatchResponseDTO>(
        Endpoints.CobranzaCore.Notifications.sendStatementBatch,
        {
          customerId: this.customerId(),
          asOf: this.asOfCtrl.value
            ? this.asOfCtrl.value instanceof Date
              ? this.asOfCtrl.value.toISOString()
              : this.asOfCtrl.value
            : null,
        },
      );
    } finally {
      this.sendingBatchStatements.set(false);
    }
  }

  async processNotifications() {
    if (!this.customerId()) return;

    this.processingNotifications.set(true);
    try {
      await this.apiResponseS.onPost<number>(
        Endpoints.CobranzaCore.Notifications.process(this.customerId()),
      );
    } finally {
      this.processingNotifications.set(false);
    }
  }

  entryTypeSeverity(type: string) {
    return type === "Cargo" ? ("danger" as const) : ("success" as const);
  }
}
