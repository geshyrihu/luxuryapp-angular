import { AppIcon } from "src/app/core/components/shared/app-icon/app-icon.component";
import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Endpoints } from 'src/app/core/constants/endpoints';
import { ISelectItem } from 'src/app/core/interfaces/select-Item.interface';
import { ApiResponseService } from 'src/app/core/services/api-response.service';
import { CustomerIdService } from 'src/app/core/services/customer-id.service';
import { EnumSelectService } from 'src/app/core/services/enum-select.service';
import { CustomButton } from 'src/app/core/components/buttons/web';
import { CustomInputNumberSignal } from 'src/app/core/components/inputs/web/custom-input-number-signal';
import { CustomInputSelectSignal } from 'src/app/core/components/inputs/web/custom-input-select-signal';

interface JobResult {
  jobName: string;
  executedAt: Date;
  recordsAffected: number;
  success: boolean;
}

@Component({
  selector: 'app-automated-services',
  imports: [CustomButton, CustomInputNumberSignal, CustomInputSelectSignal, ReactiveFormsModule, DatePipe, AppIcon],
  templateUrl: './automated-services.html',
})
export default class AutomatedServices {
  private apiResponseS = inject(ApiResponseService);
  private customerIdS = inject(CustomerIdService);
  private enumSelectS = inject(EnumSelectService);

  running = signal<string | null>(null);
  results = signal<JobResult[]>([]);
  monthOptions = signal<ISelectItem[]>([]);

  monthCtrl = new FormControl<number>(new Date().getMonth() + 1, {
    nonNullable: true,
    validators: [Validators.required, Validators.min(1), Validators.max(12)],
  });
  yearCtrl = new FormControl<number>(new Date().getFullYear(), {
    nonNullable: true,
    validators: [Validators.required],
  });

  constructor() {
    this.enumSelectS.month().subscribe((opts) => this.monthOptions.set(opts));
  }

  async runGenerateCharges() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.running.set('generate');
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.AccountingCoi.NativeCollection.Automation.generateMonthlyCharges,
        { customerId, month: this.monthCtrl.value, year: this.yearCtrl.value },
      );
      this.addResult('Generacion de Cargos Mensuales', typeof count === 'number' ? count : 0, typeof count === 'number');
    } finally {
      this.running.set(null);
    }
  }

  async runLateFees() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.running.set('latefees');
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.AccountingCoi.NativeCollection.Automation.calculateLateFees(customerId),
        {},
      );
      this.addResult('Calculo de Recargos por Mora', typeof count === 'number' ? count : 0, typeof count === 'number');
    } finally {
      this.running.set(null);
    }
  }

  async runEscalateCollections() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.running.set('escalate');
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.AccountingCoi.NativeCollection.Automation.evaluateCollectionCases(customerId),
        {},
      );
      this.addResult('Escalada de Casos de Cobranza', typeof count === 'number' ? count : 0, typeof count === 'number');
    } finally {
      this.running.set(null);
    }
  }

  async runAutoReconcile() {
    const customerId = this.customerIdS.customerId();
    if (!customerId) return;
    this.running.set('reconcile');
    try {
      const count = await this.apiResponseS.onPost<number>(
        Endpoints.AccountingCoi.NativeCollection.Automation.autoReconcile,
        {},
      );
      this.addResult('Auto-Conciliacion de Pagos', typeof count === 'number' ? count : 0, typeof count === 'number');
    } finally {
      this.running.set(null);
    }
  }

  private addResult(jobName: string, recordsAffected: number, success: boolean) {
    this.results.update((prev) => [
      { jobName, executedAt: new Date(), recordsAffected, success },
      ...prev.slice(0, 9),
    ]);
  }

  monthName(m: number): string {
    return this.monthOptions().find((o) => o.value === m)?.label ?? String(m);
  }
}
