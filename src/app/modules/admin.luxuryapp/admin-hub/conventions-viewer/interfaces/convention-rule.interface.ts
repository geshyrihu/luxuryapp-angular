import type { ConventionDomain, ConventionTaskType, SeverityType } from '../conventions-viewer.utils';

export interface ConventionRule {
  id: string;
  title: string;
  description: string;
  severity: SeverityType;
  domain: ConventionDomain;
  taskTypes: ConventionTaskType[];
  technologies: string[];
  examples: {
    angular?: { code: string; description: string };
    dotnet?: { code: string; description: string };
    flutter?: { code: string; description: string };
  };
  relatedRules?: string[];
  sourceDocuments?: string[];
  importance: string;
}
