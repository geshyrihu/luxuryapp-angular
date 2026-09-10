export interface CobranzaOnlineSyncMetadata {
  lastSyncAt: string | null;
  syncStatus: string;
  dataSource: string;
  isFallback: boolean;
  syncMessage: string;
  lastError: string | null;
  lastErrorAt?: string | null;
}

export interface CobranzaOnlineSyncDiagnostics {
  accounts104: number;
  accounts401: number;
  balances104: number;
  balances401: number;
  auxiliaries104: number;
  auxiliaries401: number;
}

export interface CobranzaOnlineSyncResponse {
  cobranza: boolean;
  diagnostics?: CobranzaOnlineSyncDiagnostics | null;
}
