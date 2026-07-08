import { Directive, input, model } from "@angular/core";

export interface OrgChartNode {
  label: string;
  type?: string;
  styleClass?: string;
  expanded?: boolean;
  children?: OrgChartNode[];
  data?: any;
}

@Directive()
export abstract class OrgChartBase {
  value = input<OrgChartNode[]>([]);
  selection = model<any>(null);
}
