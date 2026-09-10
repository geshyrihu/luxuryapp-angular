export interface AuditEntry {
  id: string;
  entityName: string;
  entityId: string;
  operationType: "Create" | "Update" | "Delete";
  propertyName: string | null;
  oldValue: string | null;
  newValue: string | null;
  userName: string;
  changedAt: string;
  customerId: string | null;
  groupKey?: string;
  expanded?: boolean;
}
