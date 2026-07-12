import { Endpoints } from "src/app/core/constants/endpoints";
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
} from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { WebButtonLabelSave } from "@ui/buttons/web-label/button-save";
import { InputAutocomplete } from "@ui/inputs/adaptive/input-autocomplete/input-autocomplete";
import { CustomInputCheckSignal } from "@ui/inputs/web/custom-input-check-signal";
import { CustomInputCurrencySignal } from "@ui/inputs/web/custom-input-currency-signal";
import { CustomInputSelectSignal } from "@ui/inputs/web/custom-input-select-signal";
import { CustomInputTextSignal } from "@ui/inputs/web/custom-input-text-signal";
import { CustomInputTextAreaSignal } from "@ui/inputs/web/custom-input-textarea-signal";
import { DynamicDialogConfig, DynamicDialogRef } from "primeng/dynamicdialog";
import { firstValueFrom } from "rxjs";
import { AuthService } from "src/app/core/auth/services/auth.service";
import { CustomerIdService } from "src/app/core/auth/services/customer-id.service";
import { Recurrence } from "src/app/core/interfaces/recurrence.enum";
import { ApiResponseService } from "src/app/core/http/services/api-response.service";
import { SelectItemDto } from "src/app/core/interfaces/select-item.dto";
import { DialogHandlerService } from "src/app/core/services/dialog-handler.service";
import { EnumSelectService } from "src/app/core/services/enum-select.service";
@Component({
  selector: "app-projected-expenses-form",
  templateUrl: "./projected-expenses-form.html",
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    ReactiveFormsModule,
    CustomInputCheckSignal,
    InputAutocomplete,
    CustomInputSelectSignal,
    CustomInputTextSignal,
    CustomInputTextAreaSignal,
    CustomInputCurrencySignal,
    WebButtonLabelSave,
  ],
})
export class ProjectedExpensesForm implements OnInit {
  private apiResponseS = inject(ApiResponseService);
  private formB = inject(FormBuilder);
  private authS = inject(AuthService);
  private config = inject(DynamicDialogConfig);
  private dialogHandlerS = inject(DialogHandlerService);
  private ref = inject(DynamicDialogRef);
  private customerIdS = inject(CustomerIdService);
  private enumSelectS = inject(EnumSelectService);
  id: string = "";
  submitting = signal(false);

  cb_accountingCatalogs: SelectItemDto[] = [];
  cb_providers: SelectItemDto[] = [];
  cb_months: SelectItemDto[] = [];
  cb_expenseTypes: SelectItemDto[] = [];
  cb_recurrences: SelectItemDto[] = [];

  // Tipado Estricto
  form = this.formB.nonNullable.group({
    id: [""],
    customerId: [this.customerIdS.customerId()],
    maintenanceCalendarId: [""], // Changed null to empty string or handle nullable properly if strict
    accountingCatalogId: ["", Validators.required],
    executionMonth: [0, Validators.required], // Assuming enum/id is number
    budgetedAmount: [0, [Validators.required, Validators.min(0.01)]],
    concept: ["", [Validators.maxLength(50)]],
    description: ["", [Validators.required, Validators.maxLength(1000)]],
    expenseType: [0, Validators.required],
    providerId: [""], // Changed null to empty string
    isManualEntry: [true],
    isFromCalendar: [false],
    externalSystemId: ["", [Validators.maxLength(100)]],
    externalSystemName: ["", [Validators.maxLength(100)]],
    isFromRecurrence: [false],
    recurrence: [Recurrence.Eventual],
    // Helper fields
    accountingCatalogName: [""],
    providerName: [""],
  });

  async ngOnInit() {
    this.id = this.config.data.id;

    await Promise.all([
      this.loadAccountingCatalogs(),
      this.loadProviders(),
      this.loadMonths(),
      this.loadExpenseTypes(),
      this.loadRecurrences(),
    ]);

    if (this.id !== "") {
      this.onLoadData();
    } else {
      // For new entries
      this.toggleRecurrenceFields(this.form.controls.isFromRecurrence.value);
    }
  }

  private async loadAccountingCatalogs(): Promise<void> {
    this.cb_accountingCatalogs = await this.apiResponseS.onGetSelectItem<
      SelectItemDto[]
    >(`AccountingCatalogs/${this.customerIdS.customerId()}`);
  }

