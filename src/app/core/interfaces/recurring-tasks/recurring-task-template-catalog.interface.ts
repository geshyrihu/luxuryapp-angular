export type RecurringTaskCatalogCriticality = string | number;
export type RecurringTaskCatalogStatus = string | number | boolean;

export interface RecurringTaskTemplateCatalogAddOrEdit {
  title: string;
  description: string;
  recurrenceRule: string;
  criticality: RecurringTaskCatalogCriticality;
  advanceNoticeDays: number;
  startDate: string | null;
  endDate: string | null;
  workGroupId: string;
  backupUserId: string | null;
  expectedDeliverableName: string;
  requiresAttachment: boolean;
}

export interface RecurringTaskTemplateCatalog
  extends RecurringTaskTemplateCatalogAddOrEdit {
  id: string;
  customerId: string;
  workGroupName: string;
  status: RecurringTaskCatalogStatus;
}

export interface RecurringTaskCatalogWorkGroup {
  id: string;
  nameGroup: string;
  visibility: string;
}
