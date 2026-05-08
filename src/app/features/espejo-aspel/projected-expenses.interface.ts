import { FormControl } from "@angular/forms";
import { ERecurrence } from "src/app/core/enums/e-recurrence.enum";

export interface IProjectedExpensesForm {
  id: FormControl<string>;
  customerId: FormControl<string>;
  maintenanceCalendarId: FormControl<string>;
  accountingCatalogId: FormControl<string>;
  executionMonth: FormControl<number>;
  budgetedAmount: FormControl<number>;
  concept: FormControl<string>;
  description: FormControl<string>;
  expenseType: FormControl<number>;
  providerId: FormControl<string>;
  isManualEntry: FormControl<boolean>;
  isFromCalendar: FormControl<boolean>;
  externalSystemId: FormControl<string>;
  externalSystemName: FormControl<string>;
  isFromRecurrence: FormControl<boolean>;
  recurrence: FormControl<ERecurrence>;
  // Helper fields
  accountingCatalogName: FormControl<string>;
  providerName: FormControl<string>;
}