  private async loadProviders(): Promise<void> {
    this.cb_providers = await this.apiResponseS.onGetSelectItem<SelectItemDto[]>(
      `providers/${this.customerIdS.customerId()}`,
    );
  }

  private async loadMonths(): Promise<void> {
    this.cb_months = await firstValueFrom(this.enumSelectS.month());
  }

  private async loadExpenseTypes(): Promise<void> {
    this.cb_expenseTypes = await firstValueFrom(
      this.enumSelectS.onLoadEnumList("e-expense-type"),
    );
  }

  private async loadRecurrences(): Promise<void> {
    this.cb_recurrences = await firstValueFrom(
      this.enumSelectS.onLoadEnumList("e-recurrence"),
    );
  }

  public saveAccountingCatalog(item: SelectItemDto): void {
    this.form.patchValue({
      accountingCatalogId: item?.value ? String(item.value) : "",
      accountingCatalogName: item?.label,
    });
  }

  public saveProvider(item: SelectItemDto): void {
    this.form.patchValue({
      providerId: item?.value ? String(item.value) : "",
      providerName: item?.label,
    });
  }

  onLoadData() {
    this.apiResponseS
      .onGetItem(Endpoints.RefactorContabilidad.projectedExpensesByIdById(this.customerIdS.customerId(), this.id),
      )
      .then((result: any) => {
        this.form.patchValue(result);
        this.form.patchValue({
          accountingCatalogName: result.accountingCatalog,
          providerName: result.providerName,
        });

        if (result.isFromRecurrence) {
          this.form.controls.recurrence.setValue(result.recurrence);
          this.toggleRecurrenceFields(true);
        } else {
          this.toggleRecurrenceFields(false);
        }
      });
  }

  toggleRecurrenceFields(isRecurrence: boolean): void {
    const executionMonthControl = this.form.controls.executionMonth;
    const recurrenceControl = this.form.controls.recurrence;

    executionMonthControl.enable();
    executionMonthControl.setValidators(Validators.required);

    if (isRecurrence) {
      recurrenceControl.enable();
      recurrenceControl.setValidators(Validators.required);

      if (
        recurrenceControl.value === null ||
        recurrenceControl.value === undefined ||
        recurrenceControl.value === Recurrence.Eventual
      ) {
        recurrenceControl.setValue(Recurrence.Eventual);
      }
      this.form.controls.isManualEntry.setValue(false);
      this.form.controls.isFromCalendar.setValue(false);
      this.form.controls.isFromRecurrence.setValue(true);
    } else {
      recurrenceControl.disable();
      recurrenceControl.clearValidators();
      recurrenceControl.setValue(Recurrence.Eventual);
      this.form.controls.isFromRecurrence.setValue(false);
    }
    executionMonthControl.updateValueAndValidity();
    recurrenceControl.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.apiResponseS.validateForm(this.form)) return;

    this.submitting.set(true);

    // Tip: getRawValue() returns the typed object with all fields (even disabled ones)
    const formValue = this.form.getRawValue() as any; // Cast to any to add dynamic properties

    if (formValue.isFromRecurrence) {
      if (this.id !== "") {
        formValue.id = this.id;
      }
      formValue.initialMonth = formValue.executionMonth;
      this.apiResponseS
        .onPost(Endpoints.RefactorContabilidad.projectedExpensesRecurrence, formValue)
        .then((result) => {
          this.ref.close(true);
        })
        .catch((err) => {
          this.submitting.set(false);
        });
    } else if (this.id === "") {
      this.apiResponseS
        .onPost(Endpoints.RefactorContabilidad.projectedExpenses, formValue)
        .then((result) => {
          this.ref.close(true);
        })
        .catch((err) => {
          this.submitting.set(false);
        });
    } else {
      this.apiResponseS
        .onPut(Endpoints.RefactorContabilidad.projectedExpensesByIdById(this.customerIdS.customerId(), this.id),
          formValue,
        )
        .then((result) => {
          this.ref.close(true);
        })
        .catch((err) => {
          this.submitting.set(false);
        });
    }
  }
}
