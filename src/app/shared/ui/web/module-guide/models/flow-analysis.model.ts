export interface ModuleFlowAnalysis {
  module: ModuleInfo;
  flows: Flow[];
  endpoints: Endpoint[];
  components: ComponentInfo[];
  domainEvents: DomainEvent[];
  metadata?: AnalysisMetadata;
}

export interface ModuleInfo {
  name: string;
  description: string;
  version: string;
  backendPath: string;
  frontendPath: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actors: string[];
  steps: FlowStep[];
  notifications: Notification[];
  stateChanges: StateChange[];
}

export interface FlowStep {
  order: number;
  actor: string;
  action: string;
  endpoint: string;
  method: string;
  requestType: string;
  responseType: string;
  sideEffects: string[];
  validations: string[];
  durationEstimateMs?: number;
}

export interface Notification {
  channel: string;
  recipient: string;
  trigger: string;
  template?: string;
}

export interface StateChange {
  entity: string;
  from: string;
  to: string;
  trigger: string;
}

export interface Endpoint {
  method: string;
  path: string;
  description: string;
  auth: string;
  requestType: string;
  responseType: string;
  group?: string;
  rateLimit?: string;
  deprecated?: boolean;
}

export interface ComponentInfo {
  name: string;
  path: string;
  purpose: string;
  selector: string;
  inputs: string[];
  outputs: string[];
  services: string[];
  signals: string[];
  usesResource: boolean;
  usesHttpResource: boolean;
}

export interface DomainEvent {
  name: string;
  handler: string;
  actions: string[];
  publishedBy?: string[];
  subscribers?: string[];
}

export interface AnalysisMetadata {
  generatedAt: string;
  generatedBy: string;
  schemaVersion: string;
  analysisDurationMs: number;
}