export interface VaultSecretSummary {
  id: string;
  secretName: string;
  secretType: string;
  tenantId: string | null;
  keyVersion: number;
  isRevoked: boolean;
  lastAccessedAt: string | null;
  accessCount: number;
  createdAt: string;
  createdBy: string;
}
