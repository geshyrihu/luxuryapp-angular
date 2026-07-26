export interface DatabaseBackupConfig {
  id: string;
  name: string;
  description: string;
  selectedDatabases: string[];
  cronExpression: string;
  destinationType: string;
  localPath: string;
  graphTenantId: string;
  graphClientId: string;
  graphClientSecret: string;
  graphUserEmail: string;
  graphFolderPath: string;
  retentionDays: number;
  isActive: boolean;
  lastRunAt: string | null;
  lastRunStatus: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateDatabaseBackupConfig {
  name: string;
  description: string;
  selectedDatabases: string[];
  cronExpression: string;
  destinationType: string;
  localPath: string;
  graphTenantId: string;
  graphClientId: string;
  graphClientSecret: string;
  graphUserEmail: string;
  graphFolderPath: string;
  retentionDays: number;
  isActive: boolean;
}

export interface UpdateDatabaseBackupConfig {
  name: string;
  description: string;
  selectedDatabases: string[];
  cronExpression: string;
  destinationType: string;
  localPath: string;
  graphTenantId: string;
  graphClientId: string;
  graphClientSecret: string;
  graphUserEmail: string;
  graphFolderPath: string;
  retentionDays: number;
  isActive: boolean;
}

export interface DatabaseBackupHistory {
  id: string;
  databaseName: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  fileSizeBytes: number | null;
  errorMessage: string;
}
